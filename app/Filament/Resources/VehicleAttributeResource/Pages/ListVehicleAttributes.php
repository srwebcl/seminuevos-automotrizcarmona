<?php

namespace App\Filament\Resources\VehicleAttributeResource\Pages;

use App\Filament\Resources\VehicleAttributeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListVehicleAttributes extends ListRecords
{
    protected static string $resource = VehicleAttributeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
