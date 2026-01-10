<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use Illuminate\Support\Str;

class CleanVehicleModels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-vehicle-models {--dry-run : Only show what would change without saving}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean vehicle models by removing year, brand, and redundant specs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando limpieza de modelos...');

        $vehicles = Vehicle::with('brand')->get();
        $count = 0;

        foreach ($vehicles as $vehicle) {
            $originalModel = $vehicle->model;
            $cleanModel = $originalModel;
            $brandName = $vehicle->brand ? $vehicle->brand->name : '';

            // 1. Remove Brand Name (Case Insensitive)
            if ($brandName) {
                $cleanModel = preg_replace('/\b' . preg_quote($brandName, '/') . '\b/i', '', $cleanModel);
            }

            // 2. Remove Year (4 digits starting with 19 or 20, potentially preceded by AÑO)
            // Remove "AÑO 2023", "ANO 2023", or just "2023"
            $cleanModel = preg_replace('/\b(AÑO|ANO)?\s*20\d{2}\b/i', '', $cleanModel);
            $cleanModel = preg_replace('/\b(AÑO|ANO)?\s*19\d{2}\b/i', '', $cleanModel);

            // 3. Remove Transmission keywords
            $transmissions = ['MECANICO', 'MECÁNICO', 'MEC', 'AUTOMATICO', 'AUTOMÁTICO', 'AUT', 'CVT', 'DCT', 'TIPTRONIC'];
            foreach ($transmissions as $trans) {
                $cleanModel = preg_replace('/\b' . preg_quote($trans, '/') . '\b/i', '', $cleanModel);
            }

            // 4. Remove Traction keywords
            $tractions = ['2WD', '4WD', '4X4', '4X2', 'AWD'];
            foreach ($tractions as $trac) {
                $cleanModel = preg_replace('/\b' . preg_quote($trac, '/') . '\b/i', '', $cleanModel);
            }

            // 5. Remove "FULL" keyword
            $cleanModel = preg_replace('/\bFULL\b/i', '', $cleanModel);

            // 6. Remove "EQUIPO" if it was "FULL EQUIPO"
            $cleanModel = preg_replace('/\bEQUIPO\b/i', '', $cleanModel);

            // 7. Cleanup extra spaces and dashes
            $cleanModel = preg_replace('/\s+/', ' ', $cleanModel); // Multiple spaces to one
            $cleanModel = trim($cleanModel, " \t\n\r\0\x0B-"); // Trim spaces and dashes

            // Check if changed
            if ($originalModel !== $cleanModel && !empty($cleanModel)) {
                $this->line("ID {$vehicle->id}: '{$originalModel}' -> <info>'{$cleanModel}'</info>");

                if (!$this->option('dry-run')) {
                    $vehicle->model = $cleanModel;
                    $vehicle->save();
                    $count++;
                }
            }
        }

        if ($this->option('dry-run')) {
            $this->info("Dry run completed. {$count} vehicles would be updated.");
        } else {
            $this->info("Completed. Updated {$count} vehicles.");
        }
    }
}
