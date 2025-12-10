<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SiteSettingResource\Pages;
use App\Models\SiteSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Section;

class SiteSettingResource extends Resource
{
    protected static ?string $model = SiteSetting::class;

    // Icono de engranaje
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Configuración Web';
    protected static ?string $navigationGroup = 'Administración';
    protected static ?string $modelLabel = 'Configuración';
    protected static ?string $pluralModelLabel = 'Configuraciones';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Modo Festivo')
                    ->description('Activa decoraciones automáticas en el sitio web.')
                    ->schema([
                        Select::make('seasonal_mode')
                            ->label('Modo Actual')
                            ->options([
                                'none' => 'Modo Normal (Sin decoraciones)',
                                'christmas' => '🎄 Navidad (Diciembre)',
                                'new_year' => '✨ Año Nuevo (Enero)',
                                '18sept' => '🇨🇱 Fiestas Patrias (Septiembre)',
                            ])
                            ->required()
                            ->native(false),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('seasonal_mode')
                    ->label('Modo Activo')
                    ->badge()
                    ->colors([
                        'gray' => 'none',
                        'success' => 'christmas',
                        'warning' => 'new_year',
                        'danger' => '18sept',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->paginated(false); // Sin paginación porque es solo 1
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSiteSettings::route('/'),
            'edit' => Pages\EditSiteSetting::route('/{record}/edit'),
        ];
    }

    // Desactivar creación (solo queremos editar el existente)
    public static function canCreate(): bool
    {
        return false;
    }
    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return false;
    }
}
