<?php

namespace App\Observers;

use App\Models\Vehicle;
use App\Services\ImageOptimizer;

class VehicleObserver
{
    protected $optimizer;

    public function __construct(ImageOptimizer $optimizer)
    {
        $this->optimizer = $optimizer;
    }

    public function saved(Vehicle $vehicle): void
    {
        // Avoid infinite loop since we saveQuietly, but good practice to check if dirty if possible.
        // However, Filament syncs might make isDirty tricky for array casts sometimes.
        // We will process photos and if any path changes, we update.

        $photos = $vehicle->photos ?? [];
        if (empty($photos)) {
            return;
        }

        $newPhotos = [];
        $hasChanges = false;

        foreach ($photos as $photo) {
            $newPath = $this->optimizer->optimize($photo);
            $newPhotos[] = $newPath;

            if ($photo !== $newPath) {
                $hasChanges = true;
            }
        }

        if ($hasChanges) {
            $vehicle->photos = $newPhotos;
            $vehicle->saveQuietly();
        }
    }
}
