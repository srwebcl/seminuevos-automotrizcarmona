<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use Illuminate\Console\Command;

class CleanVehicleDescriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-descriptions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpiar etiquetas HTML de las descripciones de los vehículos y formatear texto.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando limpieza de descripciones...');

        $vehicles = Vehicle::all();
        $count = 0;

        foreach ($vehicles as $vehicle) {
            if (empty($vehicle->description)) {
                continue;
            }

            $original = $vehicle->description;

            // 1. Reemplazar saltos de línea HTML por saltos de línea reales
            $text = str_ireplace(['<br>', '<br/>', '<br />', '</p>'], "\n", $original);

            // 2. Eliminar todas las etiquetas HTML
            $text = strip_tags($text);

            // 3. Decodificar entidades HTML (&nbsp;, &amp;, etc.)
            $text = html_entity_decode($text);

            // 4. Limpiar espacios múltiples y espacios al inicio/final de cada línea
            $lines = explode("\n", $text);
            $lines = array_map('trim', $lines);
            $lines = array_filter($lines); // Eliminar líneas vacías

            // 5. Reconstruir el texto ocn saltos de línea
            $cleanText = implode("\n\n", $lines); // Doble salto para párrafos claros

            // Verificar si hubo cambios
            if ($original !== $cleanText) {
                $vehicle->description = $cleanText;
                $vehicle->save();
                $count++;
            }
        }

        $this->info("Proceso completado. Se actualizaron {$count} vehículos.");
    }
}
