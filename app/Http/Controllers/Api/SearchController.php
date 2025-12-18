<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Vehicle;
use App\Http\Resources\Api\VehicleResource;
use App\Http\Resources\Api\CategoryResource;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('query');

        if (strlen($query) < 2) {
            return response()->json([
                'categories' => [],
                'vehicles' => []
            ]);
        }

        // Search Categories (Smart Search)
        $categories = Category::where('name', 'like', '%' . $query . '%')
            ->limit(3)
            ->get();

        // Search Vehicles (Model, Brand, Year)
        $vehicles = Vehicle::with(['brand', 'category'])
            ->where('is_published', true)
            ->where(function ($q) use ($query) {
                $q->where('model', 'like', '%' . $query . '%')
                    ->orWhereHas('brand', function ($bq) use ($query) {
                        $bq->where('name', 'like', '%' . $query . '%');
                    })
                    ->orWhere('year', 'like', '%' . $query . '%');
            })
            ->limit(3)
            ->get();

        return response()->json([
            'categories' => CategoryResource::collection($categories),
            'vehicles' => VehicleResource::collection($vehicles)
        ]);
    }
}
