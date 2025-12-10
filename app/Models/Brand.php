<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $guarded = [];

    // ESTA ES LA FUNCIÓN QUE FALTABA
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }
}
