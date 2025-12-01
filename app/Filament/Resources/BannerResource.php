<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Models\Banner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    // AJUSTE MENÚ: Administración > Banners
    protected static ?string $navigationGroup = 'Administración';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('title')
                ->label('Título (Opcional)'),

            FileUpload::make('image_path')
                ->label('Imagen del Banner')
                ->image()
                ->directory('banners')
                ->columnSpanFull()
                ->required(),

            TextInput::make('link')
                ->label('Enlace al hacer clic (Opcional)')
                ->url()
                ->placeholder('https://...'),

            TextInput::make('sort_order')
                ->label('Orden')
                ->numeric()
                ->default(0),

            Toggle::make('is_active')
                ->label('Visible')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Imagen')
                    ->height(50), // Altura para previsualizar

                TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->placeholder('Sin título'),

                TextColumn::make('link')
                    ->label('Enlace')
                    ->limit(30),

                TextColumn::make('sort_order')
                    ->label('Orden')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Visible')
                    ->boolean(),
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
            ])
            ->defaultSort('sort_order', 'asc'); // Ordenar por defecto por el campo 'orden'
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
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}
