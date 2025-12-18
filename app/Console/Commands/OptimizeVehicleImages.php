<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class OptimizeVehicleImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize-all {--force : Force re-optimization even if already WebP}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Convierte todas las imágenes de vehículos a WebP y las optimiza';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando optimización de imágenes...');

        $vehicles = Vehicle::all();
        $manager = new ImageManager(new Driver());
        $disk = Storage::disk('public');
        $bar = $this->output->createProgressBar(count($vehicles));
        $bar->start();

        foreach ($vehicles as $vehicle) {
            $photos = $vehicle->photos ?? [];
            $newPhotos = [];
            $hasChanges = false;
            $force = $this->option('force');

            foreach ($photos as $photoPath) {
                if (!$disk->exists($photoPath)) {
                    $newPhotos[] = $photoPath;
                    continue;
                }

                $extension = strtolower(pathinfo($photoPath, PATHINFO_EXTENSION));

                // Skip if already WebP unless forced
                if ($extension === 'webp' && !$force) {
                    $newPhotos[] = $photoPath;
                    continue;
                }

                $newPath = preg_replace('/\.' . $extension . '$/i', '.webp', $photoPath);

                try {
                    $content = $disk->get($photoPath);
                    $image = $manager->read($content);

                    if ($image->width() > 1920) {
                        $image->scale(width: 1920);
                    }

                    $encoded = $image->toWebp(quality: 80);
                    $disk->put($newPath, (string) $encoded);

                    // Delete old if different extension
                    if ($newPath !== $photoPath) {
                        $disk->delete($photoPath);
                    }

                    $newPhotos[] = $newPath;
                    $hasChanges = true;

                } catch (\Exception $e) {
                    $this->error("Error optimizando {$photoPath}: " . $e->getMessage());
                    $newPhotos[] = $photoPath;
                }
            }

            if ($hasChanges) {
                $vehicle->photos = $newPhotos;
                $vehicle->saveQuietly();
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('¡Optimización completada!');
    }
}
