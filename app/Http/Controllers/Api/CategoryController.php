<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        return CategoryResource::collection($categories);
    }

    public function menu()
    {
        $categories = Category::where('is_menu_item', true)
            ->orderBy('menu_order')
            ->get();

        return CategoryResource::collection($categories);
    }
}
