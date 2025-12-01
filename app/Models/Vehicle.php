<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_offer' => 'boolean',
        'is_clearance' => 'boolean',
        'is_premium' => 'boolean',
        'is_published' => 'boolean',
        'is_sold' => 'boolean',
        'photos' => 'array', // <--- IMPORTANTE: Convierte el JSON a Array PHP
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($vehicle) {
            if (empty($vehicle->slug)) {
                $vehicle->slug = Str::slug($vehicle->brand->name . '-' . $vehicle->model . '-' . $vehicle->year . '-' . Str::random(4));
            }
        });
    }

    public function brand() { return $this->belongsTo(Brand::class); }
    public function location() { return $this->belongsTo(Location::class); }
    public function category() { return $this->belongsTo(Category::class); }

    // Helper para obtener foto de portada (La primera del array)
    public function getThumbnailAttribute()
    {
        return $this->photos[0] ?? null;
    }
}
