<?php

namespace App\Filament\Resources\BannerResource\Pages;

use App\Filament\Resources\BannerResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBanners extends ListRecords
{
    protected static string $resource = BannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => \Filament\Resources\Components\Tab::make('Todos'),
            'hero' => \Filament\Resources\Components\Tab::make('Hero / Portada')
                ->modifyQueryUsing(fn($query) => $query->where('type', 'hero')),
            'promo' => \Filament\Resources\Components\Tab::make('Tarjetas (Promos)')
                ->modifyQueryUsing(fn($query) => $query->where('type', 'promo')),
            'full' => \Filament\Resources\Components\Tab::make('Banners Anchos')
                ->modifyQueryUsing(fn($query) => $query->where('type', 'full')),
            'catalog' => \Filament\Resources\Components\Tab::make('Catálogo General')
                ->modifyQueryUsing(fn($query) => $query->where('type', 'catalog')),
        ];
    }
}
