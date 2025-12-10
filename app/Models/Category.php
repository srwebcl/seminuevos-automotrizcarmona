<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Asegúrate de importar esto si lo usas, si no, puedes quitarlo
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{

    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($cat) => $cat->slug = Str::slug($cat->name));
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
}
