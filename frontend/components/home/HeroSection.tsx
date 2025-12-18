'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchGlobal } from '@/lib/api';
import { Vehicle, VehicleCategory } from '@/types/vehicle';
import { useDebounce } from 'use-debounce'; // Ensure this package is installed or use custom implementation

export default function HeroSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [results, setResults] = useState<{ categories: VehicleCategory[], vehicles: Vehicle[] }>({ categories: [], vehicles: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.length < 2) {
                setResults({ categories: [], vehicles: [] });
                setShowResults(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchGlobal(debouncedSearchTerm);
                setResults(data);
                setShowResults(true);
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [debouncedSearchTerm]);

    const handleInputChange = (value: string) => {
        setSearchTerm(value);
        if (value.length < 2) setShowResults(false);
    };

    return (
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* Fallback Image */}
                <Image
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
            </div>

            <div className="relative z-30 w-full max-w-4xl px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Tu próximo auto, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D8] via-[#D4AF37] to-[#996515] drop-shadow-md filter brightness-110">
                        está aquí.
                    </span>
                </h1>

                <div className="mt-10 relative max-w-2xl mx-auto group z-50">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 z-10"></i>
                        <input
                            type="text"
                            placeholder="Busca por marca, modelo o tipo... (Ej: BMW X5)"
                            value={searchTerm}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onFocus={() => { if (searchTerm.length >= 2) setShowResults(true); }}
                            className="w-full h-14 pl-14 pr-16 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-gold/50 focus:bg-white transition-all text-base shadow-xl"
                            autoComplete="off"
                        />
                        {isLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <i className="fa-solid fa-circle-notch fa-spin text-premium-gold"></i>
                            </div>
                        )}
                    </div>

                    {/* Instant Search Results Dropdown */}
                    {showResults && (
                        <div className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl mt-3 overflow-hidden z-50 border border-gray-100 ring-1 ring-black/5 text-left">

                            {/* Categories Section */}
                            {results.categories.length > 0 && (
                                <div className="bg-gray-50 border-b border-gray-100 p-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1">Categorías</p>
                                    {results.categories.map((cat) => (
                                        <button
                                            key={cat.slug}
                                            onClick={() => router.push(`/catalogo?category=${cat.slug}`)}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-900 hover:bg-white hover:text-premium-gold rounded-lg transition-colors group"
                                        >
                                            <span>Ver todos los <span className="capitalize">{cat.name.toLowerCase()}</span></span>
                                            <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-premium-gold text-xs"></i>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Vehicles Section */}
                            {results.vehicles.length > 0 && (
                                <ul className="divide-y divide-gray-100">
                                    {results.vehicles.map((auto) => (
                                        <li key={auto.id} className="group">
                                            <Link href={`/auto/${auto.slug}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors">
                                                {/* Image */}
                                                <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                                                    {auto.cover_photo ? (
                                                        <Image src={auto.cover_photo} alt={auto.model} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300"></div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0 text-left pl-2">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{auto.brand?.name}</p>
                                                    <h4 className="text-sm font-black text-gray-900 leading-tight truncate">{auto.model}</h4>
                                                    <p className="text-xs text-gray-500">{auto.year} • {auto.km_formatted}</p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-gray-900 tracking-tight">{auto.price_formatted}</p>
                                                    <span className="inline-block mt-1 text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-full group-hover:bg-premium-gold transition-colors">
                                                        VER <i className="fa-solid fa-chevron-right text-[8px] ml-0.5"></i>
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Empty State */}
                            {results.categories.length === 0 && results.vehicles.length === 0 && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No encontramos resultados para "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
