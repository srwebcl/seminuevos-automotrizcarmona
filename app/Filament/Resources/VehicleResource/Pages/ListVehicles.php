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
