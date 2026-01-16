<?php

namespace App\Filament\Resources\VehicleResource\Pages;

use App\Filament\Resources\VehicleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListVehicles extends ListRecords
{
    protected static string $resource = VehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\Action::make('export_excel')
                ->label('Exportar a Excel')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('success')
                ->action(function () {
                    return response()->streamDownload(function () {
                        $columns = [
                            'ID',
                            'Fecha Ingreso',
                            'Marca',
                            'Modelo',
                            'Año',
                            'Kilometraje',
                            'Motor',
                            'Color',
                            'Transmisión',
                            'Combustible',
                            'Tracción',
                            'Ubicación',
                            'Categoría',
                            'Precio Contado',
                            'Precio Crédito',
                            'Precio Oferta',
                            'Estado',
                            'Etiquetas'
                        ];

                        $handle = fopen('php://output', 'w');
                        fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM for Excel UTF-8
                        fputcsv($handle, $columns);

                        \App\Models\Vehicle::with(['brand', 'location', 'category', 'tags'])
                            ->chunk(100, function ($vehicles) use ($handle) {
                                foreach ($vehicles as $vehicle) {
                                    fputcsv($handle, [
                                        $vehicle->id,
                                        $vehicle->created_at?->format('d/m/Y H:i') ?? '',
                                        $vehicle->brand->name ?? '',
                                        $vehicle->model,
                                        $vehicle->year,
                                        $vehicle->km,
                                        $vehicle->motor,
                                        $vehicle->color,
                                        $vehicle->transmission,
                                        $vehicle->fuel,
                                        $vehicle->traction,
                                        $vehicle->location->name ?? '',
                                        $vehicle->category->name ?? '',
                                        $vehicle->price,
                                        $vehicle->price_financing,
                                        $vehicle->price_offer,
                                        $vehicle->is_published ? 'Publicado' : 'Borrador',
                                        $vehicle->tags->pluck('name')->join(', '),
                                    ]);
                                }
                            });

                        fclose($handle);
                    }, 'vehiculos-' . date('Y-m-d') . '.csv');
                }),
        ];
    }

    public function getTabs(): array
    {
        $tabs = [
            'all' => \Filament\Resources\Components\Tab::make('Todos'),
        ];

        $categories = \App\Models\Category::all();

        foreach ($categories as $category) {
            $tabs[$category->slug] = \Filament\Resources\Components\Tab::make($category->name)
                ->modifyQueryUsing(fn(\Illuminate\Database\Eloquent\Builder $query) => $query->where('category_id', $category->id))
                ->badge(\App\Models\Vehicle::where('category_id', $category->id)->count());
        }

        return $tabs;
    }
}
