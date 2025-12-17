<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Brand;
use App\Models\Category;
use App\Models\VehicleAttribute; // Asegúrate de que este modelo existe
use Illuminate\Support\Str;

class SyncAttributesCommand extends Command
{
    protected $signature = 'project:sync-data';
    protected $description = 'Lee el JSON y crea las Marcas, Categorías y Atributos faltantes en el proyecto';

    public function handle()
    {
        $jsonPath = storage_path('app/import_temp/base_datos_autos_v2.json');

        if (!file_exists($jsonPath)) {
            $this->error("❌ No encontré el archivo JSON en: $jsonPath");
            return;
        }

        $autos = json_decode(file_get_contents($jsonPath), true);
        $total = count($autos);

        $this->info("🔍 Analizando $total registros del JSON para validar datos maestros...");

        // Arrays para almacenar únicos y evitar consultas repetidas
        $marcas = [];
        $categorias = [];
        $combustibles = [];
        $transmisiones = [];
        $tracciones = [];

        // 1. Recolectar datos únicos del JSON
        foreach ($autos as $auto) {
            if (!empty($auto['Marca']) && $auto['Marca'] !== 'Generico')
                $marcas[] = $auto['Marca'];

            // Lógica de categoría (igual que en el importador)
            $cat = 'Seminuevos';
            if (str_contains(strtoupper($auto['Modelo']), 'MOTO'))
                $cat = 'Motos';
            if (str_contains(strtoupper($auto['Modelo']), 'CAMION'))
                $cat = 'Camiones';
            $categorias[] = $cat;

            if (!empty($auto['Combustible']))
                $combustibles[] = $auto['Combustible'];
            if (!empty($auto['Transmisión']))
                $transmisiones[] = $auto['Transmisión'];
            if (!empty($auto['Tracción']))
                $tracciones[] = $auto['Tracción'];
        }

        // Eliminar duplicados
        $marcas = array_unique($marcas);
        $categorias = array_unique($categorias);
        $combustibles = array_unique($combustibles);
        $transmisiones = array_unique($transmisiones);
        $tracciones = array_unique($tracciones);

        // 2. Sincronizar con la Base de Datos

        $this->info("\n🛠️  Sincronizando MARCAS...");
        foreach ($marcas as $nombre) {
            $brand = Brand::firstOrCreate(
                ['name' => $nombre],
                ['slug' => Str::slug($nombre), 'is_active' => true]
            );
            if ($brand->wasRecentlyCreated)
                $this->line("   + Creada: $nombre");
        }

        $this->info("\n🛠️  Sincronizando CATEGORÍAS...");
        foreach ($categorias as $nombre) {
            $cat = Category::firstOrCreate(
                ['name' => $nombre],
                ['slug' => Str::slug($nombre), 'is_active' => true]
            );
            if ($cat->wasRecentlyCreated)
                $this->line("   + Creada: $nombre");
        }

        // 3. Sincronizar ATRIBUTOS (VehicleAttribute)
        // Asumo que tu tabla vehicle_attributes tiene columnas: 'type' y 'name'

        $this->info("\n🛠️  Sincronizando COMBUSTIBLES (vehicle_attributes)...");
        foreach ($combustibles as $nombre) {
            $attr = VehicleAttribute::firstOrCreate(
                ['type' => 'fuel', 'name' => $nombre],
                ['is_active' => true]
            );
            if ($attr->wasRecentlyCreated)
                $this->line("   + Creado: $nombre");
        }

        $this->info("\n🛠️  Sincronizando TRANSMISIONES (vehicle_attributes)...");
        foreach ($transmisiones as $nombre) {
            $attr = VehicleAttribute::firstOrCreate(
                ['type' => 'transmission', 'name' => $nombre],
                ['is_active' => true]
            );
            if ($attr->wasRecentlyCreated)
                $this->line("   + Creado: $nombre");
        }

        $this->info("\n🛠️  Sincronizando TRACCIONES (vehicle_attributes)...");
        foreach ($tracciones as $nombre) {
            $attr = VehicleAttribute::firstOrCreate(
                ['type' => 'traction', 'name' => $nombre],
                ['is_active' => true]
            );
            if ($attr->wasRecentlyCreated)
                $this->line("   + Creado: $nombre");
        }

        $this->newLine();
        $this->info("✅ ¡Validación y Creación de Datos Maestros completada!");
        $this->info("   Ahora el proyecto 'conoce' todos los datos del JSON.");
        $this->info("   Ya puedes ejecutar: php artisan autos:import");
    }
}