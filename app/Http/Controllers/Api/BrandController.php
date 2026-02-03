<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $categorySlug = $request->query('category');
        $isPremium = $request->boolean('is_premium');
        $isOffer = $request->boolean('is_offer');
        $isFeatured = $request->boolean('is_featured');
        $tag = $request->query('tag');

        // Helper function to apply common filters
        $applyFilters = function ($q) use ($categorySlug, $isPremium, $isOffer, $isFeatured, $tag) {
            $q->where('is_published', true);

            // 1. Category Filter
            if ($categorySlug) {
                $q->whereHas('category', function ($hq) use ($categorySlug) {
                    $hq->where('slug', $categorySlug);
                });
            } else {
                // Default: Exclude Motos and Camiones if no category selected
                // RELAXED RULE: Allow them if searching for Offers/Featured/Tags
                if (!$isOffer && !$isFeatured && !$tag) {
                    $q->whereDoesntHave('category', function ($hq) {
                        $hq->whereIn('slug', ['motos', 'camion']);
                    });
                }
            }

            // 2. Premium Filter
            if ($isPremium) {
                $q->where('is_premium', true);
            } else {
                // Default: Exclude Premium if not explicitly requested
                // RELAXED RULE: Allow Premium if searching for Offers/Featured/Tags
                if (!$isOffer && !$isFeatured && !$tag) {
                    $q->where('is_premium', false);
                }
            }

            // 3. Featured Filter
            if ($isFeatured) {
                $q->where('is_featured', true);
            }

            // 4. Offer Filter
            if ($isOffer) {
                $q->where(function ($oq) {
                    $oq->where('is_offer', true)
                        ->orWhere(function ($priceQ) {
                            $priceQ->whereNotNull('price_offer')
                                ->where('price_offer', '>', 0);
                        })
                        ->orWhereHas('tags', function ($t) {
                            $t->where('name', 'like', '%ofert%');
                        });
                });
            }

            // 5. Tag Filter
            if ($tag) {
                $q->whereHas('tags', function ($tq) use ($tag) {
                    $tq->where('name', 'like', "%{$tag}%");
                });
            }
        };

        $brands = Brand::whereHas('vehicles', function ($q) use ($applyFilters) {
            $applyFilters($q);
        })
            ->withCount([
                'vehicles' => function ($q) use ($applyFilters) {
                    $applyFilters($q);
                }
            ])
            ->orderBy('name', 'asc')
            ->get();

        // Optionally filter out brands with 0 count effectively (since whereHas ensures at least 1, but safeguard matches logic)
        // $brands = $brands->filter(fn($b) => $b->vehicles_count > 0)->values();

        return response()->json([
            'data' => $brands
        ]);
    }
}
