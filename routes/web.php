<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| The old frontend has been archived.
| This file now only serves as an API entry point check or for debug tools.
|
*/

Route::get('/', function () {
    return response()->json([
        'status' => 'active',
        'message' => 'Automotriz Carmona API is running.',
        'frontend_url' => env('NEXT_PUBLIC_APP_URL', 'http://localhost:3001')
    ]);
});

// HELPER: Create Storage Link (Run once in production)
Route::get('/fix-storage', function () {
    try {
        Artisan::call('storage:link');
        return 'Storage Link Created: ' . Artisan::output();
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// DIAGNOSTIC TOOL
Route::get('/debug-storage', function () {
    $results = [];

    // 1. Check Env
    $results['app_url'] = env('APP_URL');
    $results['filesystem_disk'] = env('FILESYSTEM_DISK');

    // 2. Check Symlink
    $publicStorage = public_path('storage');
    $results['public_storage_exists'] = file_exists($publicStorage);
    $results['public_storage_is_link'] = is_link($publicStorage);
    $results['public_storage_target'] = is_link($publicStorage) ? readlink($publicStorage) : 'NOT A LINK';

    // 3. Test Write/Read
    try {
        $filename = 'debug_test_' . time() . '.txt';
        Storage::disk('public')->put($filename, 'Hello World');
        $results['write_test'] = 'SUCCESS';
        $results['file_path'] = storage_path('app/public/' . $filename);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $results['file_url'] = $disk->url($filename);
        $results['file_url_accessible'] = 'Click below to test';
    } catch (\Exception $e) {
        $results['write_test'] = 'FAILED: ' . $e->getMessage();
    }

    return response()->json($results);
});

Route::get('/test-banners', function () {
    $banners = \App\Models\Banner::all();
    return response()->json([
        'count' => $banners->count(),
        'first' => $banners->first(),
        'all' => $banners
    ]);
});

// --- RUTA TEMPORAL DE MANTENIMIENTO ---
Route::get('/optimizar-sistema-carmona', function () {
    try {
        // 1. Limpiar todo
        Artisan::call('optimize:clear');
        $output = "Cache borrada.<br>";

        // 2. Cachear configuración y rutas (Lo más importante para velocidad)
        Artisan::call('config:cache');
        $output .= "Configuración cacheada.<br>";

        Artisan::call('route:cache');
        $output .= "Rutas cacheadas.<br>";

        Artisan::call('view:cache');
        $output .= "Vistas cacheadas.<br>";

        Artisan::call('event:cache');
        $output .= "Eventos cacheados.<br>";

        // 3. Link simbólico (solo si no existe)
        Artisan::call('storage:link');
        $output .= "Storage Link generado.<br>";

        return $output . "<h3>¡Optimización completada con éxito!</h3>";
    } catch (\Exception $e) {
        return "Error: " . $e->getMessage();
    }
});
