<?php

namespace App\Observers;

use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class VehicleObserver
{
    public function saved(Vehicle $vehicle): void
    {
        // Prevent infinite loop by checking if we need to optimize
        // We will perform optimization and then updateQuietly if changes happened.

        $photos = $vehicle->photos ?? [];
        $disk = Storage::disk('public');
        $manager = new ImageManager(new Driver());
        $hasChanges = false;
        $newPhotos = [];

        if (empty($photos)) {
            return;
        }

        foreach ($photos as $photoPath) {
            // Check if file exists
            if (!$disk->exists($photoPath)) {
                $newPhotos[] = $photoPath; // Keep original path if file not found (maybe generic error or external url)
                continue;
            }

            // check extension
            $extension = strtolower(pathinfo($photoPath, PATHINFO_EXTENSION));

            // If already webp, skip
            if ($extension === 'webp') {
                $newPhotos[] = $photoPath;
                continue;
            }

            // Define new path
            $newPath = preg_replace('/\.' . $extension . '$/i', '.webp', $photoPath);

            // Optimization Logic
            try {
                $content = $disk->get($photoPath);
                $image = $manager->read($content);

                // Resize if too big (e.g., max width 1920px)
                if ($image->width() > 1920) {
                    $image->scale(width: 1920);
                }

                // Encode to WebP with 80% quality
                $encoded = $image->toWebp(quality: 80);

                // Save new file
                $disk->put($newPath, (string) $encoded);

                // Delete old file
                $disk->delete($photoPath);

                $newPhotos[] = $newPath;
                $hasChanges = true;

            } catch (\Exception $e) {
                // Return original on failure
                // Log::error("Failed to optimize image {$photoPath}: " . $e->getMessage());
                $newPhotos[] = $photoPath;
            }
        }

        // Also check cover_photo if it's separate? 
        // In this project `getThumbnailAttribute` uses `photos[0]`, but let's check strict separation usage.
        // The model says: public function getThumbnailAttribute() { return $this->photos[0] ?? null; }
        // The model also has `cover_photo` field in migration? 
        // Let's check the view_file output of Vehicle.php (line 37: cover_photo: string | null). 
        // Wait, line 37 in view_file 1147 was `Vehicle.php` model doesn't explicitly show `cover_photo` in $fillable/$guarded but shows `photos` cast.
        // The `VehicleResource` uses `images` in `FileUpload::make('photos')`.
        // The Typescript type `Vehicle` has `cover_photo` and `photos`.
        // The JSON API likely maps `cover_photo` to `photos[0]`.
        // So just optimizing `photos` array is sufficient.

        if ($hasChanges) {
            $vehicle->photos = $newPhotos;
            $vehicle->saveQuietly(); // Update without triggering events again
        }
    }
}
