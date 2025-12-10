<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

class ScrapeVehicleImages extends Command
{
    protected $signature = 'scrape:images {--limit=0}';
    protected $description = 'Scrape images from live website for existing vehicles';

    public function handle()
    {
        $vehicles = Vehicle::where('is_published', true)->orderBy('created_at', 'desc');

        if ($this->option('limit') > 0) {
            $vehicles->limit($this->option('limit'));
        }

        $vehicles = $vehicles->get();
        $this->info("Found " . $vehicles->count() . " vehicles to process.");

        $disk = Storage::disk('public');
        // mimics Chrome on Windows
        $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        $fullHeaders = [
            'User-Agent' => $userAgent,
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language' => 'es-ES,es;q=0.9,en;q=0.8',
            'Referer' => 'https://www.seminuevos.automotrizcarmona.cl/',
            'Connection' => 'keep-alive',
            'Upgrade-Insecure-Requests' => '1',
            'Sec-Fetch-Dest' => 'document',
            'Sec-Fetch-Mode' => 'navigate',
            'Sec-Fetch-Site' => 'same-origin',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'no-cache',
        ];

        foreach ($vehicles as $vehicle) {
            // SKIP TRASHED
            if (str_contains($vehicle->slug, '__trashed') || str_contains($vehicle->slug, 'borrador')) {
                // $this->warn("Skipping Trashed/Draft: {$vehicle->slug}");
                continue;
            }

            // Construct URL
            // If slug implies query params (e.g. ?post_type=auto&p=123)
            if (str_starts_with($vehicle->slug, '?')) {
                $url = "https://www.seminuevos.automotrizcarmona.cl/" . $vehicle->slug;
            } else {
                $url = "https://www.seminuevos.automotrizcarmona.cl/auto/{$vehicle->slug}/";
            }

            $this->info("Processing: {$vehicle->slug}");

            // Random Delay to avoid WAF aggregation
            sleep(rand(1, 2));

            try {
                $response = Http::withHeaders($fullHeaders)
                    ->timeout(20)
                    ->get($url);

                if ($response->failed()) {
                    // If 404, maybe slug is wrong. Try searching by Title/Model?
                    $this->warn("  Failed to fetch: $url (Status: " . $response->status() . ")");
                    continue;
                }

                $html = $response->body();

                // Regex find all images in the slider
                // Pattern based on browser_subagent findings: 
                // We saw URLs inside `.listing_images_slider ... img`
                // Let's grab all images that are in wp-content/uploads/

                // Find images in src, data-src, data-lazy, or background-image
                preg_match_all('/(src|data-src|data-lazy|href|url)=["\']([^"\']+\.(jpg|jpeg|png))["\']/i', $html, $matches);

                $imageUrls = array_unique($matches[2]); // Group 2 is URL

                $validImages = [];
                $blacklist = ['logo', 'icon', 'cta-', 'mesa-de-trabajo', 'whatsapp', 'banner'];

                foreach ($imageUrls as $imgUrl) {
                    // Filter wp-content/uploads only
                    if (!str_contains($imgUrl, 'wp-content/uploads'))
                        continue;

                    // Filter small thumbnails
                    if (str_contains($imgUrl, '150x150') || str_contains($imgUrl, '100x100'))
                        continue;

                    // Blacklist Check
                    $filenameLower = strtolower(basename($imgUrl));
                    foreach ($blacklist as $badWord) {
                        if (str_contains($filenameLower, $badWord))
                            continue 2; // Skip this image
                    }

                    $validImages[] = $imgUrl;
                }

                // If we found nothing, try relaxed regex
                if (empty($validImages)) {
                    $this->warn("  No images found via regex. Skipping.");
                    continue;
                }

                $this->info("  Found " . count($validImages) . " potential images.");

                $storedPhotos = [];
                $folder = "vehicles/{$vehicle->id}";

                // Limit to 15 photos max
                $validImages = array_slice($validImages, 0, 15);

                foreach ($validImages as $imgUrl) {
                    $filename = basename(parse_url($imgUrl, PHP_URL_PATH));
                    $destPath = "$folder/$filename";

                    // Skip if already exists
                    if ($disk->exists($destPath)) {
                        $storedPhotos[] = $destPath;
                        continue;
                    }

                    try {
                        $imgContent = Http::withHeaders(['User-Agent' => $userAgent])->get($imgUrl)->body();
                        if (strlen($imgContent) > 1000) { // Valid image check
                            $disk->put($destPath, $imgContent);
                            $storedPhotos[] = $destPath;
                            $this->line("  Downloaded: $filename");
                        }
                    } catch (\Exception $e) {
                        $this->warn("  Download failed: $imgUrl");
                    }
                }

                // Update Vehicle
                if (!empty($storedPhotos)) {
                    $vehicle->update(['photos' => $storedPhotos]);
                    $this->info("  Updated vehicle with " . count($storedPhotos) . " photos.");
                }

            } catch (\Exception $e) {
                $this->error("  Error processing {$vehicle->slug}: " . $e->getMessage());
            }
        }

        $this->info("Scraping Completed.");
    }
}
