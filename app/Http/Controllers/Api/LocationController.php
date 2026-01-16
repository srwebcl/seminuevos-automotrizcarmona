<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::where('is_active', true)
            ->orderBy('sort_order', 'asc') // Order by sort_order
            ->get();

        return response()->json([
            'data' => $locations
        ]);
    }
}
