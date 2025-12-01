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
    protected static ?string $navigationGroup = 'Stock Autos';
    protected static ?string $navigationLabel = 'Cargar Auto';
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
                                        ->afterStateUpdated(fn ($set, $state) => $set('slug', Str::slug($state))),
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
                                ->relationship('category', 'name')
                                ->label('Categoría')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn ($set, $state) => $set('slug', Str::slug($state))),
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
                                ->options([
                                    'Manual' => 'Manual',
                                    'Automática' => 'Automática',
                                    'CVT' => 'CVT',
                                    'Doble Embrague' => 'Doble Embrague',
                                ]),

                            Select::make('fuel')
                                ->label('Combustible')
                                ->options([
                                    'Bencina' => 'Bencina',
                                    'Diesel' => 'Diesel',
                                    'Híbrido' => 'Híbrido',
                                    'Eléctrico' => 'Eléctrico',
                                ]),

                            Select::make('traction')
                                ->label('Tracción')
                                ->options([
                                    '4x2' => '4x2',
                                    '4x4' => '4x4',
                                    'AWD' => 'AWD',
                                ]),
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

                TextColumn::make('model')
                    ->label('Modelo')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('year')
                    ->label('Año')
                    ->sortable(),

                TextColumn::make('price')
                    ->label('Precio')
                    ->money('CLP')
                    ->sortable(),

                TextColumn::make('category.name')
                    ->label('Categoría')
                    ->badge()
                    ->color('gray'),

                IconColumn::make('is_premium')
                    ->label('Premium')
                    ->boolean()
                    ->trueColor('warning'),

                IconColumn::make('is_published')
                    ->label('Visible')
                    ->boolean(),
            ])
            ->filters([
                // Filtros futuros
            ])
            ->actions([
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
