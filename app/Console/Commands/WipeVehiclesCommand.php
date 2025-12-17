<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class WipeVehiclesCommand extends Command
{
    protected $signature = 'autos:wipe';
    protected $description = 'ELIMINA todos los vehículos y sus fotos (Reset)';

    public function handle()
    {
        if (!$this->confirm('¿Estás SEGURO de borrar TODOS los vehículos y sus fotos?')) {
            return;
        }

        $this->info("🧹 Eliminando fotos...");
        // Borra todo el contenido de la carpeta public/vehicles
        Storage::disk('public')->deleteDirectory('vehicles');

        $this->info("🧹 Vaciando base de datos...");

        // Desactiva la protección de claves foráneas para truncar sin errores
        Schema::disableForeignKeyConstraints();

        // Vacía la tabla de vehículos
        Vehicle::truncate();
        // Opcional: Si quieres borrar también marcas y categorías creadas por el import
        // DB::table('brands')->truncate(); 
        // DB::table('categories')->truncate();

        Schema::enableForeignKeyConstraints();

        $this->info("✅ ¡Sistema limpio! Listo para intentar de nuevo.");
    }
}