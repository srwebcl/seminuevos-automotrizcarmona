<?php

use Illuminate\Support\Facades\Route;

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
        \Illuminate\Support\Facades\Storage::disk('public')->put($filename, 'Hello World');
        $results['write_test'] = 'SUCCESS';
        $results['file_path'] = storage_path('app/public/' . $filename);
        $results['file_url'] = \Illuminate\Support\Facades\Storage::disk('public')->url($filename);
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
