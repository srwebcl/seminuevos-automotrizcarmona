'use client';

import { useState } from 'react';
import { Vehicle, VehicleCategory, PaginatedResponse } from '@/types/vehicle';
import SidebarFilter from './SidebarFilter';
import TopToolbar from './TopToolbar';
import VehicleCard from '@/components/VehicleCard';
import VehicleListCard from '@/components/VehicleListCard';
import Link from 'next/link';

interface Brand {
    id: number;
    name: string;
    slug: string;
    vehicles_count: number;
}

interface CatalogLayoutProps {
    vehicles: Vehicle[];
    meta: PaginatedResponse<Vehicle>['meta'];
    links: PaginatedResponse<Vehicle>['links'];
    brands: Brand[];
    categories: VehicleCategory[];
    searchParams: { page?: string; category?: string; brand?: string; q?: string; sort?: string; is_premium?: string };
}

export default function CatalogLayout({ vehicles, meta, links, brands, categories, searchParams }: CatalogLayoutProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const currentPage = meta.current_page;

    const getPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (searchParams.category) params.set('category', searchParams.category);
        if (searchParams.brand) params.set('brand', searchParams.brand);
        if (searchParams.q) params.set('q', searchParams.q);
        if (searchParams.sort) params.set('sort', searchParams.sort);
        if (searchParams.is_premium) params.set('is_premium', '1');
        params.set('page', page.toString());
        return `/catalogo?${params.toString()}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20 pb-12">

            {/* Mobile Filter Bar */}
            <div className="lg:hidden mb-6 flex gap-3 sticky top-20 z-30 bg-gray-50/95 backdrop-blur py-2">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex-1 bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <i className="fa-solid fa-sliders"></i> Filtros
                </button>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex items-center p-1 gap-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 rounded-lg transition ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-400'}`}
                    >
                        <i className="fa-solid fa-border-all"></i>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 rounded-lg transition ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-400'}`}
                    >
                        <i className="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Filter Drawer (Full Screen Overlay) */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[200] lg:hidden flex flex-col bg-white animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white safe-top">
                        <h3 className="font-black text-xl text-gray-900 tracking-tight uppercase">Filtros</h3>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition active:scale-95"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
                        <SidebarFilter brands={brands} categories={categories} />
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] safe-bottom">
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition shadow-lg shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Ver {meta.total} Vehículos <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar (Desktop) */}
                <aside className="hidden lg:block w-1/4 sticky top-24 h-fit">
                    <SidebarFilter brands={brands} categories={categories} />
                </aside>

                {/* Main Content (Right) */}
                <div className="w-full lg:w-3/4">
                    <div className="hidden lg:block">
                        <TopToolbar
                            total={meta.total}
                            viewMode={viewMode}
                            onViewChange={setViewMode}
                        />
                    </div>

                    {/* Vehicle List */}
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                        : "flex flex-col gap-4 mb-12"
                    }>
                        {vehicles.map((vehicle) => (
                            viewMode === 'grid'
                                ? <VehicleCard key={vehicle.id} vehicle={vehicle} />
                                : <VehicleListCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>

                    {/* No Results */}
                    {vehicles.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <i className="fa-solid fa-car-tunnel text-4xl text-gray-300 mb-4"></i>
                            <h3 className="text-lg font-bold text-gray-900">No encontramos vehículos</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="flex justify-center gap-2">
                            {links.prev && (
                                <Link
                                    href={getPageUrl(currentPage - 1)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition"
                                >
                                    <i className="fa-solid fa-chevron-left text-xs"></i> Anterior
                                </Link>
                            )}

                            <span className="px-4 py-2 text-gray-500 font-medium">
                                Página {currentPage} de {meta.last_page}
                            </span>

                            {links.next && (
                                <Link
                                    href={getPageUrl(currentPage + 1)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition"
                                >
                                    Siguiente <i className="fa-solid fa-chevron-right text-xs"></i>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
