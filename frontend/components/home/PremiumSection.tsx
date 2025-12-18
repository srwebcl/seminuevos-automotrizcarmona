'use client';

import { useEffect, useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPremiumVehicles } from '@/lib/api';
import { Vehicle } from '@/types/vehicle';

export default function PremiumSection({ vehicles: initialVehicles }: { vehicles?: Vehicle[] }) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || []);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!initialVehicles) {
            const fetchPremium = async () => {
                try {
                    const response = await getPremiumVehicles();
                    setVehicles(response.data);
                } catch (error) {
                    console.error("Failed to load premium vehicles", error);
                }
            };
            fetchPremium();
        }
    }, [initialVehicles]);

    const handleCopyLink = (url: string, id: number) => {
        if (navigator.share) {
            navigator.share({
                title: 'Automotriz Carmona Premium',
                text: 'Mira este auto increíble',
                url: url,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (vehicles.length === 0) return null;

    return (
        <section className="w-full relative overflow-hidden py-16 border-t border-white/5 bg-[#0a0a0a]">
            {/* ULTRA PRO Background: "The Dark Showroom" */}
            <div className="absolute inset-0 bg-[#0a0a0a] z-0">
                {/* 1. Subtle floor reflection simulation */}
                <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black via-[#0f0f0f] to-transparent opacity-80"></div>

                {/* 2. Abstract Geometric Light Rays */}
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-[#1a1a1a] via-transparent to-transparent opacity-40 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-gradient-to-br from-[#1a1a1a] via-transparent to-transparent opacity-40 pointer-events-none"></div>

                {/* 3. The "Gold Dust" Ambient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(212,175,55,0.08),transparent_70%)] pointer-events-none"></div>

                {/* 4. Fine Grain Texture for realism */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Compact Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div className="text-left">
                        <span className="inline-block text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-[#D4AF37]/50 pb-1">
                            Exclusividad Garantizada
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white italic tracking-tighter leading-none">
                            Colección <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F1D8] via-[#D4AF37] to-[#F9F1D8]">Premium</span>
                        </h2>
                    </div>

                    {/* Carousel Controls - Visible & Interactive */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-300 active:scale-95 group"
                        >
                            <i className="fa-solid fa-chevron-left group-hover:text-[#D4AF37] transition-colors"></i>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37] text-white flex items-center justify-center transition-all duration-300 active:scale-95 group"
                        >
                            <i className="fa-solid fa-chevron-right group-hover:text-[#D4AF37] transition-colors"></i>
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x scrollbar-hide gap-6 pb-8 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {vehicles.map((auto) => (
                        <div key={auto.id} className="snap-center shrink-0 w-[85%] sm:w-[360px] bg-[#111] rounded-[24px] overflow-hidden border border-white/5 transition-all duration-500 group relative shadow-2xl flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                            {/* Improved Hover Border Glow */}
                            <div className="absolute inset-0 rounded-[24px] border border-transparent group-hover:border-[#D4AF37]/30 transition-colors pointer-events-none z-40"></div>

                            {/* Image Section */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Link href={`/auto/${auto.slug}`}>
                                    <div className="absolute top-4 left-4 z-30 pointer-events-none">
                                        <span className="bg-black/60 text-white text-[9px] font-bold px-3 py-1 rounded backdrop-blur-md border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
                                            <i className="fa-solid fa-crown text-[#D4AF37] text-[9px]"></i> PREMIUM
                                        </span>
                                    </div>
                                    {auto.cover_photo && (
                                        <Image
                                            src={auto.cover_photo}
                                            alt={auto.model}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 unoptimized={true}"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90"></div>
                                </Link>
                            </div>

                            {/* Content Section */}
                            <div className="px-6 pb-6 pt-2 relative flex-1 flex flex-col bg-[#111]">
                                {/* Header: Brand & Actions */}
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[#D4AF37] font-bold text-[10px] tracking-[0.2em] uppercase">
                                        {auto.brand.name}
                                    </span>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(`https://wa.me/?text=Mira este ${auto.brand.name} en Carmona: https://automotrizcarmona.cl/auto/${auto.slug}`, '_blank');
                                            }}
                                            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#25D366] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                                        >
                                            <i className="fa-brands fa-whatsapp text-xs"></i>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCopyLink(`https://automotrizcarmona.cl/auto/${auto.slug}`, auto.id);
                                            }}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${copiedId === auto.id ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white hover:text-black'
                                                }`}
                                        >
                                            {copiedId === auto.id ? <i className="fa-solid fa-check text-xs"></i> : <i className="fa-solid fa-link text-xs"></i>}
                                        </button>
                                    </div>
                                </div>

                                {/* Model Name - Optimized Typography */}
                                <Link href={`/auto/${auto.slug}`} className="block mb-4 group-hover:text-[#D4AF37] transition-colors">
                                    <h3 className="text-xl leading-tight font-bold text-white italic line-clamp-2 h-12 flex items-center">
                                        {auto.model}
                                    </h3>
                                </Link>

                                {/* Compact Info Grid */}
                                <div className="flex items-center gap-2 mb-6 text-[11px] text-gray-400 border-t border-b border-white/5 py-3 justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-calendar text-[#D4AF37]"></i>
                                        <span>{auto.year}</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10"></div>
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-road text-[#D4AF37]"></i>
                                        <span>{auto.km_formatted.toUpperCase()}</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10"></div>
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-gears text-[#D4AF37]"></i>
                                        {/* Truncate long transmission names */}
                                        <span className="truncate max-w-[60px]" title={auto.transmission}>
                                            {auto.transmission === 'AUTOMATICA' ? 'AUT' : (auto.transmission === 'MECANICA' ? 'MEC' : 'AUT')}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer: Price & CTA */}
                                <div className="mt-auto flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Precio Lista</p>
                                        <p className="text-xl font-bold text-white tracking-tight">{auto.price_formatted}</p>
                                    </div>
                                    <Link href={`/auto/${auto.slug}`} className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-full flex items-center justify-center transition-all duration-300">
                                        <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual Indicator of Scroll */}
                <div className="w-full flex justify-center mt-6 gap-1">
                    <div className="w-16 h-1 bg-[#D4AF37] rounded-full"></div>
                    <div className="w-2 h-1 bg-white/10 rounded-full"></div>
                    <div className="w-2 h-1 bg-white/10 rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
