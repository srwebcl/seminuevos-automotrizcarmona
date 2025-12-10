<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestStockWidget extends BaseWidget
{
    protected static ?int $sort = 3; // Order in dashboard
    protected int|string|array $columnSpan = 'full';
    protected static ?string $heading = 'Últimas Unidades Ingresadas';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                \App\Models\Vehicle::query()->orderBy('created_at', 'desc')
            )
            ->columns([
                Tables\Columns\TextColumn::make('brand.name')
                    ->label('Marca')
                    ->searchable(),
                Tables\Columns\TextColumn::make('model')
                    ->label('Modelo')
                    ->searchable(),
                Tables\Columns\TextColumn::make('year')
                    ->label('Año'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha Ingreso')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('CLP')
                    ->label('Precio'),
            ]);
    }
}
