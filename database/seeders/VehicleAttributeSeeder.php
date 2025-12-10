<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            'transmission' => ['Manual', 'Automática', 'CVT', 'Doble Embrague', 'Tiptronic'],
            'fuel' => ['Bencina', 'Diesel', 'Híbrido', 'Eléctrico', 'Gas'],
            'traction' => ['4x2', '4x4', 'AWD', 'RWD', 'FWD'],
        ];

        foreach ($attributes as $type => $names) {
            foreach ($names as $name) {
                \App\Models\VehicleAttribute::firstOrCreate([
                    'type' => $type,
                    'name' => $name,
                ]);
            }
        }
    }
}
