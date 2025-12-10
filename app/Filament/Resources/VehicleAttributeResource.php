<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleAttributeResource\Pages;
use App\Filament\Resources\VehicleAttributeResource\RelationManagers;
use App\Models\VehicleAttribute;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class VehicleAttributeResource extends Resource
{
    protected static ?string $model = VehicleAttribute::class;

    protected static ?string $navigationGroup = 'Inventario';
    protected static ?string $navigationLabel = 'Atributos Vehículo';
    protected static ?string $modelLabel = 'Atributo';
    protected static ?string $pluralModelLabel = 'Atributos';
    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('type')
                    ->label('Tipo de Atributo')
                    ->options(VehicleAttribute::getTypes())
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->label('Valor (Nombre)')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_active')
                    ->label('Activo')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipo')
                    ->formatStateUsing(fn(string $state): string => VehicleAttribute::getTypes()[$state] ?? $state)
                    ->badge()
                    ->colors(['primary' => 'transmission', 'success' => 'fuel', 'warning' => 'traction'])
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Valor')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Filtrar por Tipo')
                    ->options(VehicleAttribute::getTypes()),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicleAttributes::route('/'),
            'create' => Pages\CreateVehicleAttribute::route('/create'),
            'edit' => Pages\EditVehicleAttribute::route('/{record}/edit'),
        ];
    }
}
