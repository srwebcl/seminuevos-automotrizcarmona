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
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $locations
        ]);
    }
}
