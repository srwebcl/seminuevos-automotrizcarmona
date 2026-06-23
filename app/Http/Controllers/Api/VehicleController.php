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
        $query = Vehicle::with([
            'brand:id,name,slug',
            'category:id,name,slug',
            'tags:id,name,bg_color,text_color'
        ])
            ->where('is_published', true)
            ->where('is_clearance', false);

        if ($request->has('category')) {
            $slug = $request->query('category');
            // Support filtering by category slug
            $query->whereHas('category', function ($q) use ($slug) {
                // Fix ambiguity: specify table name
                $q->where('categories.slug', $slug);
            });
        } else {
            // Default: Exclude Motos and Camiones if no category is selected
            // RELAXED RULE: Also allow them if searching for Offers, Featured, or specific Tags
            if (!$request->has('is_offer') && !$request->has('is_featured') && !$request->has('tag')) {
                $query->whereDoesntHave('category', function ($q) {
                    $q->whereIn('categories.slug', ['motos', 'camion']);
                });
            }
        }

        if ($request->has('is_premium')) {
            $query->where('is_premium', true);
        } else {
            // Default: Exclude Premium if not explicitly requested
            // RELAXED RULE: Allow Premium if searching for Offers/Featured/Tags
            if (!$request->has('is_offer') && !$request->has('is_featured') && !$request->has('tag')) {
                $query->where('is_premium', false);
            }
        }

        if ($request->has('is_offer')) {
            $query->where(function ($q) {
                // 1. Check strict boolean column (Admin Switch)
                $q->where('is_offer', true)
                    // 2. OR check if it has a valid Offer Price (Logic added per request)
                    ->orWhere(function ($priceQ) {
                        $priceQ->whereNotNull('price_offer')
                            ->where('price_offer', '>', 0);
                    })
                    // 3. OR check if it has "Oferta" tag (Legacy/Flexible)
                    ->orWhereHas('tags', function ($t) {
                        // FIX: tags table does NOT have a slug column. Use name only.
                        $t->where('tags.name', 'like', '%ofert%');
                    });
            });
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('tag')) {
            $slug = $request->query('tag');
            $query->whereHas('tags', function ($q) use ($slug) {
                // FIX: tags table does NOT have a slug column. Use name only.
                // We compare the 'slug' from URL to the 'name' in DB hoping they match roughly, 
                // or just search by name.
                $q->where('tags.name', 'like', "%{$slug}%");
            });
        }

        if ($request->has('brand')) {
            $slug = $request->query('brand');
            $query->whereHas('brand', function ($q) use ($slug) {
                $q->where('brands.slug', $slug);
            });
        }

        if ($request->has('q')) {
            $search = $request->query('q');
            $query->where(function ($q) use ($search) {
                $q->where('vehicles.model', 'like', "%{$search}%")
                    ->orWhereHas('brand', function ($wq) use ($search) {
                        $wq->where('brands.name', 'like', "%{$search}%");
                    });
            });
        }

        // Apply Join for Sorting (Always needed for A-Z, harmless for others)
        $query->join('brands', 'vehicles.brand_id', '=', 'brands.id')
            ->select('vehicles.*', 'brands.name as brand_name');

        if ($request->has('sort') && !empty($request->query('sort'))) {
            $sort = $request->query('sort');
            switch ($sort) {
                case 'latest':
                    $query->orderBy('vehicles.created_at', 'desc');
                    break;
                case 'price_asc':
                    $query->orderByRaw('
                        CASE 
                            WHEN is_offer = 1 AND price_offer IS NOT NULL THEN price_offer 
                            WHEN price_financing IS NOT NULL THEN price_financing 
                            ELSE price 
                        END ASC
                    ');
                    break;
                case 'price_desc':
                    $query->orderByRaw('
                        CASE 
                            WHEN is_offer = 1 AND price_offer IS NOT NULL THEN price_offer 
                            WHEN price_financing IS NOT NULL THEN price_financing 
                            ELSE price 
                        END DESC
                    ');
                    break;
                case 'a_z':
                    $query->orderBy('brand_name', 'asc')
                        ->orderBy('model', 'asc');
                    break;
                case 'z_a':
                    $query->orderBy('brand_name', 'desc')
                        ->orderBy('model', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('vehicles.created_at', 'asc');
                    break;
                default:
                    // Default to A-Z
                    $query->orderBy('brand_name', 'asc')
                        ->orderBy('model', 'asc');
            }
        } else {
            // Default to A-Z
            $query->orderBy('brand_name', 'asc')
                ->orderBy('model', 'asc');
        }

        $vehicles = $query->paginate(12);

        return VehicleResource::collection($vehicles);
    }

    public function featured()
    {
        $vehicles = Vehicle::with(['brand', 'category', 'tags'])
            ->where('is_published', true)
            ->where('is_featured', true)
            ->where('is_clearance', false)
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
