'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchGlobal } from '@/lib/api';
import { Vehicle, VehicleCategory } from '@/types/vehicle';
import { Banner } from '@/types/banner';
import { useDebounce } from 'use-debounce';

interface HeroSectionProps {
    banners: Banner[];
}

interface Slide {
    id: string; // unique key combining banner id and index
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

    // Slideshow Logic
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate flattened slides
    const slides: Slide[] = useMemo(() => {
        if (!banners || banners.length === 0) {
            return [{
                id: 'fallback-0',
                type: 'image',
                url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop",
                banner: {
                    id: 0,
                    title: "Hero Background",
                    image_url: [],
                    type: 'hero',
                    video_url: null,
                    subtitle: null,
                    link: null,
                    category_slug: null,
                    mobile_image_url: null,
                    sort_order: 0
                }
            }];
        }

        return banners.flatMap((banner) => {
            if (banner.video_url) {
                return [{
                    id: `video-${banner.id}`,
                    type: 'video',
                    url: banner.video_url,
                    banner: banner
                } as Slide];
            }

            // Map multiple images to slides
            if (banner.image_url && banner.image_url.length > 0) {
                return banner.image_url.map((url, idx) => ({
                    id: `img-${banner.id}-${idx}`,
                    type: 'image',
                    url: url,
                    banner: banner
                } as Slide));
            }

            return [];
        });
    }, [banners]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlideIndex(prev => (prev + 1) % slides.length);
        }, 5000); // 5 seconds per slide (Faster change)
        return () => clearInterval(timer);
    }, [slides.length]);


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
        <div className="relative h-[650px] flex items-center justify-center bg-black">
            {/* Background Slideshow Container */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {slides.map((slide, index) => {
                    const isActive = index === currentSlideIndex;
                    const isVideo = slide.type === 'video';

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            {isVideo ? (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="object-cover w-full h-full"
                                    src={slide.url}
                                />
                            ) : (
                                <div
                                    className={`relative w-full h-full transform-gpu transition-transform duration-[7000ms] ease-out ${isActive && mounted ? 'scale-110' : 'scale-100'
                                        }`}
                                >
                                    <Image
                                        src={slide.url}
                                        alt={slide.banner.title || "Hero Background"}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                        priority={index === 0}
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Global Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 z-10 pointer-events-none"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-50 w-full max-w-5xl px-4 text-center">
                {/* POWER TITLE - Enhanced Typography & Shadows */}
                <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative">
                    <span className="block mb-2">Tu próximo auto,</span>
                    <span
                        className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] via-[#D4AF37] to-[#8A6E2F] filter brightness-125 drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                    >
                        está aquí.
                    </span>
                </h1>

                {/* Search Bar Container */}
                <div
                    className="mt-12 relative max-w-2xl mx-auto group"
                >
                    <div className="relative z-50 transition-transform duration-300 group-focus-within:scale-105">
                        <i className={`fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 z-10 text-xl transition-colors duration-300 ${showResults ? 'text-premium-gold' : 'text-gray-400'}`}></i>
                        <input
                            type="text"
                            placeholder="Busca por marca, modelo o tipo... (Ej: BMW X5)"
                            value={searchTerm}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onFocus={() => { if (searchTerm.length >= 2) setShowResults(true); }}
                            className="w-full h-16 pl-16 pr-16 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-premium-gold/30 focus:bg-white transition-all text-xl font-medium shadow-[0_0_50px_rgba(0,0,0,0.4)]"
                            autoComplete="off"
                        />
                        {isLoading && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                <i className="fa-solid fa-circle-notch fa-spin text-premium-gold text-xl"></i>
                            </div>
                        )}
                        {searchTerm && !isLoading && (
                            <button
                                onClick={() => { setSearchTerm(''); setShowResults(false); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        )}
                    </div>

                    {/* Instant Search Results Dropdown - High Impact Design */}
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
                                                <Link href={`/auto/${auto.slug}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group ring-1 ring-transparent hover:ring-black/5">
                                                    {/* Pro Image Container */}
                                                    <div className="w-24 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0 relative shadow-inner">
                                                        {auto.cover_photo ? (
                                                            <Image
                                                                src={auto.cover_photo}
                                                                alt={auto.model}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                unoptimized={true}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                                <i className="fa-solid fa-car"></i>
                                                            </div>
                                                        )}
                                                        {auto.is_premium && (
                                                            <div className="absolute top-0 right-0 bg-premium-gold text-black text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                                                                PRO
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline gap-2 mb-0.5">
                                                            <span className="text-[10px] font-bold text-premium-gold/80 uppercase tracking-wider">{auto.brand?.name}</span>
                                                            <span className="text-[10px] text-gray-400">• {auto.year}</span>
                                                        </div>
                                                        <h4 className="text-base font-black text-gray-900 leading-none truncate group-hover:text-premium-gold transition-colors">{auto.model}</h4>
                                                        <p className="text-xs text-gray-500 mt-1">{auto.km_formatted}</p>
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="text-right pl-2">
                                                        <p className="text-sm font-bold text-gray-900 leading-tight">{auto.price_formatted}</p>
                                                        <div className="mt-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                            <span className="text-[10px] font-bold text-premium-gold flex items-center justify-end gap-1">
                                                                VER DETALLES <i className="fa-solid fa-arrow-right"></i>
                                                            </span>
                                                        </div>
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
