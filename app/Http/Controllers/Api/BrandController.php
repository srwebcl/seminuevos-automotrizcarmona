<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        $categorySlug = request('category');

        $brands = Brand::whereHas('vehicles', function ($q) use ($categorySlug) {
            $q->where('is_published', true);

            if ($categorySlug) {
                $q->whereHas('category', function ($hq) use ($categorySlug) {
                    $hq->where('slug', $categorySlug);
                });
            }
        })
            ->withCount([
                'vehicles' => function ($q) use ($categorySlug) {
                    $q->where('is_published', true);

                    if ($categorySlug) {
                        $q->whereHas('category', function ($hq) use ($categorySlug) {
                            $hq->where('slug', $categorySlug);
                        });
                    }
                }
            ])
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'data' => $brands
        ]);
    }
}
