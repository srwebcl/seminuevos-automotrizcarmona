<?php

use Illuminate\Support\Facades\Route;
use App\Models\Vehicle;
use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Http\Controllers\Frontend\VehicleController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    // 1. Configuración Hero (Buscamos el primero activo tipo 'hero')
    $hero = Banner::where('type', 'hero')->where('is_active', true)->first();

    // 2. Banner Ancho (Full Width)
    $fullBanner = Banner::where('type', 'full')->where('is_active', true)->first();

    // 3. Tarjetas de Categorías (Promo - Las cuadradas del carrusel)
    $promos = Banner::where('type', 'promo')
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get();

    // 4. Autos Destacados (Para carrusel o destacados)
    $destacados = Vehicle::where('is_published', true)
        ->where('is_featured', true)
        ->latest()
        ->take(6)
        ->get();

    // 5. Autos Recientes (Para el Grid principal)
    $recientes = Vehicle::where('is_published', true)
        ->latest()
        ->take(8)
        ->get();

    // 6. Marcas (Para el buscador del Home)
    $brands = Brand::whereHas('vehicles')->orderBy('name')->get();

    // 7. Categorías (Para las etiquetas flotantes del Home)
    $categories = Category::where('is_active', true)->get();

    // 8. Autos Premium (Para carrusel destacado home)
    $premiumVehicles = Vehicle::where('is_published', true)
        ->where('is_premium', true)
        ->where('is_featured', true)
        ->latest()
        ->take(8)
        ->get();

    return view('home', compact(
        'hero',
        'fullBanner',
        'promos',
        'destacados',
        'recientes',
        'brands',
        'categories',
        'premiumVehicles'
    ));
})->name('home');

// Rutas del Catálogo y Detalle
// Rutas del Catálogo y Detalle
Route::get('/catalogo', [VehicleController::class, 'index'])->name('vehicles.index');
// SEO Friendly Categories
Route::get('/seminuevos', [VehicleController::class, 'index'])->defaults('category_slug', 'seminuevos');
Route::get('/autos-premium', [VehicleController::class, 'index'])->defaults('category_slug', 'autos-premium');
Route::get('/ofertas', [VehicleController::class, 'index'])->defaults('category_slug', 'ofertas');
Route::get('/liquidacion', [VehicleController::class, 'index'])->defaults('category_slug', 'liquidacion');
Route::get('/motos', [VehicleController::class, 'index'])->defaults('category_slug', 'motos');
Route::get('/camiones', [VehicleController::class, 'index'])->defaults('category_slug', 'camiones');

// Generic Category Route (for SUV, Sedan, etc.)
Route::get('/categoria/{category_slug}', [VehicleController::class, 'index'])->name('vehicles.category');

Route::get('/auto/{slug}', [VehicleController::class, 'show'])->name('vehicles.show');
// Legacy Redirect
Route::get('/vehiculo/{slug}', function ($slug) {
    return redirect()->route('vehicles.show', $slug);
});
Route::get('/api/search-suggestions', [VehicleController::class, 'searchSuggestions'])->name('api.search');
Route::get('/api/home-filter', [VehicleController::class, 'ajaxHomeFilter'])->name('api.home.filter');

// Páginas Estáticas
Route::view('/sucursales', 'locations')->name('locations.index');
Route::view('/financiamiento', 'financing')->name('financing.index');

// REMOVE THIS IN PRODUCTION AFTER FIXING
Route::get('/fix-storage', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('storage:link');
        return 'Storage Link Created Successfully via Artisan!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});
