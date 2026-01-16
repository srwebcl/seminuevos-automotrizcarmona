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
                                'cyber' => '🔥 Cyber Day (Ofertas)',
                            ])
                            ->required()
                            ->native(false),
                    ]),
                Section::make('Redes Sociales')
                    ->description('Enlaces a perfiles sociales (Footer).')
                    ->schema([
                        Forms\Components\TextInput::make('instagram_url')
                            ->label('Instagram URL')
                            ->url()
                            ->prefixIcon('heroicon-o-link'),
                        Forms\Components\TextInput::make('facebook_url')
                            ->label('Facebook URL')
                            ->url()
                            ->prefixIcon('heroicon-o-link'),
                        Forms\Components\TextInput::make('linkedin_url')
                            ->label('LinkedIn URL')
                            ->url()
                            ->prefixIcon('heroicon-o-link'),
                        Forms\Components\TextInput::make('youtube_url')
                            ->label('YouTube URL')
                            ->url()
                            ->prefixIcon('heroicon-o-link'),
                    ])->columns(2)
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
                        'info' => 'cyber', // Using info (blue/cyan) or we can use custom hex if Filament supports it, but 'info' or 'primary' is safer for standard badges. Let's stick to standard colors for now or 'purple' if custom colors are registered. Assuming standard colors: info is distinct enough.
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
