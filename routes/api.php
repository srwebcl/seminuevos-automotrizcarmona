<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LocationController;

Route::prefix('vehicles')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\VehicleController::class, 'index']);
    Route::get('/featured', [\App\Http\Controllers\Api\VehicleController::class, 'featured']);
    Route::get('/{slug}', [\App\Http\Controllers\Api\VehicleController::class, 'show']);
});

Route::get('brands', [\App\Http\Controllers\Api\BrandController::class, 'index']);
Route::get('/locations', [LocationController::class, 'index']);
Route::get('categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
Route::get('menu', [\App\Http\Controllers\Api\CategoryController::class, 'menu']);
Route::get('settings', [\App\Http\Controllers\Api\SettingsController::class, 'index']);

// Banners (Using dedicated controller or closure if simple)
Route::get('banners', function () {
    $banners = \App\Models\Banner::where('is_active', '=', true)->orderBy('sort_order')->get();
    return \App\Http\Resources\Api\BannerResource::collection($banners);
});

Route::get('search/global', [\App\Http\Controllers\Api\SearchController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');