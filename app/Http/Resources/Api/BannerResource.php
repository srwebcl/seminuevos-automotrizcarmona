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
            'image_url' => $this->image_path ? Storage::url($this->image_path) : null,
            'mobile_image_url' => $this->mobile_image_path ? Storage::url($this->mobile_image_path) : null,
            'video_url' => $this->video_path ? Storage::url($this->video_path) : null,
            'link' => $this->link,
            'category_slug' => $this->category ? $this->category->slug : null,
            'sort_order' => $this->sort_order,
        ];
    }
}
