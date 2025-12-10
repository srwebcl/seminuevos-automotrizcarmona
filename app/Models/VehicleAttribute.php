<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleAttribute extends Model
{
    protected $fillable = ['type', 'name', 'is_active'];

    // Tipos permitidos
    const TYPE_TRANSMISSION = 'transmission';
    const TYPE_FUEL = 'fuel';
    const TYPE_TRACTION = 'traction';

    public static function getTypes(): array
    {
        return [
            self::TYPE_TRANSMISSION => 'Transmisión',
            self::TYPE_FUEL => 'Combustible',
            self::TYPE_TRACTION => 'Tracción',
        ];
    }
}
