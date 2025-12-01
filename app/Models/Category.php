<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $guarded = []; // Permite guardar todo sin restricciones

    // Generar slug automático al crear (ej: "SUV Familiar" -> "suv-familiar")
    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($cat) => $cat->slug = Str::slug($cat->name));
    }
}
