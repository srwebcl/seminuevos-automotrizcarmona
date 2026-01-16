<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Models\Banner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Get;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Administración';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Configuración del Banner')
                ->schema([
                    Select::make('type')
                        ->label('¿Qué tipo de elemento es?')
                        ->options([
                            'promo' => 'Tarjeta Categoría (Cuadrada)',
                            'full' => 'Banner Publicitario (Ancho Completo)',
                            'hero' => 'Fondo del Hero (Inicio)',
                            'catalog' => 'Banner Catálogo General (Seminuevos)',
                        ])
                        ->default('promo')
                        ->live() // Hace el formulario reactivo
                        ->required(),

                    Toggle::make('is_active')->label('Visible')->default(true),
                    TextInput::make('sort_order')->label('Orden')->numeric()->default(0),
                ])->columns(3),

            // SECCIÓN: IMÁGENES Y VIDEO
            Section::make('Archivos Multimedia')
                ->schema([
                    // Imagen Principal (Para todos)
                    FileUpload::make('image_path')
                        ->label(fn(Get $get) => match ($get('type')) {
                            'hero' => 'Imágenes de Fondo (PC) - Soporta Galería',
                            'full' => 'Banner Versión PC (1735x170)',
                            default => 'Imagen de Tarjeta',
                        })
                        ->image()
                        ->directory('banners')
                        ->imagePreviewHeight('200')
                        ->columnSpan(fn(Get $get) => $get('type') === 'full' ? 1 : 2)
                        ->multiple()
                        ->reorderable()
                        ->appendFiles()
                        ->required(),

                    // Imagen Móvil (Solo para Full Width)
                    FileUpload::make('mobile_image_path')
                        ->label('Banner Versión Móvil (767x301)')
                        ->image()
                        ->directory('banners')
                        ->visible(fn(Get $get) => $get('type') === 'full'),

                    // Video (Solo para Hero)
                    FileUpload::make('video_path')
                        ->label('Video de Fondo (Opcional - Reemplaza la imagen)')
                        ->acceptedFileTypes(['video/mp4'])
                        ->directory('banners')
                        ->visible(fn(Get $get) => $get('type') === 'hero')
                        ->columnSpanFull(),
                ])->columns(2),

            // SECCIÓN: CONTENIDO (Solo para Tarjetas y Full)
            Section::make('Contenido y Enlaces')
                ->visible(fn(Get $get) => $get('type') !== 'hero')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('title')
                            ->label('Título')
                            ->visible(fn(Get $get) => $get('type') === 'promo'),

                        TextInput::make('subtitle')
                            ->label('Subtítulo / Etiqueta')
                            ->visible(fn(Get $get) => $get('type') === 'promo'),
                    ]),

                    Grid::make(1)->schema([
                        // Selector Inteligente de Tipo de Enlace (Virtual, no se guarda en BD)
                        Select::make('link_source')
                            ->label('Destino del Enlace')
                            ->options([
                                'category' => 'Categoría Específica (BD)',
                                'seminuevos' => 'Todo el Stock (Seminuevos)',
                                'premium' => 'Sección Premium',
                                'offers' => 'Sección Ofertas',
                                'manual' => 'URL Manual Independiente',
                            ])
                            ->default('category')
                            ->live()
                            ->dehydrated(false) // !!! IMPORTANTE: No intentar guardar este campo en la BD
                            ->afterStateHydrated(function (Select $component, $state, $record) {
                                // Al cargar (Editar), deducimos qué tipo es según los datos guardados
                                if (!$record)
                                    return;

                                if ($record->category_id) {
                                    $component->state('category');
                                } elseif ($record->link === '/catalogo') {
                                    $component->state('seminuevos');
                                } elseif ($record->link === '/catalogo?is_premium=1') {
                                    $component->state('premium');
                                } elseif ($record->link === '/catalogo?is_offer=1') {
                                    $component->state('offers');
                                } elseif (!empty($record->link)) {
                                    $component->state('manual');
                                }
                            })
                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                // Auto-fill el link manual si seleccionan presets
                                if ($state === 'seminuevos') {
                                    $set('link', '/catalogo');
                                    $set('category_id', null);
                                } elseif ($state === 'premium') {
                                    $set('link', '/catalogo?is_premium=1');
                                    $set('category_id', null);
                                } elseif ($state === 'offers') {
                                    $set('link', '/catalogo?is_offer=1');
                                    $set('category_id', null);
                                } elseif ($state === 'category') {
                                    $set('link', null);
                                }
                            }),

                        // Opción A: Link a Categoría
                        Select::make('category_id')
                            ->label('Seleccionar Categoría')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->visible(fn(Get $get) => $get('link_source') === 'category')
                            ->required(fn(Get $get) => $get('link_source') === 'category'),

                        // Opción B: Link Manual (Visible y editable si es manual, o readonly si es preset)
                        TextInput::make('link')
                            ->label(fn(Get $get) => $get('link_source') === 'manual' ? 'URL Manual' : 'URL Generada Automáticamente')
                            ->regex('/^(\/|https?:\/\/)/')
                            ->placeholder('https://... o /catalogo')
                            ->visible(fn(Get $get) => $get('link_source') !== 'category')
                            ->readOnly(fn(Get $get) => $get('link_source') !== 'manual'),
                    ]),

                    TextInput::make('button_text')
                        ->label('Texto del Botón')
                        ->default('Ver más')
                        ->visible(fn(Get $get) => $get('type') === 'promo'),

                    Select::make('style')
                        ->label('Estilo Visual')
                        ->options([
                            'standard' => 'Estándar',
                            'premium' => 'Premium (Dorado)',
                            'dark' => 'Oscuro',
                        ])
                        ->default('standard')
                        ->visible(fn(Get $get) => $get('type') === 'promo'),
                ]),
        ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_path')
                    ->label('Imagen')
                    ->height(40),
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'promo' => 'Tarjeta',
                        'full' => 'Banner Completo',
                        'hero' => 'Hero/Portada',
                        'catalog' => 'Catálogo General',
                        default => $state,
                    })
                    ->colors(['primary' => 'promo', 'success' => 'full', 'warning' => 'hero', 'info' => 'catalog']),
                Tables\Columns\TextColumn::make('title')
                    ->label('Título')
                    ->limit(20),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Activo')
                    ->boolean(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}
