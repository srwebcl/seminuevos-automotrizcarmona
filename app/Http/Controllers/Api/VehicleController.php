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
        $query = Vehicle::with(['brand', 'category', 'tags'])
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

        if ($request->has('brand')) {
            $slug = $request->query('brand');
            $query->whereHas('brand', function ($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        if ($request->has('q')) {
            $search = $request->query('q');
            $query->where(function ($q) use ($search) {
                $q->where('model', 'like', "%{$search}%")
                    ->orWhereHas('brand', function ($wq) use ($search) {
                        $wq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Default sort priority: Featured first, then newest
        $query->orderByDesc('is_featured');

        if ($request->has('sort')) {
            $sort = $request->query('sort');
            switch ($sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $vehicles = $query->paginate(12);

        return VehicleResource::collection($vehicles);
    }

    public function featured()
    {
        $vehicles = Vehicle::with(['brand', 'category', 'tags'])
            ->where('is_published', true)
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return VehicleResource::collection($vehicles);
    }

    public function show($slug)
    {
        $vehicle = Vehicle::with(['brand', 'category', 'tags'])
            ->where('is_published', true)
            ->where('slug', $slug)
            ->firstOrFail();

        return new VehicleResource($vehicle);
    }
}
