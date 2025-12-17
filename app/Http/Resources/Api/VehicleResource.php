<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class VehicleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Transform photos array from relative paths to full URLs
        $photos = [];
        if (!empty($this->photos) && is_array($this->photos)) {
            foreach ($this->photos as $photo) {
                // Ensure we handle both local storage and potential S3/external correctly if needed later
                // For now, per instructions: asset('storage/' . $path)
                $photos[] = asset('storage/' . $photo);
            }
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'model' => $this->model,
            'brand' => [
                'name' => $this->brand?->name ?? 'Generico',
                'slug' => $this->brand?->slug,
            ],
            'category' => [
                'name' => $this->category?->name ?? 'Seminuevos',
                'slug' => $this->category?->slug,
            ],
            'price' => $this->price,
            'price_formatted' => '$' . number_format($this->price, 0, ',', '.'),
            'year' => $this->year,
            'km' => $this->km,
            'km_formatted' => number_format($this->km, 0, ',', '.') . ' km',

            // Technical details
            'transmission' => $this->transmission,
            'fuel' => $this->fuel,
            'traction' => $this->traction,
            'motor' => $this->motor,
            'color' => $this->color,
            'description' => $this->description,

            // Flags
            'is_published' => (bool) $this->is_published,
            'is_featured' => (bool) $this->is_featured,
            'is_premium' => (bool) $this->is_premium,

            // Media
            'cover_photo' => !empty($photos) ? $photos[0] : null,
            'photos' => $photos,

            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
