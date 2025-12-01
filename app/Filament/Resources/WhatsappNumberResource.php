<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WhatsappNumberResource\Pages;
use App\Filament\Resources\WhatsappNumberResource\RelationManagers;
use App\Models\WhatsappNumber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class WhatsappNumberResource extends Resource
{
    protected static ?string $model = WhatsappNumber::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Administración';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'WhatsApp';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
             TextInput::make('label')
    ->label('Nombre / Cargo') // Ej: Ventas Seminuevos
    ->required(),
TextInput::make('phone')
    ->label('Número (Formato 569...)')
    ->numeric()
    ->required(),
Toggle::make('is_active')
    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListWhatsappNumbers::route('/'),
            'create' => Pages\CreateWhatsappNumber::route('/create'),
            'edit' => Pages\EditWhatsappNumber::route('/{record}/edit'),
        ];
    }
}
