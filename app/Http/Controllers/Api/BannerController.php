<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        // DEBUG MODE: Bypass Resource to identify error
        $banners = Banner::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        // Manual mapping to ensure no Resource dependency
        $data = $banners->map(function ($banner) {
            return [
                'id' => $banner->id,
                'type' => $banner->type,
                'image_url' => $banner->image_path ? 'https://api-dev.automotrizcarmona.cl/storage/' . $banner->image_path : null, // Hardcoded fix
                'video_url' => $banner->video_path ? 'https://api-dev.automotrizcarmona.cl/storage/' . $banner->video_path : null, // Hardcoded fix
            ];
        });

        return response()->json(['data' => $data]);
    }
}
