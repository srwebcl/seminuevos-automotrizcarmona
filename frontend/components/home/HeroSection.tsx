'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchGlobal } from '@/lib/api';
import { Banner } from '@/types/banner';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { VehicleCategory, Vehicle } from '@/types/vehicle'; // Asegura importar los tipos

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
        <div className="relative h-[650px] flex items-center justify-center bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
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
                                        // Calidad 60 reduce el peso dramáticamente en móvil sin perder nitidez visible
                                        quality={60}
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] via-[#D4AF37] to-[#8A6E2F] filter brightness-125">
                        está aquí.
                    </span>
                </h1>

                <div className="mt-12 relative max-w-2xl mx-auto group">
                    <div className="relative z-50">
                        <i className={`fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 z-10 text-xl ${showResults ? 'text-premium-gold' : 'text-gray-400'}`}></i>
                        <input
                            type="text"
                            placeholder="Busca por marca, modelo o tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => { if (searchTerm.length >= 2) setShowResults(true); }}
                            className="w-full h-16 pl-16 pr-16 rounded-2xl bg-white/95 backdrop-blur-xl text-gray-900 focus:outline-none text-xl font-medium shadow-2xl"
                        />
                        {/* ... (Botón limpiar y loader se mantienen igual) ... */}
                    </div>

                    {/* Resultados de Búsqueda */}
                    {showResults && (
                        <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl mt-4 overflow-hidden z-[100] text-left">
                            {/* ... (Mantén tu lógica de renderizado de resultados aquí) ... */}
                            {/* IMPORTANTE: En la lista de autos, asegura usar sizes="100px" en las imágenes pequeñas */}
                            {results.vehicles.length > 0 && (
                                <div className="p-2">
                                    <ul className="space-y-1">
                                        {results.vehicles.map((auto) => (
                                            <li key={auto.id}>
                                                <Link href={`/auto/${auto.slug}`} className="flex items-center gap-4 p-3 hover:bg-white/50 rounded-xl">
                                                    <div className="w-24 h-16 relative rounded-lg overflow-hidden">
                                                        {auto.cover_photo && (
                                                            <Image
                                                                src={auto.cover_photo}
                                                                alt={auto.model}
                                                                fill
                                                                className="object-cover"
                                                                sizes="100px" // ESTO FALTABA
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{auto.brand?.name} {auto.model}</p>
                                                        <p className="text-xs text-gray-500">{auto.year} • {auto.price_formatted}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
