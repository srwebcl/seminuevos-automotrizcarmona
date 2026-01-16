<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BannerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type, // hero, full, promo
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image_url' => $this->getImagesUrl($this->image_path), // Always returns array
            'mobile_image_url' => $this->mobile_image_path ? $this->getStorageUrl($this->mobile_image_path) : null,
            'video_url' => $this->video_path ? $this->getStorageUrl($this->video_path) : null,
            'link' => $this->link,
            'category_slug' => $this->category ? $this->category->slug : null,
            'sort_order' => $this->sort_order,
        ];
    }

    private function getImagesUrl(mixed $path): array
    {
        if (!$path) {
            return [];
        }

        if (is_array($path)) {
            return array_map(fn($p) => $this->getStorageUrl($p), $path);
        }

        return [$this->getStorageUrl($path)];
    }

    private function getStorageUrl(?string $path): ?string
    {
        if (!$path)
            return null;

        // Use asset helper to generate correct URL for local/prod environments
        return asset('storage/' . $path);
    }
}
