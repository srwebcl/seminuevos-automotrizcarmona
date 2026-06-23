<?php

namespace App\Filament\Resources\ClearanceVehicleResource\Pages;

use App\Filament\Resources\ClearanceVehicleResource;
use App\Models\SiteSetting;
use Filament\Actions;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRecords;
use Filament\Notifications\Notification;

class ManageClearanceVehicles extends ManageRecords
{
    protected static string $resource = ClearanceVehicleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('configurar_landing')
                ->label('Configurar Landing')
                ->icon('heroicon-o-cog-8-tooth')
                ->color('primary')
                ->form([
                    FileUpload::make('clearance_hero_desktop')
                        ->label('Banner Hero (Desktop)')
                        ->image()
                        ->directory('landing')
                        ->imageEditor()
                        ->helperText('Recomendado: 1920x600 px'),
                        
                    FileUpload::make('clearance_hero_mobile')
                        ->label('Banner Hero (Mobile)')
                        ->image()
                        ->directory('landing')
                        ->imageEditor()
                        ->helperText('Recomendado: 800x1000 px'),
                        
                    RichEditor::make('clearance_legal')
                        ->label('Términos y Condiciones Legales')
                        ->toolbarButtons([
                            'bold',
                            'italic',
                            'link',
                            'bulletList',
                            'orderedList',
                        ])
                ])
                ->mountUsing(function (Form $form) {
                    $settings = SiteSetting::first();
                    if ($settings) {
                        $form->fill([
                            'clearance_hero_desktop' => $settings->clearance_hero_desktop,
                            'clearance_hero_mobile' => $settings->clearance_hero_mobile,
                            'clearance_legal' => $settings->clearance_legal,
                        ]);
                    }
                })
                ->action(function (array $data) {
                    $settings = SiteSetting::first();
                    if (!$settings) {
                        $settings = new SiteSetting();
                    }
                    $settings->clearance_hero_desktop = $data['clearance_hero_desktop'];
                    $settings->clearance_hero_mobile = $data['clearance_hero_mobile'];
                    $settings->clearance_legal = $data['clearance_legal'];
                    $settings->save();

                    Notification::make()
                        ->title('Landing configurada correctamente')
                        ->success()
                        ->send();
                })
                ->modalWidth('2xl')
                ->modalHeading('Configurar Landing Page de Liquidación'),
        ];
    }
}
