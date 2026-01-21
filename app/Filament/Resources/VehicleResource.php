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
use Filament\Forms\Components\ColorPicker;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

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
                Forms\Components\Tabs::make('Tabs')
                    ->tabs([
                        // TAB 1: LA MÁQUINA (Datos Físicos y Técnicos)
                        Forms\Components\Tabs\Tab::make('La Máquina')
                            ->icon('heroicon-o-truck')
                            ->schema([
                                Grid::make(3)->schema([
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
                                    TextInput::make('km')
                                        ->label('Kilometraje')
                                        ->numeric()
                                        ->required(),

                                    TextInput::make('motor')
                                        ->label('Motor')
                                        ->placeholder('Ej: 2.0 Turbo'),

                                    TextInput::make('color')
                                        ->label('Color Exterior')
                                        ->placeholder('Ej: Blanco Perla'),
                                ]),

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
                            ]),

                        // TAB 2: LA VENTA (Datos Comerciales)
                        Forms\Components\Tabs\Tab::make('La Venta')
                            ->icon('heroicon-o-currency-dollar')
                            ->schema([
                                Grid::make(3)->schema([
                                    Forms\Components\Section::make('Estrategia de Precios')
                                        ->schema([
                                            Forms\Components\TextInput::make('price')
                                                ->label('Precio Contado')
                                                ->required()
                                                ->numeric()
                                                ->prefix('$'),
                                            Forms\Components\TextInput::make('price_financing')
                                                ->label('Precio Crédito')
                                                ->numeric()
                                                ->prefix('$')
                                                ->helperText('Opcional. Destacado en Azul.'),
                                            Forms\Components\TextInput::make('price_offer')
                                                ->label('Precio Oferta')
                                                ->numeric()
                                                ->prefix('$')
                                                ->helperText('Opcional. Destacado en Rojo.'),
                                        ])->columns(3),
                                ])->columnSpanFull(),

                                Grid::make(2)->schema([
                                    Section::make('Clasificación')
                                        ->schema([
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

                                    Section::make('Visibilidad y Estado')
                                        ->schema([
                                            // CONDICIONES DEL SISTEMA
                                            Grid::make(3)->schema([
                                                Toggle::make('is_published')
                                                    ->label('✅ Publicado en Web')
                                                    ->onColor('success')
                                                    ->helperText('Visible para todos'),

                                                Toggle::make('is_premium')
                                                    ->label('💎 Premium')
                                                    ->onColor('warning')
                                                    ->helperText('Sección Gold'),

                                                Toggle::make('is_featured')
                                                    ->label('⭐ Destacado')
                                                    ->helperText('Carrusel Home'),
                                            ]),

                                            // ETIQUETAS PROMOCIONALES (Switches Directos)
                                            Forms\Components\Group::make()
                                                ->schema(function () {
                                                    $tags = \App\Models\Tag::all();

                                                    // Placeholder for layout
                                                    $grid = Grid::make(3)->schema(
                                                        $tags->map(function ($tag) {
                                                        return Toggle::make('tag_' . $tag->id) // Unique name, not field bound
                                                            ->label($tag->name)
                                                            ->onColor(match ($tag->name) {
                                                                'Oferta' => 'danger',
                                                                'Liquidación' => 'warning',
                                                                'Cyber' => 'primary',
                                                                default => 'success',
                                                            })
                                                            ->live()
                                                            ->dehydrated(false) // No intentar guardar en modelo directamente
                                                            ->afterStateHydrated(function (Toggle $component, $record) use ($tag) {
                                                                if (!$record)
                                                                    return;
                                                                // Check direct DB relationship
                                                                $isActive = $record->tags()->where('tags.id', $tag->id)->exists();
                                                                $component->state($isActive);
                                                            })
                                                            ->afterStateUpdated(function (bool $state, $record) use ($tag) {
                                                                if (!$record)
                                                                    return;

                                                                if ($state) {
                                                                    $record->tags()->syncWithoutDetaching([$tag->id]);
                                                                } else {
                                                                    $record->tags()->detach($tag->id);
                                                                }
                                                            });
                                                    })->toArray()
                                                    );

                                                    return [$grid];
                                                }),
                                        ]),
                                ]),
                            ]),

                        // TAB 3: MULTIMEDIA (Restaurado a Pestaña)
                        Forms\Components\Tabs\Tab::make('Multimedia')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                FileUpload::make('photos')
                                    ->label('Galería de Imágenes')
                                    ->helperText('Arrastra las imágenes para reordenarlas. La primera será la portada.')
                                    ->multiple()
                                    ->reorderable()
                                    ->appendFiles()
                                    ->image()
                                    ->directory('vehicles')
                                    ->imageEditor()
                                    ->columnSpanFull()
                                    ->panelLayout('grid')
                                    ->imagePreviewHeight('200')
                                    ->imageResizeMode('cover')
                                    ->imageResizeTargetWidth('1280')
                                    ->imageResizeTargetHeight('720')
                                    ->maxSize(10240)
                                    ->required(),

                                Textarea::make('description')
                                    ->label('Descripción Comercial Detallada')
                                    ->rows(5)
                                    ->placeholder('Texto simple descriptivo.')
                                    ->columnSpanFull(),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns(self::getColumns())
            ->filters(self::getFilters())
            ->actions(self::getActions())
            ->bulkActions(self::getBulkActions())
            ->defaultSort('created_at', 'desc');
    }

    private static function getColumns(): array
    {
        return [
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

            Tables\Columns\ToggleColumn::make('is_published')
                ->label('Disponible')
                ->sortable(),

            Tables\Columns\ToggleColumn::make('is_premium')
                ->label('Premium')
                ->sortable(),

            Tables\Columns\ToggleColumn::make('is_featured')
                ->label('Destacado')
                ->sortable(),

            Tables\Columns\ToggleColumn::make('is_offer')
                ->label('Oferta')
                ->sortable(),
        ];
    }

    private static function getFilters(): array
    {
        return [
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

            // 1. FILTRO DE DISPONIBILIDAD (Publicados vs Ocultos)
            Tables\Filters\TernaryFilter::make('is_published')
                ->label('Disponibilidad')
                ->placeholder('Todos los Vehículos')
                ->trueLabel('Publicados (Visibles)')
                ->falseLabel('Borradores (Ocultos)'),

            // 2. FILTRO DE DESTACADOS (Home)
            Tables\Filters\Filter::make('is_featured')
                ->label('Solo Destacados')
                ->query(fn($query) => $query->where('is_featured', true)),

            // 3. FILTRO PREMIUM
            Tables\Filters\Filter::make('is_premium')
                ->label('Solo Premium')
                ->query(fn($query) => $query->where('is_premium', true)),

            // 4. FILTRO DE OFERTAS
            Tables\Filters\Filter::make('is_offer')
                ->label('En Oferta')
                ->query(fn($query) => $query->where('is_offer', true)),
        ];
    }

    private static function getActions(): array
    {
        return [
            Tables\Actions\Action::make('view_frontend')
                ->label('')
                ->tooltip('Ver en Sitio')
                ->icon('heroicon-o-eye')
                ->url(fn(Vehicle $record) => env('FRONTEND_URL', 'https://automotrizcarmona.cl') . '/auto/' . $record->slug)
                ->openUrlInNewTab(),
            Tables\Actions\EditAction::make()->label('')->tooltip('Editar'),
            Tables\Actions\DeleteAction::make()->label('')->tooltip('Borrar'),
        ];
    }

    private static function getBulkActions(): array
    {
        return [
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),

                // DISPONIBILIDAD
                Tables\Actions\BulkAction::make('mark_as_published')
                    ->label('Publicar Seleccionados')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(fn(Collection $records) => $records->each->update(['is_published' => true]))
                    ->deselectRecordsAfterCompletion(),

                Tables\Actions\BulkAction::make('mark_as_hidden')
                    ->label('Despublicar Seleccionados')
                    ->icon('heroicon-o-x-circle')
                    ->color('warning')
                    ->action(fn(Collection $records) => $records->each->update(['is_published' => false]))
                    ->deselectRecordsAfterCompletion(),

                // PREMIUM (Nuevo)
                Tables\Actions\BulkAction::make('mark_as_premium')
                    ->label('Hacer Premium')
                    ->icon('heroicon-o-sparkles') // Sparkles for premium
                    ->color('warning') // Gold-ish
                    ->action(fn(Collection $records) => $records->each->update(['is_premium' => true]))
                    ->deselectRecordsAfterCompletion(),

                Tables\Actions\BulkAction::make('unmark_as_premium')
                    ->label('Quitar Premium')
                    ->icon('heroicon-o-sparkles')
                    ->color('gray')
                    ->action(fn(Collection $records) => $records->each->update(['is_premium' => false]))
                    ->deselectRecordsAfterCompletion(),

                // DESTACADOS
                Tables\Actions\BulkAction::make('mark_as_featured')
                    ->label('Destacar Seleccionados')
                    ->icon('heroicon-o-star')
                    ->color('warning')
                    ->action(fn(Collection $records) => $records->each->update(['is_featured' => true]))
                    ->deselectRecordsAfterCompletion(),

                Tables\Actions\BulkAction::make('unmark_as_featured')
                    ->label('Quitar Destacado')
                    ->icon('heroicon-o-star')
                    ->color('gray')
                    ->action(fn(Collection $records) => $records->each->update(['is_featured' => false]))
                    ->deselectRecordsAfterCompletion(),

                // OFERTAS
                Tables\Actions\BulkAction::make('mark_as_offer')
                    ->label('Marcar en Oferta')
                    ->icon('heroicon-o-tag')
                    ->color('danger')
                    ->action(fn(Collection $records) => $records->each->update(['is_offer' => true]))
                    ->deselectRecordsAfterCompletion(),

                Tables\Actions\BulkAction::make('unmark_as_offer')
                    ->label('Quitar Oferta')
                    ->icon('heroicon-o-tag')
                    ->color('gray')
                    ->action(fn(Collection $records) => $records->each->update(['is_offer' => false]))
                    ->deselectRecordsAfterCompletion(),
            ]),
        ];
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