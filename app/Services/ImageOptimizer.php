<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageOptimizer
{
    /**
     * Optimize an image: Resize if too large and convert to WebP.
     *
     * @param string $path The relative path to the image in storage (public disk).
     * @param int $maxWidth Maximum width in pixels.
     * @param int $quality WebP quality (0-100).
     * @return string The new relative path of the optimized image.
     */
    public function optimize(string $path, int $maxWidth = 1920, int $quality = 80): string
    {
        // Check if file exists in public disk
        if (!Storage::disk('public')->exists($path)) {
            return $path;
        }

        // Get full path for Intervention Image
        $fullPath = Storage::disk('public')->path($path);

        try {
            // Instantiate Manager with GD Driver (Safe default for most hostings)
            $manager = new ImageManager(new Driver());

            // Read image
            $image = $manager->read($fullPath);

            // Resize only if width is greater than max width
            if ($image->width() > $maxWidth) {
                $image->scale(width: $maxWidth);
            }

            // Define new path with .webp extension
            $pathInfo = pathinfo($path);
            $newPath = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '.webp';
            $newFullPath = Storage::disk('public')->path($newPath);

            // Encode to WebP
            $encoded = $image->toWebp($quality);

            // Save encoded image
            $encoded->save($newFullPath);

            // If the path changed (was not already webp), delete the original
            if ($path !== $newPath) {
                Storage::disk('public')->delete($path);
            }

            return $newPath;

        } catch (\Exception $e) {
            // Log error but verify functionality manually first
            // Log::error("Image optimization failed for {$path}: " . $e->getMessage());
            return $path;
        }
    }
}
