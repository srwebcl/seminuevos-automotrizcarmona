<?php

namespace App\Filament\Resources\VehicleAttributeResource\Pages;

use App\Filament\Resources\VehicleAttributeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditVehicleAttribute extends EditRecord
{
    protected static string $resource = VehicleAttributeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
