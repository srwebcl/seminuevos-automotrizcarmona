<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Actions\Action;
use App\Filament\Resources\VehicleResource;

class Dashboard extends BaseDashboard
{
    // protected static ?string $navigationIcon = 'heroicon-o-home';

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create_vehicle')
                ->label('Cargar Auto Rápido')
                ->icon('heroicon-o-plus-circle')
                ->color('primary')
                ->url(VehicleResource::getUrl('create')),
        ];
    }
}
