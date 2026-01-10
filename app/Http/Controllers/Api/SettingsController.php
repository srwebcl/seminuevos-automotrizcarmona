<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\WhatsappNumber;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        // 1. Seasonal Settings (Navidad, Año Nuevo, etc.)
        $setting = SiteSetting::first();

        // 2. Global WhatsApp
        $whatsapp = WhatsappNumber::where('is_active', true)->first();

        return response()->json([
            'data' => [
                'seasonal_mode' => $setting ? $setting->seasonal_mode : 'none',
                'whatsapp' => $whatsapp ? [
                    'number' => $whatsapp->phone,
                    'message_template' => 'Hola, quisiera más información.',
                    'is_active' => (bool) $whatsapp->is_active,
                ] : null,
                'contact' => [
                    'address' => 'Av. Balmaceda 3570, La Serena',
                    'email' => 'contacto@carmona.cl',
                    // Add other hardcoded settings if needed or pull from DB if created
                ]
            ]
        ]);
    }
}
