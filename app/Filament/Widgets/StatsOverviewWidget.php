<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Seminuevos', \App\Models\Vehicle::where('is_premium', false)->count())
                ->description('Vehículos estándar')
                ->descriptionIcon('heroicon-m-truck')
                ->color('success'),
            Stat::make('Seminuevos Premium', \App\Models\Vehicle::where('is_premium', true)->count())
                ->description('Alta gama')
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),
            Stat::make('Motos', \App\Models\Vehicle::whereHas('category', fn($q) => $q->where('name', 'like', '%Moto%'))->count())
                ->description('Motocicletas')
                ->descriptionIcon('heroicon-m-bolt')
                ->color('primary'),
            Stat::make('Camiones', \App\Models\Vehicle::whereHas('category', fn($q) => $q->where('name', 'like', '%Camion%'))->count())
                ->description('Vehículos pesados')
                ->descriptionIcon('heroicon-m-archive-box')
                ->color('danger'),
        ];
    }
}
