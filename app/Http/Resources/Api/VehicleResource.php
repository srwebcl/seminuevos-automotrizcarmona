<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class VehicleResource extends JsonResource
{
    /**
     * Create a new resource instance.
     *
     * @param  mixed  $resource
     * @return void
     */
    public function __construct($resource)
    {
        parent::__construct($resource);
    }
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
                // Use asset() to automatically generate the correct URL (Local or Production)
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
            'price_financing' => $this->price_financing,
            'price_financing_formatted' => $this->price_financing ? '$' . number_format($this->price_financing, 0, ',', '.') : null,
            'price_offer' => $this->price_offer,
            'price_offer_formatted' => $this->price_offer ? '$' . number_format($this->price_offer, 0, ',', '.') : null,
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
            'is_offer' => (bool) $this->is_offer,
            'is_clearance' => (bool) $this->is_clearance,

            // Media
            'cover_photo' => !empty($photos) ? $photos[0] : null,
            'photos' => $photos,

            // Tags
            'tags' => $this->tags->map(function ($tag) {
                return [
                    'name' => $tag->name,
                    'bg_color' => $tag->bg_color,
                    'text_color' => $tag->text_color,
                ];
            }),

            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
