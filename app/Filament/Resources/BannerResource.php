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
                            'hero' => 'Imagen de Fondo (PC)',
                            'full' => 'Banner Versión PC (1920x400)',
                            default => 'Imagen de Tarjeta',
                        })
                        ->image()
                        ->directory('banners')
                        ->columnSpan(fn(Get $get) => $get('type') === 'full' ? 1 : 2)
                        ->required(),

                    // Imagen Móvil (Solo para Full Width)
                    FileUpload::make('mobile_image_path')
                        ->label('Banner Versión Móvil (600x600)')
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

                    Grid::make(2)->schema([
                        // Opción A: Link a Categoría
                        Select::make('category_id')
                            ->label('Vincular a Categoría')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload(),

                        // Opción B: Link Manual
                        TextInput::make('link')
                            ->label('O link manual externo')
                            ->url()
                            ->placeholder('https://...'),
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
