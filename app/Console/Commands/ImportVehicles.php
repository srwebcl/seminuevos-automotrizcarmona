<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Vehicle;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportVehicles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicles:import {file?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import vehicles from a CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file') ?? base_path('Inventario Seminuevos.xlsx - vehiculos-2026-01-13.csv');

        if (!file_exists($file)) {
            $this->error("File not found: $file");
            return 1;
        }

        $this->info("Reading file: $file");

        $csv = array_map('str_getcsv', file($file));
        $header = array_shift($csv);

        // Normalized header map
        $headerMap = [
            'ID' => 'id',
            'Marca' => 'brand',
            'Modelo' => 'model',
            'Año' => 'year',
            'Kilometraje' => 'km',
            'Motor' => 'motor',
            'Color' => 'color',
            'Transmisión' => 'transmission',
            'Combustible' => 'fuel',
            'Tracción' => 'traction',
            'Ubicación' => 'location',
            'Categoría' => 'category',
            'Precio Contado' => 'price',
            'Precio Crédito' => 'price_financing',
            'Precio Oferta' => 'price_offer',
            'Estado' => 'status',
            'Etiquetas' => 'tags',
            'Descripción' => 'description',
        ];

        // Map header indices
        $indices = [];
        foreach ($header as $index => $col) {
            $colName = trim($col);
            if (isset($headerMap[$colName])) {
                $indices[$headerMap[$colName]] = $index;
            }
        }

        $bar = $this->output->createProgressBar(count($csv));
        $bar->start();

        foreach ($csv as $row) {
            if (count($row) < count($header)) {
                continue; // Skip malformed rows
            }

            try {
                $id = $this->getValue($row, $indices, 'id');
                if (!$id)
                    continue;

                $brandName = $this->getValue($row, $indices, 'brand');
                $brand = Brand::firstOrCreate(
                    ['slug' => Str::slug($brandName)],
                    ['name' => $brandName]
                );

                $categoryName = $this->getValue($row, $indices, 'category');
                $category = Category::firstOrCreate(
                    ['slug' => Str::slug($categoryName)],
                    ['name' => $categoryName]
                );

                $locationName = $this->getValue($row, $indices, 'location');

                // DATA NORMALIZATION
                // Fix typos in Location
                if (trim($locationName) === 'Usados Premiun' || trim($locationName) === 'Usados Premiun ') {
                    $locationName = 'Usados Premium';
                }

                $location = Location::firstOrCreate(
                    ['name' => $locationName],
                    ['address' => 'Dirección por definir', 'city' => 'La Serena']
                );

                $vehicleData = [
                    'brand_id' => $brand->id,
                    'category_id' => $category->id,
                    'location_id' => $location->id,
                    'model' => $this->getValue($row, $indices, 'model'),
                    'year' => (int) $this->getValue($row, $indices, 'year'),
                    'km' => (int) $this->getValue($row, $indices, 'km'),
                    'motor' => $this->getValue($row, $indices, 'motor'),
                    'color' => $this->getValue($row, $indices, 'color'),
                    'transmission' => $this->getValue($row, $indices, 'transmission'),
                    'fuel' => $this->getValue($row, $indices, 'fuel'),
                    'traction' => $this->getValue($row, $indices, 'traction'),
                    'price' => $this->parsePrice($this->getValue($row, $indices, 'price')),
                    'price_financing' => $this->parsePrice($this->getValue($row, $indices, 'price_financing')),
                    'price_offer' => $this->parsePrice($this->getValue($row, $indices, 'price_offer')),
                    'is_published' => $this->getValue($row, $indices, 'status') === 'Publicado',
                    'description' => $this->getValue($row, $indices, 'description'),
                ];

                // Create or Update
                $vehicle = Vehicle::withTrashed()->find($id);
                if ($vehicle) {
                    // Update
                    $vehicle->update($vehicleData);
                    if ($vehicle->trashed()) {
                        $vehicle->restore();
                    }
                } else {
                    // Create with specific ID
                    $vehicle = new Vehicle();
                    $vehicle->id = $id;
                    $vehicle->fill($vehicleData);
                    $vehicle->save();
                }

                // Handle Tags
                $tagNames = explode(',', $this->getValue($row, $indices, 'tags') ?? '');
                $tagIds = [];
                foreach ($tagNames as $tagName) {
                    $tagName = trim($tagName);
                    if (empty($tagName))
                        continue;

                    // Check for special tags (mapped to booleans in VehicleResource/Model)
                    // We might want to set the booleans on the vehicle too if they exist there
                    // But typically tags are separate.
                    // However, we recently added ToggleColumns for is_premium, is_featured, is_offer
                    // which were previously tags? No, they were System Flags.
                    // Let's see if the CSV 'Etiquetas' contains 'Oferta', 'Premium', 'Destacado'.

                    if (strtolower($tagName) === 'oferta') {
                        $vehicle->is_offer = true;
                    }
                    if (strtolower($tagName) === 'premium') {
                        $vehicle->is_premium = true;
                    }
                    if (strtolower($tagName) === 'destacado') {
                        $vehicle->is_featured = true;
                    }
                }

                // Infer Premium from Location (e.g. "Usados Premium", "Usados Premiun")
                $csvLocation = strtolower($this->getValue($row, $indices, 'location') ?? '');
                if (str_contains($csvLocation, 'premium') || str_contains($csvLocation, 'premiun')) {
                    $vehicle->is_premium = true;
                }

                $vehicle->save();

                // Also create/attach as Tag model for other tags or consistency
                $tagIds = [];
                foreach ($tagNames as $tagName) {
                    $tagName = trim($tagName);
                    if (empty($tagName))
                        continue;
                    $tag = Tag::firstOrCreate(['name' => $tagName]);
                    $tagIds[] = $tag->id;
                }
                $vehicle->tags()->sync($tagIds);

            } catch (\Exception $e) {
                $this->error("\nError processing row ID " . ($row[$indices['id']] ?? 'unknown') . ": " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->info("\nImport completed successfully.");
    }

    private function getValue($row, $indices, $key)
    {
        return isset($indices[$key]) ? trim($row[$indices[$key]]) : null;
    }

    private function parsePrice($value)
    {
        if (!$value)
            return null;
        return (int) preg_replace('/[^0-9]/', '', $value);
    }
}
