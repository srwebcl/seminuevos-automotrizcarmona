<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\Vehicle;
use App\Models\Brand;
use App\Models\Category;

class ImportVehiclesCommand extends Command
{
    protected $signature = 'autos:import';
    protected $description = 'Importa SOLO autos que tengan carpeta de fotos física';

    public function handle()
    {
        $jsonPath = storage_path('app/import_temp/base_datos_autos_dream.json');
        $photosBasePath = storage_path('app/import_temp/photos');

        if (!file_exists($jsonPath)) {
            $this->error("❌ Error: No encuentro 'base_datos_autos_dream.json'");
            return;
        }

        $autos = json_decode(file_get_contents($jsonPath), true);

        // Contadores para el reporte final
        $totalProcesados = 0;
        $totalIgnorados = 0;

        $bar = $this->output->createProgressBar(count($autos));
        $bar->start();

        foreach ($autos as $autoData) {

            // --- FILTRO MAESTRO: ¿EXISTE LA CARPETA? ---
            $slugCarpeta = $autoData['Slug_Carpeta'];
            $rutaOrigenFotos = $photosBasePath . '/' . $slugCarpeta;

            if (!File::exists($rutaOrigenFotos)) {
                // Si no hay fotos descargadas para este auto, LO SALTAMOS.
                $totalIgnorados++;
                $bar->advance();
                continue;
            }

            // Si llegamos aquí, es porque SÍ hay fotos. Procesamos el auto.
            $totalProcesados++;

            // 1. MARCA
            $brandName = $autoData['Marca'] ?: 'Generico';
            $brand = Brand::firstOrCreate(
                ['name' => $brandName],
                ['slug' => Str::slug($brandName), 'is_active' => true]
            );

            // 2. CATEGORÍA
            $catName = $autoData['Categoría'] ?: 'Seminuevos';
            $category = Category::firstOrCreate(
                ['name' => $catName],
                ['slug' => Str::slug($catName), 'is_active' => true]
            );

            // --- CORRECCIÓN DE PRECIO ---
            $precioRaw = preg_replace('/[^0-9]/', '', $autoData['Precio']);
            $precio = (int) $precioRaw;
            if ($precio > 2000000000) { // Fix del Jeep de 20 mil millones
                $precio = (int) ($precio / 1000);
            }

            // 3. FOTOS
            $rutasDeFotos = [];
            $slugFinal = Str::slug($brandName . '-' . $autoData['Modelo_Final'] . '-' . $autoData['Año'] . '-' . Str::random(4));

            $archivos = File::files($rutaOrigenFotos);
            sort($archivos);
            foreach ($archivos as $archivo) {
                if (in_array(strtolower($archivo->getExtension()), ['webp', 'jpg', 'jpeg', 'png'])) {
                    $pathRelativo = "vehicles/{$slugFinal}/" . $archivo->getFilename();
                    Storage::disk('public')->put($pathRelativo, File::get($archivo));
                    $rutasDeFotos[] = $pathRelativo;
                }
            }

            // 4. GUARDAR
            try {
                Vehicle::create([
                    'brand_id' => $brand->id,
                    'category_id' => $category->id,
                    'model' => $autoData['Modelo_Final'],
                    'year' => (int) $autoData['Año'],
                    'km' => (int) $autoData['Kilometraje'],
                    'price' => $precio,

                    'transmission' => $autoData['Transmisión'],
                    'fuel' => $autoData['Combustible'],
                    'traction' => $autoData['Tracción'],
                    'motor' => $autoData['Motor'],
                    'color' => $autoData['Color'],

                    'is_published' => ($precio > 0),
                    'is_featured' => $autoData['Destacado'],
                    'is_premium' => in_array($brandName, ['BMW', 'Audi', 'Mercedes-Benz', 'Volvo', 'Porsche']),

                    'slug' => $slugFinal,
                    'description' => $autoData['Descripción'],
                    'photos' => count($rutasDeFotos) > 0 ? $rutasDeFotos : null,
                ]);
            } catch (\Exception $e) {
                // Silencioso para no cortar el flujo
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("✅ FINALIZADO:");
        $this->info("   - Autos Importados: $totalProcesados (Coinciden con tus carpetas)");
        $this->info("   - Autos Ignorados: $totalIgnorados (Estaban en BD pero sin fotos)");
    }
}