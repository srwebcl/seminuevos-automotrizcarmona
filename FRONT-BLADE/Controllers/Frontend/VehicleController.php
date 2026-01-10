<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::query()->where('is_published', true);

        // Filtros Base
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                $subQ->where('model', 'like', "%{$search}%")
                    ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$search}%"));
            });
        });

        $query->when($request->brand_id, fn($q, $id) => $q->where('brand_id', $id));
        $query->when($request->category_id, fn($q, $id) => $q->where('category_id', $id));
        $query->when($request->year_from, fn($q, $year) => $q->where('year', '>=', $year));
        $query->when($request->year_to, fn($q, $year) => $q->where('year', '<=', $year));

        // Filtros Especiales
        $query->when($request->is_premium, fn($q) => $q->where('is_premium', true));
        $query->when($request->is_offer, fn($q) => $q->where('is_offer', true));
        $query->when($request->is_featured, fn($q) => $q->where('is_featured', true));

        // Detectar categoría desde la ruta (SEO Friendly)
        $routeCategorySlug = $request->route('category_slug');
        $routeCategorySlug = is_string($routeCategorySlug) ? trim($routeCategorySlug) : $routeCategorySlug;
        $currentCategory = null;

        // --- LÓGICA DE RUTAS ESPECIALES ---
        if ($routeCategorySlug) {

            // 1. AUTOS PREMIUM
            if ($routeCategorySlug == 'autos-premium') {
                $query->where('vehicles.is_premium', true);

                // Try to find real category for banner, otherwise virtual
                $currentCategory = Category::where('slug', 'autos-premium')->first()
                    ?? new Category(['name' => 'Autos Premium', 'slug' => 'autos-premium']);
            }
            // 2. MOTOS
            elseif ($routeCategorySlug == 'motos') {
                // Fix: Search for 'motos' OR 'moto' to handle admin renaming
                $cat = Category::whereIn('slug', ['motos', 'moto'])->first();

                if ($cat) {
                    $query->where('category_id', $cat->id);
                    $currentCategory = $cat;
                }
            }
            // 3. CAMIONES
            elseif ($routeCategorySlug == 'camiones') {
                $cat = Category::whereIn('slug', ['camiones', 'camion'])->first();
                if ($cat) {
                    $query->where('category_id', $cat->id);
                    $currentCategory = $cat;
                }
            }
            // 4. OFERTAS / LIQUIDACION
            elseif ($routeCategorySlug == 'ofertas') {
                $query->where('is_offer', true);
                $currentCategory = Category::where('slug', 'ofertas')->first()
                    ?? new Category(['name' => 'Ofertas', 'slug' => 'ofertas']);
            } elseif ($routeCategorySlug == 'liquidacion') {
                $query->where('is_clearance', true);
                $currentCategory = Category::where('slug', 'liquidacion')->first()
                    ?? new Category(['name' => 'Liquidación', 'slug' => 'liquidacion']);
            }
            // 5. SEMINUEVOS (Default "Todo" pero filtrado)
            elseif ($routeCategorySlug == 'seminuevos') {
                // Excluir Premium
                $query->where('is_premium', false);
                $query->whereDoesntHave('location', fn($l) => $l->where('name', 'like', '%Premium%'));

                // Excluir Motos y Camiones
                $query->whereDoesntHave('category', fn($q) => $q->whereIn('slug', ['motos', 'camiones', 'camion']));

                $currentCategory = new Category(['name' => 'Seminuevos', 'slug' => 'seminuevos']);
            }
            // 6. CATEGORÍA GENÉRICA (Slug DB)
            else {
                $currentCategory = Category::where('slug', $routeCategorySlug)->first();
                if ($currentCategory) {
                    if ($currentCategory->filter_query) {
                        parse_str($currentCategory->filter_query, $filters);
                        foreach ($filters as $key => $value) {
                            if ($key === 'is_premium' && $value == '1')
                                $query->where('is_premium', true);
                        }
                    } else {
                        $query->where('category_id', $currentCategory->id);
                    }
                }
            }
        } elseif ($request->category_id) {
            $currentCategory = Category::find($request->category_id);
            if ($currentCategory)
                $query->where('category_id', $currentCategory->id);
        }

        // Ordenamiento
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'year_desc':
                $query->orderBy('year', 'desc');
                break;
            case 'year_asc':
                $query->orderBy('year', 'asc');
                break;
            default:
                $query->latest();
                break;
        }

        $vehicles = $query->paginate(12)->withQueryString();

        // Datos para sidebar con contadores
        $brands = Brand::whereHas('vehicles', fn($q) => $q->where('is_published', true))
            ->withCount(['vehicles' => fn($q) => $q->where('is_published', true)])
            ->orderBy('name')
            ->get();

        $categories = Category::whereHas('vehicles', fn($q) => $q->where('is_published', true))
            ->withCount(['vehicles' => fn($q) => $q->where('is_published', true)])
            ->orderBy('name')
            ->get();

        $years = Vehicle::select('year')->distinct()->orderBy('year', 'desc')->pluck('year');

        return view('vehicles.index', compact('vehicles', 'brands', 'categories', 'years', 'currentCategory'));
    }

    public function show($slug)
    {
        $vehicle = Vehicle::where('slug', $slug)->where('is_published', true)->firstOrFail();
        $whatsapp = \App\Models\WhatsappNumber::where('is_active', true)->first();

        // Autos Relacionados
        $related = Vehicle::where('category_id', $vehicle->category_id)
            ->where('id', '!=', $vehicle->id)
            ->where('is_published', true)
            ->inRandomOrder()
            ->take(4)
            ->get();

        $categories = Category::where('is_active', true)->get();
        $promos = \App\Models\Banner::where('type', 'promo')->where('is_active', true)->orderBy('sort_order')->get();

        return view('vehicles.show', compact('vehicle', 'whatsapp', 'related', 'categories', 'promos'));
    }

    // --- MÉTODOS API (DENTRO DE LA CLASE) ---

    // 1. Búsqueda Predictiva (JSON)
    public function searchSuggestions(Request $request)
    {
        $query = $request->get('query');

        $results = Vehicle::where('is_published', true)
            ->where(function ($q) use ($query) {
                $q->where('model', 'like', "%{$query}%")
                    ->orWhereHas('brand', fn($b) => $b->where('name', 'like', "%{$query}%"));
            })
            ->take(5)
            ->get()
            ->map(function ($car) {
                return [
                    'text' => $car->brand->name . ' ' . $car->model . ' (' . $car->year . ')',
                    'url' => route('vehicles.show', $car->slug),
                    'thumb' => \Storage::url($car->thumbnail)
                ];
            });

        return response()->json($results);
    }

    // 2. Filtro AJAX para el Home (HTML Parcial)
    public function ajaxHomeFilter(Request $request)
    {
        $query = Vehicle::where('is_published', true);

        if ($request->has('is_featured'))
            $query->where('is_featured', true);
        if ($request->has('is_premium'))
            $query->where('is_premium', true);
        if ($request->has('is_offer'))
            $query->where('is_offer', true);
        if ($request->has('category_id'))
            $query->where('category_id', $request->category_id);

        $vehicles = $query->latest()->take(8)->get();

        return view('partials.home-grid', compact('vehicles'))->render();
    }
}
