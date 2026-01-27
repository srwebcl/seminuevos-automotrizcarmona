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
        $setting = SiteSetting::first(['*']);

        return response()->json([
            'data' => [
                'seasonal_mode' => $setting ? $setting->seasonal_mode : 'none',
                'whatsapp_numbers' => WhatsappNumber::where('is_active', '=', true, 'and')->get()->map(function ($number) {
                    return [
                        'number' => $number->phone,
                        'label' => $number->label,
                        'for_premium_only' => (bool) $number->for_premium_only,
                    ];
                }),
                'contact' => [
                    'address' => 'Av. Balmaceda 3570, La Serena',
                    'email' => 'contacto@carmona.cl',
                    // Add other hardcoded settings if needed or pull from DB if created
                ],
                'social_links' => [
                    'instagram' => $setting ? $setting->instagram_url : null,
                    'facebook' => $setting ? $setting->facebook_url : null,
                    'linkedin' => $setting ? $setting->linkedin_url : null,
                    'youtube' => $setting ? $setting->youtube_url : null,
                ],
                'locations' => \App\Models\Location::where('is_active', '=', true, 'and')->get()->map(function ($loc) {
                    return [
                        'name' => $loc->name,
                        'address' => $loc->address,
                        'city' => $loc->city,
                        'phone' => $loc->phone,
                        'google_maps_url' => $loc->google_maps_url,
                    ];
                }),
                'main_categories' => \App\Models\Category::withCount('vehicles')
                    ->orderBy('vehicles_count', 'desc')
                    ->take(5)
                    ->get()
                    ->map(function ($cat) {
                        return [
                            'name' => $cat->name,
                            'slug' => $cat->slug,
                        ];
                    }),
            ]
        ]);
    }
}
