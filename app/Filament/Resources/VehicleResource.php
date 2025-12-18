<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\Str;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';

    // Configuración del Menú
    protected static ?string $navigationGroup = 'Inventario';
    protected static ?string $navigationLabel = 'Vehículos';
    protected static ?string $modelLabel = 'Vehículo';
    protected static ?string $pluralModelLabel = 'Vehículos';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // SECCIÓN 1: DATOS CLAVE
                Section::make('Información del Vehículo')
                    ->schema([
                        Grid::make(3)->schema([
                            // MARCA con CREACIÓN RÁPIDA
                            Select::make('brand_id')
                                ->relationship('brand', 'name')
                                ->label('Marca')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn($set, $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')->required()->readOnly(),
                                    FileUpload::make('logo')->directory('brands'),
                                ]),

                            TextInput::make('model')
                                ->label('Modelo')
                                ->required()
                                ->placeholder('Ej: X5 xDrive 30d'),

                            TextInput::make('year')
                                ->label('Año')
                                ->numeric()
                                ->minValue(1990)
                                ->maxValue(date('Y') + 1)
                                ->required(),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('price')
                                ->label('Precio ($CLP)')
                                ->numeric()
                                ->prefix('$')
                                ->required(),

                            TextInput::make('km')
                                ->label('Kilometraje')
                                ->numeric()
                                ->required(),

                            // CATEGORÍA con CREACIÓN RÁPIDA
                            Select::make('category_id')
                                ->relationship('category', 'name', fn($query) => $query->whereNull('filter_query'))
                                ->label('Categoría')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn($set, $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')->required()->readOnly(),
                                ]),
                        ]),
                    ]),

                // SECCIÓN 2: DETALLES
                Section::make('Ficha Técnica y Ubicación')
                    ->collapsible()
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('transmission')
                                ->label('Transmisión')
                                ->options(\App\Models\VehicleAttribute::where('type', 'transmission')->where('is_active', true)->pluck('name', 'name'))
                                ->searchable(),

                            Select::make('fuel')
                                ->label('Combustible')
                                ->options(\App\Models\VehicleAttribute::where('type', 'fuel')->where('is_active', true)->pluck('name', 'name'))
                                ->searchable(),

                            Select::make('traction')
                                ->label('Tracción')
                                ->options(\App\Models\VehicleAttribute::where('type', 'traction')->where('is_active', true)->pluck('name', 'name'))
                                ->searchable(),
                        ]),

                        // UBICACIÓN
                        Select::make('location_id')
                            ->relationship('location', 'name')
                            ->label('Ubicación Física')
                            ->required()
                            ->createOptionForm([
                                TextInput::make('name')->required()->label('Nombre Sucursal'),
                                TextInput::make('address')->required()->label('Dirección'),
                                TextInput::make('city')->default('La Serena')->required(),
                            ]),

                        Textarea::make('description')
                            ->label('Descripción Adicional')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                // SECCIÓN 3: ESTADOS COMERCIALES
                Section::make('Marketing y Visibilidad')
                    ->schema([
                        Grid::make(4)->schema([
                            Toggle::make('is_premium')
                                ->label('💎 Premium')
                                ->onColor('warning')
                                ->helperText('Sección exclusiva Gold.'),

                            Toggle::make('is_featured')
                                ->label('⭐ Destacado')
                                ->helperText('Carrusel Home.'),

                            Toggle::make('is_offer')
                                ->label('🔥 Oferta')
                                ->onColor('danger'),

                            Toggle::make('is_clearance')
                                ->label('⚠️ Liquidación'),
                        ]),
                    ]),

                // SECCIÓN 4: GALERÍA (OPTIMIZADA MÚLTIPLE)
                Section::make('Galería de Imágenes')
                    ->description('Carga las fotos aquí. La primera será la PORTADA. Arrastra para reordenar.')
                    ->schema([
                        FileUpload::make('photos')
                            ->label('Fotografías del Vehículo')
                            ->multiple()            // Permite subir varios archivos
                            ->reorderable()         // Permite reordenar arrastrando
                            ->appendFiles()         // Permite agregar más después
                            ->image()
                            ->directory('vehicles')
                            ->imageEditor()
                            ->columnSpanFull()      // Usa todo el ancho
                            ->required(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('Portada')
                    ->circular(),

                TextColumn::make('brand.name')
                    ->label('Marca')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextInputColumn::make('model')
                    ->label('Modelo')
                    ->searchable()
                    ->sortable()
                    ->rules(['required', 'string', 'max:255']),

                Tables\Columns\TextInputColumn::make('year')
                    ->label('Año')
                    ->type('number')
                    ->sortable()
                    ->rules(['numeric', 'min:1900', 'max:2026']),

                Tables\Columns\TextInputColumn::make('price')
                    ->label('Precio (CLP)')
                    ->type('number')
                    ->sortable()
                    ->rules(['numeric', 'min:0']),

                Tables\Columns\SelectColumn::make('category_id')
                    ->label('Categoría')
                    ->options(\App\Models\Category::pluck('name', 'id'))
                    ->sortable()
                    ->searchable(),

                Tables\Columns\ToggleColumn::make('is_premium')
                    ->label('💎 Premium')
                    ->sortable()
                    ->onColor('warning'),

                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('⭐ Destacado')
                    ->sortable()
                    ->onColor('success'),

                Tables\Columns\ToggleColumn::make('is_published')
                    ->label('Visible')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Categoría')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('brand_id')
                    ->label('Marca')
                    ->relationship('brand', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\Filter::make('is_premium')
                    ->label('Solo Premium')
                    ->query(fn($query) => $query->where('is_premium', true)),

                Tables\Filters\Filter::make('is_offer')
                    ->label('En Oferta')
                    ->query(fn($query) => $query->where('is_offer', true)),
            ])
            ->actions([
                Tables\Actions\Action::make('view_frontend')
                    ->label('Ver en Sitio')
                    ->icon('heroicon-o-eye')
                    ->url(fn(Vehicle $record) => env('FRONTEND_URL', 'https://automotrizcarmona.cl') . '/auto/' . $record->slug)
                    ->openUrlInNewTab(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }
}
