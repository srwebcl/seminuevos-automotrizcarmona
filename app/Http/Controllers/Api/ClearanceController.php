<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\VehicleResource;
use App\Models\SiteSetting;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class ClearanceController extends Controller
{
    public function index()
    {
        // Obtener configuraciones de la Landing de Liquidación
        $settings = SiteSetting::first();

        // Obtener los autos de liquidación ordenados
        $vehicles = Vehicle::with(['brand', 'category', 'tags'])
            ->where('is_published', true)
            ->where('is_clearance', true)
            ->orderBy('clearance_sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'settings' => [
                'hero_desktop' => $settings ? $settings->clearance_hero_desktop : null,
                'hero_mobile' => $settings ? $settings->clearance_hero_mobile : null,
                'legal_text' => $settings ? $settings->clearance_legal : null,
            ],
            'vehicles' => VehicleResource::collection($vehicles)->resolve(),
        ]);
    }
}
