<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Amber,
                'gray' => Color::Slate,
            ])
            ->brandName('Automotriz Carmona')
            ->brandLogo(asset('images/logo.png'))
            ->brandLogoHeight('3.5rem')
            ->favicon(asset('favicon.png')) // Asumiendo que existe o usará el default
            ->font('Poppins')
            ->collapsibleNavigationGroups() // Removed sidebarCollapsibleOnDesktop
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                \App\Filament\Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
                Widgets\FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                'panels::head.end',
                fn(): string => \Illuminate\Support\Facades\Blade::render(<<<'HTML'
                    <style>
                        /* Force Black Navbar - inline to avoid cache */
                        .fi-topbar, 
                        .fi-topbar > nav,
                        .fi-topbar header {
                            background-color: #000000 !important; 
                            background-image: none !important;
                            border-bottom: 1px solid #333 !important;
                            --tw-bg-opacity: 1 !important;
                        }
                        
                        /* Fix Text Colors in Navbar */
                        .fi-topbar .fi-btn,
                        .fi-topbar .fi-icon-btn {
                            color: #ffffff !important;
                        }
                        
                        /* PROFILE BUTTON SPECIFIC FIX */
                        .fi-topbar .fi-user-menu-btn {
                            background-color: rgba(255, 255, 255, 0.1) !important; /* Subtle box */
                            border: 1px solid rgba(255, 255, 255, 0.2) !important;
                            color: #ffffff !important;
                            border-radius: 0.5rem;
                        }
                        .fi-topbar .fi-user-menu-btn:hover {
                            background-color: rgba(255, 255, 255, 0.25) !important;
                        }

                        .fi-topbar .fi-icon-btn:hover,
                        .fi-topbar .fi-btn:hover {
                            background-color: rgba(255,255,255,0.15) !important;
                        }
                        
                        /* Sidebar Header matches - Full Width Effect */
                        .fi-sidebar-header {
                            background-color: #000000 !important;
                            border-bottom: 1px solid #333 !important;
                            height: 4rem !important;
                        }

                        /* Fix Logo Aspect Ratio */
                        .fi-sidebar-header .fi-logo {
                            height: 100% !important;
                        }
                        
                        .fi-sidebar-header .fi-logo img {
                            height: 2.5rem !important;
                            width: auto !important;
                            object-fit: contain !important;
                        }

                        /* Sidebar Navigation */
                        .fi-sidebar-nav {
                            background-color: #ffffff !important;
                        }
                        
                        /* Font */
                        body {
                            --font-family: 'Poppins', sans-serif;
                        }
                        
                        /* Buttons */
                        .fi-btn-primary {
                            background-image: linear-gradient(135deg, #fbbf24, #d97706) !important;
                            border: none !important;
                            color: white !important;
                            font-weight: 800 !important;
                            text-transform: uppercase !important;
                        }
                    </style>
                HTML)
            );
    }
}
