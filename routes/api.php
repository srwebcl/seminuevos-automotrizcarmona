<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('vehicles')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\VehicleController::class, 'index']);
    Route::get('/featured', [\App\Http\Controllers\Api\VehicleController::class, 'featured']);
    Route::get('/{slug}', [\App\Http\Controllers\Api\VehicleController::class, 'show']);
});

Route::get('categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
