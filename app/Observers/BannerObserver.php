<?php

namespace App\Observers;

use App\Models\Banner;
use App\Services\ImageOptimizer;

class BannerObserver
{
    protected $optimizer;

    public function __construct(ImageOptimizer $optimizer)
    {
        $this->optimizer = $optimizer;
    }

    public function saved(Banner $banner): void
    {
        $hasChanges = false;

        // 1. Optimize `image_path` (Array or String depending on old data, but cast ensures Array access)
        $images = $banner->image_path;
        if (!empty($images) && is_array($images)) {
            $newImages = [];
            $imagesChanged = false;

            foreach ($images as $path) {
                // If path is array ?? safety
                if (is_array($path))
                    continue;
                $newPath = $this->optimizer->optimize($path);
                $newImages[] = $newPath;
                if ($path !== $newPath) {
                    $imagesChanged = true;
                }
            }

            if ($imagesChanged) {
                $banner->image_path = $newImages;
                $hasChanges = true;
            }
        } elseif (!empty($images) && is_string($images)) {
            $newPath = $this->optimizer->optimize($images);
            if ($images !== $newPath) {
                $banner->image_path = [$newPath]; // Force array
                $hasChanges = true;
            }
        }

        // 2. Optimize `mobile_image_path` (Single String)
        if (!empty($banner->mobile_image_path) && is_string($banner->mobile_image_path)) {
            $newPath = $this->optimizer->optimize($banner->mobile_image_path);
            if ($banner->mobile_image_path !== $newPath) {
                $banner->mobile_image_path = $newPath;
                $hasChanges = true;
            }
        }

        if ($hasChanges) {
            $banner->saveQuietly();
        }
    }
}

