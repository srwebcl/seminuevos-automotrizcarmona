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
    const sectionRef = useRef<HTMLElement>(null);
    // Refs for independent moving blobs
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);
    const blob3Ref = useRef<HTMLDivElement>(null);

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

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        if (!sectionRef.current) return;
        const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Move blobs with different "parallax" speeds
        if (blob1Ref.current) {
            blob1Ref.current.animate({
                transform: `translate(${x * 40}px, ${y * 40}px)`
            }, { duration: 1000, fill: 'forwards' });
        }
        if (blob2Ref.current) {
            blob2Ref.current.animate({
                transform: `translate(${-x * 60}px, ${-y * 60}px)`
            }, { duration: 1500, fill: 'forwards' });
        }
        if (blob3Ref.current) {
            blob3Ref.current.animate({
                transform: `translate(${x * 20}px, ${-y * 20}px)`
            }, { duration: 2000, fill: 'forwards' });
        }
    };

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
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="w-full relative overflow-hidden py-24 border-t border-white/5 bg-[#050505]"
        >
            {/* VITE SYTLE: Dynamic Multi-Color Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Base Dark/Blue Canvas */}
                <div className="absolute inset-0 bg-[#050505]"></div>

                {/* Blob 1: Intense Purple/Blue (Left Top) */}
                <div
                    ref={blob1Ref}
                    className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60"
                ></div>

                {/* Blob 2: Cyan/Teal (Right Bottom) */}
                <div
                    ref={blob2Ref}
                    className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50"
                ></div>

                {/* Blob 3: Central Gold Accent (Carmona Identity) */}
                <div
                    ref={blob3Ref}
                    className="absolute top-[20%] left-[30%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] mix-blend-screen opacity-40"
                ></div>

                {/* Noise Texture Overlay for "Premium" Feel */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Compact Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left relative">
                        {/* Glowing Title Effect */}
                        <div className="absolute -inset-4 bg-blue-500/10 blur-xl rounded-full opacity-50"></div>
                        <span className="relative inline-block text-[#4F94FF] font-bold uppercase tracking-[0.2em] text-[10px] mb-2 border-b border-[#4F94FF]/30 pb-1">
                            Exclusividad Garantizada
                        </span>
                        <h2 className="relative text-4xl md:text-5xl font-bold text-white italic tracking-tighter leading-none">
                            Colección <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8AB4F8] via-[#D4AF37] to-[#8AB4F8]">Vite</span>
                        </h2>
                    </div>

                    {/* Carousel Controls */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#4F94FF] text-white flex items-center justify-center transition-all duration-300 active:scale-95 group backdrop-blur-md"
                        >
                            <i className="fa-solid fa-chevron-left group-hover:text-[#4F94FF] transition-colors"></i>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#4F94FF] text-white flex items-center justify-center transition-all duration-300 active:scale-95 group backdrop-blur-md"
                        >
                            <i className="fa-solid fa-chevron-right group-hover:text-[#4F94FF] transition-colors"></i>
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x scrollbar-hide gap-6 pb-8 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {vehicles.map((auto) => (
                        <div key={auto.id} className="snap-center shrink-0 w-[85%] sm:w-[360px] bg-[#111111]/80 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/10 transition-all duration-500 group relative shadow-2xl flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(79,148,255,0.2)]">
                            {/* Hover Border Gradient */}
                            <div className="absolute inset-0 rounded-[24px] border border-transparent group-hover:border-[#4F94FF]/40 transition-colors pointer-events-none z-40"></div>

                            {/* Image Section */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Link href={`/auto/${auto.slug}`}>
                                    <div className="absolute top-4 left-4 z-30 pointer-events-none">
                                        <span className="bg-black/50 text-white text-[9px] font-bold px-3 py-1 rounded backdrop-blur-md border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-transparent to-transparent opacity-80"></div>
                                </Link>
                            </div>

                            {/* Content Section */}
                            <div className="px-6 pb-6 pt-3 relative flex-1 flex flex-col bg-transparent">
                                {/* Header: Brand & Actions */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[#4F94FF] font-bold text-[10px] tracking-[0.2em] uppercase text-shadow-glow">
                                        {auto.brand.name}
                                    </span>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(`https://wa.me/?text=Mira este ${auto.brand.name} en Carmona: https://automotrizcarmona.cl/auto/${auto.slug}`, '_blank');
                                            }}
                                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#25D366] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                                        >
                                            <i className="fa-brands fa-whatsapp text-xs"></i>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCopyLink(`https://automotrizcarmona.cl/auto/${auto.slug}`, auto.id);
                                            }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${copiedId === auto.id ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white hover:text-black'
                                                }`}
                                        >
                                            {copiedId === auto.id ? <i className="fa-solid fa-check text-xs"></i> : <i className="fa-solid fa-link text-xs"></i>}
                                        </button>
                                    </div>
                                </div>

                                {/* Model Name - Fixed Height & Padding for Perfect Fit */}
                                <Link href={`/auto/${auto.slug}`} className="block mb-4 group-hover:text-[#4F94FF] transition-colors relative">
                                    <h3
                                        className="text-xl leading-[1.2] font-bold text-white italic flex items-center h-[3.6rem] overflow-hidden"
                                        title={auto.model} // Tooltip for full name
                                    >
                                        <span className="line-clamp-2 w-full">
                                            {auto.model}
                                        </span>
                                    </h3>
                                </Link>

                                {/* Compact Info Grid - Slightly larger text for readability */}
                                <div className="flex items-center gap-2 mb-6 text-[11px] text-gray-400 border-t border-b border-white/5 py-3 justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-calendar text-[#4F94FF]"></i>
                                        <span className="font-medium text-gray-300">{auto.year}</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10"></div>
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-road text-[#4F94FF]"></i>
                                        <span className="font-medium text-gray-300">{auto.km_formatted.toUpperCase()}</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10"></div>
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-solid fa-gears text-[#4F94FF]"></i>
                                        <span className="truncate max-w-[60px] font-medium text-gray-300" title={auto.transmission}>
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
                                    <Link href={`/auto/${auto.slug}`} className="w-10 h-10 bg-white/5 hover:bg-[#4F94FF] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-black/50 border border-white/5">
                                        <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual Indicator of Scroll */}
                <div className="w-full flex justify-center mt-6 gap-1">
                    <div className="w-16 h-1 bg-[#4F94FF] rounded-full"></div>
                    <div className="w-2 h-1 bg-white/10 rounded-full"></div>
                    <div className="w-2 h-1 bg-white/10 rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
