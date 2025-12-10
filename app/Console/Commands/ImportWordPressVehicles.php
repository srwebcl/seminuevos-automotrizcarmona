<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class ImportWordPressVehicles extends Command
{
    protected $signature = 'import:wordpress-vehicles {file}';
    protected $description = 'Import vehicles from WordPress XML export file';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return;
        }

        $this->info("Reading XML file...");
        $xmlContent = file_get_contents($filePath);

        // Remove namespaces to make parsing easier (optional but often helpful)
        $xmlContent = preg_replace('/<wp:post_id>/', '<post_id>', $xmlContent);
        $xmlContent = preg_replace('/<\/wp:post_id>/', '</post_id>', $xmlContent);
        // We will generic parse simplexml with namespaces

        $xml = simplexml_load_string($xmlContent, 'SimpleXMLElement', LIBXML_NOCDATA);
        $namespaces = $xml->getNamespaces(true);

        // --- PASS 1: MAP ATTACHMENTS (IMAGES) ---
        $this->info("Pass 1: Mapping Image Attachments...");
        $imageMap = []; // [ID => URL]

        foreach ($xml->channel->item as $item) {
            $wp = $item->children($namespaces['wp']);
            $postType = (string) $wp->post_type;
            $postId = (string) $wp->post_id;

            if ($postType === 'attachment') {
                $imageMap[$postId] = (string) $wp->attachment_url;
            }
        }

        $this->info("Found " . count($imageMap) . " attachments.");

        // --- PASS 2: PROCESS VEHICLES ---
        $this->info("Pass 2: Importing Vehicles...");
        $count = 0;

        foreach ($xml->channel->item as $item) {
            $wp = $item->children($namespaces['wp']);
            $postType = (string) $wp->post_type;

            if ($postType !== 'auto') {
                continue;
            }

            $title = (string) $item->title;
            $this->info("Processing: $title");

            // Extract Post Meta
            $meta = [];
            foreach ($wp->postmeta as $m) {
                $key = (string) $m->meta_key;
                $val = (string) $m->meta_value;
                // Handle multiple values for same key (like images)
                if (isset($meta[$key])) {
                    if (!is_array($meta[$key])) {
                        $meta[$key] = [$meta[$key]];
                    }
                    $meta[$key][] = $val;
                } else {
                    $meta[$key] = $val;
                }
            }

            // MAPPING DATA
            $brandName = $this->getCategoryValue($item, 'auto-brand');
            $categoryName = $this->getCategoryValue($item, 'type-car') ?? 'Otros';
            $year = $this->getCategoryValue($item, 'year-model') ?? 2020;

            // CLEAN BRAND NAME
            if (!$brandName) {
                // Try to guess from Title
                $parts = explode(' ', trim($title));
                $brandName = $parts[0] ?? 'Sin Marca';
            }
            $brandName = ucwords(strtolower($brandName));

            // CLEAN MODEL NAME
            $model = $meta['DREAM_auto_model'] ?? null;
            if (empty($model) || $model === 'Modelo Desconocido') {
                // Try to parse from Title: [BRAND] [MODEL] ...
                // Remove Brand from Start
                $cleanTitle = trim(str_ireplace($brandName, '', $title));
                // Take next 2 words as model (heuristic)
                $words = explode(' ', $cleanTitle);
                $model = ($words[0] ?? '') . ' ' . ($words[1] ?? '');
                $model = trim($model);
                if (empty($model))
                    $model = 'Modelo Desconocido';
            }

            // Create/Find Relations
            $brand = Brand::firstOrCreate(['name' => $brandName], ['slug' => Str::slug($brandName)]);
            $category = Category::firstOrCreate(['name' => $categoryName], ['slug' => Str::slug($categoryName), 'is_active' => true]);

            // Location (Default to La Serena if missing)
            $location = Location::firstOrCreate(['name' => 'Casa Matriz'], ['address' => 'Balmaceda 2000', 'city' => 'La Serena']);

            // Parse Price & KM
            $price = isset($meta['DREAM_auto_price']) ? (int) preg_replace('/[^0-9]/', '', $meta['DREAM_auto_price']) : 0;
            // HEURISTIC FIX: If price is > 2 Billion, it's likely a typo (extra zeros). Correct by dividing by 1000.
            if ($price > 2000000000) {
                $price = (int) ($price / 1000);
            }
            // If STILL huge, cap it to avoid crash
            if ($price > 2000000000) {
                $this->warn("  Warning: Price still too high ($price). Capping at 2B.");
                $price = 2000000000;
            }

            $km = isset($meta['DREAM_auto_km_done']) ? (int) preg_replace('/[^0-9]/', '', $meta['DREAM_auto_km_done']) : 0;

            // Description (Content)
            $content = (string) $item->children('content', true)->encoded;
            $description = strip_tags($content);

            // Images
            $sliderIds = $meta['DREAM_auto_slider'] ?? [];
            if (!is_array($sliderIds))
                $sliderIds = [$sliderIds];

            // Also check thumbnail_id
            if (isset($meta['_thumbnail_id'])) {
                array_unshift($sliderIds, $meta['_thumbnail_id']);
            }
            $sliderIds = array_unique($sliderIds);

            // Use WordPress SLUG to match existing cars
            // Logic: Parse from <link> tag which has the real URL
            // e.g. https://www.seminuevos.automotrizcarmona.cl/auto/SLUG/
            $link = (string) $item->link;
            $slug = '';
            if ($link) {
                // Remove trailing slash
                $link = rtrim($link, '/');
                $parts = explode('/', $link);
                $slug = end($parts);
            }
            // Fallback to post_name
            if (empty($slug)) {
                $slug = (string) $wp->post_name;
            }
            // Fallback to random
            if (empty($slug)) {
                $slug = Str::slug($brandName . '-' . $model . '-' . $year . '-' . Str::random(4));
            }

            // Create OR Update Vehicle
            $vehicle = Vehicle::updateOrCreate(
                ['slug' => $slug],
                [
                    'brand_id' => $brand->id,
                    'category_id' => $category->id,
                    'location_id' => $location->id,
                    'model' => $model,
                    'year' => (int) $year,
                    'price' => $price,
                    'km' => $km,
                    'transmission' => $meta['DREAM_auto_transmission'] ?? 'Automática',
                    'fuel' => $meta['DREAM_fuel_type'] ?? 'Gasolina',
                    'description' => trim($description),
                    'is_published' => true,
                    'is_featured' => ($meta['DREAM_featured_auto'] ?? 'no') === 'yes',
                    // Photos updated below
                ]
            );

            // DOWNLOAD PHOTOS
            $photos = [];
            $disk = Storage::disk('public');
            $folder = "vehicles/{$vehicle->id}";

            foreach ($sliderIds as $imgId) {
                if (isset($imageMap[$imgId])) {
                    $url = $imageMap[$imgId];
                    if (empty($url))
                        continue;

                    $filename = basename($url);
                    // Avoid query strings in filename
                    $filename = explode('?', $filename)[0];
                    $destPath = "$folder/$filename";

                    // Download
                    try {
                        $contents = @file_get_contents($url);
                        if ($contents) {
                            $disk->put($destPath, $contents);
                            $photos[] = $destPath;
                            $this->line("  Downloaded: $filename");
                        }
                    } catch (\Exception $e) {
                        $this->warn("  Failed to download: $url");
                    }
                }
            }

            // Update Photos Array
            $vehicle->update(['photos' => $photos]);
            $count++;
        }

        $this->info("Import Completed! Imported $count vehicles.");
    }

    private function getCategoryValue($item, $domain)
    {
        foreach ($item->category as $cat) {
            if ((string) $cat['domain'] === $domain) {
                return (string) $cat;
            }
        }
        return null;
    }
}
