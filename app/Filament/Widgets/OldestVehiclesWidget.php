<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class OldestVehiclesWidget extends BaseWidget
{
    protected static ?int $sort = 2; // Order in dashboard
    protected int|string|array $columnSpan = 'full';
    protected static ?string $heading = 'Vehículos Más Antiguos';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                \App\Models\Vehicle::query()->orderBy('year', 'asc')->take(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('brand.name')
                    ->label('Marca')
                    ->searchable(),
                Tables\Columns\TextColumn::make('model')
                    ->label('Modelo')
                    ->searchable(),
                Tables\Columns\TextColumn::make('year')
                    ->label('Año')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Días en Stock')
                    ->since(),
                Tables\Columns\TextColumn::make('price')
                    ->money('CLP')
                    ->label('Precio'),
            ]);
    }
}
