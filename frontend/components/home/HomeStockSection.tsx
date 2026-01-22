'use client';

import { useState } from 'react';
import { Vehicle, VehicleCategory } from '@/types/vehicle';
import VehicleCard from '@/components/VehicleCard';
import { getVehicles } from '@/lib/api';

interface HomeStockSectionProps {
    initialVehicles: Vehicle[];
    categories: VehicleCategory[];
}

export default function HomeStockSection({ initialVehicles, categories }: HomeStockSectionProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [activeFilter, setActiveFilter] = useState('todo');
    const [loading, setLoading] = useState(false);

    const handleFilter = async (filterType: string, slug?: string) => {
        setLoading(true);
        setActiveFilter(slug ? slug : filterType);

        try {
            let response;
            if (filterType === 'todo') {
                response = await getVehicles(1);
            } else if (filterType === 'featured') {
                response = await getVehicles(1, { is_featured: true });
            } else if (filterType === 'premium') {
                response = await getVehicles(1, { is_premium: true });
            } else if (filterType === 'offers') {
                response = await getVehicles(1, { is_offer: true });
            } else if (filterType === 'category' && slug) {
                response = await getVehicles(1, { category: slug });
            } else {
                response = await getVehicles(1);
            }
            setVehicles(response.data);
        } catch (error) {
            console.error("Filter error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 md:pt-8" id="stock">
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-8 drop-shadow-sm">
                    Novedades en <span className="text-[#D4AF37]">Stock</span>
                </h2>

                {/* Filter List (Carousel on all devices, no arrows) */}
                <div className="flex flex-nowrap overflow-x-auto gap-3 pb-4 px-4 -mx-4 md:mx-0 md:px-0 scrollbar-hide snap-x transition-all duration-300">
                    <button
                        onClick={() => handleFilter('todo')}
                        className={`filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition whitespace-nowrap ${activeFilter === 'todo' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white'}`}
                    >
                        Todo
                    </button>

                    <button
                        onClick={() => handleFilter('featured')}
                        className={`filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${activeFilter === 'featured' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white'}`}
                    >
                        <i className="fa-solid fa-star text-yellow-500"></i> Destacados
                    </button>

                    <button
                        onClick={() => handleFilter('offers')}
                        className={`filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${activeFilter === 'offers' ? 'bg-black text-white border-black' : 'bg-white text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600'}`}
                    >
                        <i className="fa-solid fa-fire-flame-curved"></i> Ofertas
                    </button>

                    <button
                        onClick={() => handleFilter('premium')}
                        className={`filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${activeFilter === 'premium' ? 'bg-black text-white border-black' : 'bg-white text-premium-gold border-premium-gold hover:bg-black hover:text-white'}`}
                    >
                        <i className="fa-solid fa-crown"></i> Premium
                    </button>

                    {categories
                        .filter(cat => !['seminuevos', 'premium', 'ofertas'].includes(cat.slug))
                        .map((cat) => (
                            <button
                                key={cat.slug}
                                onClick={() => handleFilter('category', cat.slug)}
                                className={`filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition whitespace-nowrap ${activeFilter === cat.slug ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                </div>
            </div>

            <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))
                ) : (
                    <div className="col-span-4 text-center py-24">
                        <h3 className="text-lg font-bold text-gray-900">No encontramos vehículos</h3>
                        <p className="text-gray-500 text-sm mt-2">Intenta cambiar los filtros de búsqueda.</p>
                    </div>
                )}
            </div>

            <div className="mt-16 text-center">
                <a
                    href={
                        activeFilter === 'todo' ? '/catalogo' :
                            activeFilter === 'offers' ? '/catalogo?is_offer=1' :
                                activeFilter === 'featured' ? '/catalogo?is_featured=1' :
                                    activeFilter === 'premium' ? '/catalogo?is_premium=1' :
                                        `/catalogo?category=${activeFilter}`
                    }
                    className="inline-block px-10 py-4 rounded-full border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition duration-300"
                >
                    Ver Inventario Completo
                </a>
            </div>
        </section>
    );
}
