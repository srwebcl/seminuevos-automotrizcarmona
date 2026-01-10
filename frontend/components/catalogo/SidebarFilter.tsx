'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VehicleCategory } from '@/types/vehicle';

interface Brand {
    id: number;
    name: string;
    slug: string;
    vehicles_count: number;
}

interface SidebarFilterProps {
    brands: Brand[];
    categories: VehicleCategory[];
}

export default function SidebarFilter({ brands, categories }: SidebarFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const currentBrand = searchParams.get('brand');
    const currentCategory = searchParams.get('category');

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm !== (searchParams.get('q') || '')) {
                updateFilter('q', searchTerm);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page on filter change
        params.delete('page');
        router.push(`/catalogo?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Search */}
            <div className="mb-8">
                <h3 className="text-gray-900 font-bold uppercase text-xs tracking-wider mb-4">Búsqueda</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Modelo, versión..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-black transition"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400"></i>
                </div>
            </div>

            {/* Brands */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-900 font-bold uppercase text-xs tracking-wider">Marcas</h3>
                    {currentBrand && (
                        <button onClick={() => updateFilter('brand', null)} className="text-[10px] text-red-500 hover:underline">
                            Limpiar
                        </button>
                    )}
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${currentBrand === brand.slug ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-400 bg-white'}`}>
                                    {currentBrand === brand.slug && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                                </div>
                                <span className={`text-base transition ${currentBrand === brand.slug ? 'text-black font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {brand.name}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {brand.vehicles_count}
                            </span>
                            <input
                                type="radio"
                                name="brand"
                                className="hidden"
                                checked={currentBrand === brand.slug}
                                onChange={() => updateFilter('brand', brand.slug === currentBrand ? null : brand.slug)}
                                onClick={(e) => {
                                    if (brand.slug === currentBrand) {
                                        e.preventDefault();
                                        updateFilter('brand', null);
                                    }
                                }}
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-900 font-bold uppercase text-xs tracking-wider">Categoría</h3>
                    {currentCategory && (
                        <button onClick={() => updateFilter('category', null)} className="text-[10px] text-red-500 hover:underline">
                            Limpiar
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => updateFilter('category', cat.slug === currentCategory ? null : cat.slug)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg text-sm transition ${currentCategory === cat.slug ? 'bg-black text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <span>{cat.name}</span>
                            {currentCategory === cat.slug && <i className="fa-solid fa-check text-xs"></i>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
