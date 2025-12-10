<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\Str;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    // AJUSTE MENÚ: Inventario > Categorías
    protected static ?string $navigationGroup = 'Inventario';
    protected static ?string $navigationLabel = 'Categorías';
    protected static ?string $modelLabel = 'Categoría';
    protected static ?string $pluralModelLabel = 'Categorías';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->label('Nombre de Categoría')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($set, $state) => $set('slug', Str::slug($state))),

                TextInput::make('slug')
                    ->required()
                    ->readOnly(),

                Forms\Components\FileUpload::make('banner_path')
                    ->label('Banner de Categoría (Opcional)')
                    ->image()
                    ->directory('category-banners')
                    ->columnSpanFull(),

                Forms\Components\Section::make('Configuración de Menú')
                    ->schema([
                        Toggle::make('is_menu_item')
                            ->label('Mostrar en Menú Principal')
                            ->default(false),
                        TextInput::make('menu_order')
                            ->label('Orden en Menú')
                            ->numeric()
                            ->default(0),
                        TextInput::make('filter_query')
                            ->label('Filtro Especial (Avanzado)')
                            ->placeholder('Ej: is_premium=1 o search=Moto')
                            ->helperText('Si se usa, esta categoría filtrará vehículos con esta query en lugar de solo por ID.')
                            ->columnSpanFull(),
                    ])->columns(2),

                Toggle::make('is_active')
                    ->label('Activa')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('banner_path')
                    ->label('Banner'),

                TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->label('URL Amigable'),

                IconColumn::make('is_active')
                    ->label('Activa')
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_menu_item')
                    ->label('En Menú')
                    ->boolean(),

                TextColumn::make('menu_order')
                    ->label('Orden')
                    ->sortable(),
            ])
            ->filters([
                //
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
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
