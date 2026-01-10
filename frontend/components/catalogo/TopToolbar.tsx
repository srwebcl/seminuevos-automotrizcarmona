'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface TopToolbarProps {
    total: number;
    viewMode: 'grid' | 'list';
    onViewChange: (mode: 'grid' | 'list') => void;
}

export default function TopToolbar({ total, viewMode, onViewChange }: TopToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'latest';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.push(`/catalogo?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 gap-4">
            <div className="text-sm text-gray-500">
                Encontramos <span className="font-bold text-gray-900">{total}</span> vehículos
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Ordenar por:</span>
                    <select
                        value={currentSort}
                        onChange={handleSortChange}
                        className="text-sm border-none bg-gray-50 rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer font-medium text-gray-900"
                    >
                        <option value="latest">Más recientes</option>
                        <option value="price_asc">Menor Precio</option>
                        <option value="price_desc">Mayor Precio</option>
                    </select>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onViewChange('grid')}
                        className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className="fa-solid fa-border-all"></i>
                    </button>
                    <button
                        onClick={() => onViewChange('list')}
                        className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
