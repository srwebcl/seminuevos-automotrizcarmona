'use client';

import { useState, useMemo } from 'react';
import { Vehicle } from '@/types/vehicle';
import VehicleCard from '@/components/VehicleCard';

interface ClearanceGridProps {
    initialVehicles: Vehicle[];
}

type SortOption = 'manual' | 'price_asc' | 'price_desc' | 'year_desc' | 'year_asc';

export default function ClearanceGrid({ initialVehicles }: ClearanceGridProps) {
    const [sortBy, setSortBy] = useState<SortOption>('manual');

    // Memos the sorted array to avoid unnecessary recalculations
    const sortedVehicles = useMemo(() => {
        const vehicles = [...initialVehicles];

        switch (sortBy) {
            case 'price_asc':
                return vehicles.sort((a, b) => a.price - b.price);
            case 'price_desc':
                return vehicles.sort((a, b) => b.price - a.price);
            case 'year_desc':
                return vehicles.sort((a, b) => b.year - a.year);
            case 'year_asc':
                return vehicles.sort((a, b) => a.year - b.year);
            case 'manual':
            default:
                // Manual is the original array order from API (which is sorted by clearance_sort_order)
                return vehicles;
        }
    }, [initialVehicles, sortBy]);

    return (
        <div className="w-full">
            {/* Header: Contador y Filtro */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200 pb-4">
                <p className="text-gray-500 font-medium">
                    Mostrando <span className="font-bold text-gray-900">{sortedVehicles.length}</span> vehículos disponibles
                </p>

                <div className="flex items-center gap-2">
                    <label htmlFor="sort" className="text-sm font-semibold text-gray-600">Ordenar por:</label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer"
                    >
                        <option value="manual">Orden Sugerido</option>
                        <option value="price_asc">Menor Precio</option>
                        <option value="price_desc">Mayor Precio</option>
                        <option value="year_desc">Año (Más nuevos)</option>
                        <option value="year_asc">Año (Más antiguos)</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            {sortedVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedVehicles.map((vehicle) => (
                        <VehicleCard 
                            key={vehicle.id} 
                            vehicle={vehicle} 
                            isClearanceView={true} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <i className="fa-solid fa-car-side text-4xl text-gray-300 mb-3"></i>
                    <h3 className="text-xl font-bold text-gray-600">No hay vehículos en liquidación</h3>
                    <p className="text-gray-400">Vuelve a revisar más tarde.</p>
                </div>
            )}
        </div>
    );
}
