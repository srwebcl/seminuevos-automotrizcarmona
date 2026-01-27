'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchGlobal } from '@/lib/api';
import { Banner } from '@/types/banner';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { VehicleCategory, Vehicle } from '@/types/vehicle';

interface HeroSectionProps {
    banners: Banner[];
}

interface Slide {
    id: string;
    type: 'image' | 'video';
    url: string;
    banner: Banner;
}

export default function HeroSection({ banners }: HeroSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [results, setResults] = useState<{ categories: VehicleCategory[], vehicles: Vehicle[] }>({ categories: [], vehicles: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const slides: Slide[] = useMemo(() => {
        if (!banners || banners.length === 0) {
            return [{
                id: 'fallback-0',
                type: 'image',
                url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop",
                banner: { id: 0, title: "Hero Background" } as any
            }];
        }
        return banners.flatMap((banner) => {
            if (banner.video_url) return [{ id: `video-${banner.id}`, type: 'video', url: banner.video_url, banner } as Slide];
            if (banner.image_url?.length) return banner.image_url.map((url, idx) => ({ id: `img-${banner.id}-${idx}`, type: 'image', url, banner } as Slide));
            return [];
        });
    }, [banners]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => setCurrentSlideIndex(prev => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.length < 2) { setResults({ categories: [], vehicles: [] }); return; }
            setIsLoading(true);
            try { const data = await searchGlobal(debouncedSearchTerm); setResults(data); setShowResults(true); }
            catch (e) { console.error(e); } finally { setIsLoading(false); }
        };
        performSearch();
    }, [debouncedSearchTerm]);

    return (
        <div className="relative h-[650px] flex items-center justify-center bg-black">
            <div className="absolute inset-0 z-0 overflow-hidden">
                {slides.map((slide, index) => {
                    const isActive = index === currentSlideIndex;
                    // LÓGICA CRÍTICA: La primera imagen (LCP) NO debe tener transición.
                    const isFirst = index === 0;

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 w-full h-full 
                                ${isFirst
                                    ? (isActive ? 'opacity-100 z-10' : 'opacity-0 z-0') // Sin 'duration-[2000ms]' para el primero
                                    : `transition-opacity duration-[1000ms] ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`
                                }
                            `}
                        >
                            <div className="relative w-full h-full">
                                {slide.type === 'video' ? (
                                    <video autoPlay muted loop playsInline className="object-cover w-full h-full" src={slide.url} />
                                ) : (
                                    <Image
                                        src={slide.url}
                                        alt={slide.banner.title || "Hero"}
                                        fill
                                        // Calidad 80 para recuperar nitidez (antes 60)
                                        quality={80}
                                        priority={isFirst}
                                        fetchPriority={isFirst ? "high" : "auto"}
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Contenido: Eliminamos AOS para evitar bloqueo de renderizado */}
            <div className="relative z-50 w-full max-w-5xl px-4 text-center">
                <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9] drop-shadow-2xl">
                    <span className="block mb-2">Tu próximo auto,</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] via-[#D4AF37] to-[#8A6E2F] filter brightness-125 drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] pb-2 pr-2 inline-block">
                        está aquí.
                    </span>
                </h1>

                <div className="mt-12 relative max-w-2xl mx-auto group">
                    <div className="relative z-50">
                        <i className={`fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 z-10 text-xl transition-colors duration-300 ${showResults ? 'text-premium-gold' : 'text-gray-400'}`}></i>
                        <input
                            type="text"
                            placeholder="Busca por marca, modelo o tipo... (Ej: BMW X5)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => { if (searchTerm.length >= 2) setShowResults(true); }}
                            className="w-full h-16 pl-16 pr-16 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-premium-gold/30 focus:bg-white transition-all text-xl font-medium shadow-[0_0_50px_rgba(0,0,0,0.4)]"
                        />
                        {searchTerm && !isLoading && (
                            <button
                                onClick={() => { setSearchTerm(''); setShowResults(false); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        )}
                        {isLoading && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                <i className="fa-solid fa-circle-notch fa-spin text-premium-gold text-xl"></i>
                            </div>
                        )}
                    </div>

                    {/* Resultados de Búsqueda */}
                    {showResults && (
                        <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] mt-4 overflow-hidden z-[100] border border-white/40 ring-1 ring-black/5 text-left transform transition-all duration-300 origin-top animate-in fade-in slide-in-from-top-2">
                            {/* Categories Grid */}
                            {results.categories.length > 0 && (
                                <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Categorías Sugeridas</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {results.categories.map((cat) => (
                                            <button
                                                key={cat.slug}
                                                onClick={() => router.push(`/catalogo?category=${cat.slug}`)}
                                                className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-premium-gold/50 hover:shadow-md hover:scale-[1.02] transition-all group"
                                            >
                                                <span className="text-sm font-bold text-gray-700 group-hover:text-black capitalize">{cat.name.toLowerCase()}</span>
                                                <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-premium-gold"></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Vehicles List */}
                            {results.vehicles.length > 0 && (
                                <div className="p-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2 ml-3">Vehículos Encontrados</p>
                                    <ul className="space-y-1">
                                        {results.vehicles.map((auto) => (
                                            <li key={auto.id}>
                                                <Link href={`/auto/${auto.slug}`} className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group ring-1 ring-transparent hover:ring-black/5">

                                                    {/* IZQUIERDA: Imagen + Datos */}
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="w-24 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0 relative shadow-inner">
                                                            {auto.cover_photo ? (
                                                                <Image
                                                                    src={auto.cover_photo}
                                                                    alt={auto.model}
                                                                    fill
                                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                    sizes="100px"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                                    <i className="fa-solid fa-car"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-baseline gap-2 mb-0.5">
                                                                <span className="text-[10px] font-bold text-premium-gold/80 uppercase tracking-wider">{auto.brand?.name}</span>
                                                                <span className="text-[10px] text-gray-400">• {auto.year}</span>
                                                            </div>
                                                            <h4 className="text-base font-black text-gray-900 leading-none truncate group-hover:text-premium-gold transition-colors">{auto.model}</h4>
                                                            <p className="text-xs text-gray-500 mt-1">{auto.km_formatted}</p>
                                                        </div>
                                                    </div>

                                                    {/* DERECHA: Precio */}
                                                    <div className="text-right shrink-0 pl-2">
                                                        <p className="text-sm font-black text-gray-900 leading-tight">
                                                            {auto.price_offer_formatted || auto.price_financing_formatted || auto.price_formatted}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Empty State */}
                            {results.categories.length === 0 && results.vehicles.length === 0 && (
                                <div className="p-8 text-center flex flex-col items-center justify-center text-gray-400">
                                    <i className="fa-solid fa-magnifying-glass text-3xl mb-3 opacity-20"></i>
                                    <p className="text-sm font-medium">No encontramos resultados para <span className="text-gray-900 font-bold">"{searchTerm}"</span></p>
                                    <p className="text-xs mt-1">Intenta buscar por marca o modelo general.</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-100">
                                <Link href="/catalogo" className="text-[10px] font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                                    Ver Inventario Completo
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
