<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::with(['brand', 'category'])
            ->where('is_published', true);

        if ($request->has('category')) {
            $slug = $request->query('category');
            // Support filtering by category slug
            $query->whereHas('category', function ($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        if ($request->has('is_premium')) {
            $query->where('is_premium', true);
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', true);
        }

        $vehicles = $query->orderBy('created_at', 'desc')->paginate(12);

        return VehicleResource::collection($vehicles);
    }

    public function featured()
    {
        $vehicles = Vehicle::with(['brand', 'category'])
            ->where('is_published', true)
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return VehicleResource::collection($vehicles);
    }

    public function show($slug)
    {
        $vehicle = Vehicle::with(['brand', 'category'])
            ->where('is_published', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return new VehicleResource($vehicle);
    }
}
