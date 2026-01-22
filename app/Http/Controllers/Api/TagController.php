<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Get list of active tags that have at least one published vehicle.
     */
    public function index()
    {
        // 1. Fetch tags that are active
        // 2. Load count of 'vehicles' that are published
        // 3. Filter tags that have count > 0 using 'has'

        $tags = Tag::where('is_active', true)
            ->whereHas('vehicles', function ($query) {
                $query->where('is_published', true);
            })
            ->withCount([
                'vehicles' => function ($query) {
                    $query->where('is_published', true);
                }
            ])
            ->get();

        return response()->json([
            'data' => $tags
        ]);
    }
}
