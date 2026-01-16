<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteSetting;

class InitialSiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existe un registro para no duplicarlo
        if (SiteSetting::count() === 0) {
            SiteSetting::create([
                'seasonal_mode' => 'none',
            ]);
        }
    }
}
