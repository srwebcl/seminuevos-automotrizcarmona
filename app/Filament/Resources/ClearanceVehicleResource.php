<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClearanceVehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

class ClearanceVehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;

    protected static ?string $navigationIcon = 'heroicon-o-fire';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?string $navigationLabel = 'Liquidación';
    protected static ?string $modelLabel = 'Vehículo en Liquidación';
    protected static ?string $pluralModelLabel = 'Vehículos en Liquidación';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('is_clearance', true);
    }

    public static function canCreate(): bool
    {
        return false; // Se asignan desde el menú principal de vehículos
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // El formulario completo está en VehicleResource
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->reorderable('clearance_sort_order')
            ->defaultSort('clearance_sort_order', 'asc')
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('Portada')
                    ->circular(),

                TextColumn::make('brand.name')
                    ->label('Marca')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('model')
                    ->label('Modelo')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('price')
                    ->label('Precio (CLP)')
                    ->numeric()
                    ->sortable(),
                    
                Tables\Columns\IconColumn::make('is_published')
                    ->label('Publicado')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\Action::make('view_frontend')
                    ->label('')
                    ->tooltip('Ver en Sitio')
                    ->icon('heroicon-o-eye')
                    ->url(fn(Vehicle $record) => env('FRONTEND_URL', 'https://seminuevos.automotrizcarmona.cl') . '/auto/' . $record->slug)
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([
                //
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageClearanceVehicles::route('/'),
        ];
    }
}
