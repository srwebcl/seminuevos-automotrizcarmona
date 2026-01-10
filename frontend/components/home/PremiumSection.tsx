'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPremiumVehicles } from '@/lib/api';
import { Vehicle } from '@/types/vehicle';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PremiumCard = ({ auto }: { auto: Vehicle }) => {
    return (
        <div className="snap-center shrink-0 w-[85%] sm:w-[320px] bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 group relative">
            <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute top-3 left-3 z-30 shadow-lg">
                    <span className="bg-[#D4AF37] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide shadow-md">
                        Elite
                    </span>
                </div>

                {auto.cover_photo ? (
                    <Image
                        src={auto.cover_photo}
                        alt={auto.model}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <i className="fa-solid fa-car text-gray-600 text-4xl"></i>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
            </div>

            <div className="p-6 relative">
                <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 pr-2">
                        <p className="text-[10px] font-bold text-premium-gold uppercase mb-1 tracking-widest flex items-center gap-2">
                            {auto.brand.name}
                        </p>
                        <h3 className="text-xl font-bold text-white truncate italic font-heading" title={auto.model}>
                            {auto.model}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-xs font-medium mb-5 border-t border-white/10 pt-3">
                    <span>{auto.year}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span>{Math.floor(auto.km / 1000)}K km</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                    <span>{auto.transmission?.substring(0, 3).toUpperCase() || 'AUT'}</span>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        {auto.is_offer && auto.price_offer_formatted ? (
                            <>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Oferta</span>
                                    <span className="text-[10px] text-gray-500 line-through decoration-red-500">{auto.price_formatted}</span>
                                </div>
                                <p className="text-xl font-black text-red-500 tracking-tight">{auto.price_offer_formatted}</p>
                            </>
                        ) : auto.price_financing_formatted ? (
                            <>
                                <p className="text-[9px] text-blue-400 font-bold uppercase mb-0.5 flex items-center gap-1">
                                    <i className="fa-solid fa-credit-card"></i> con Financiamiento
                                </p>
                                <p className="text-xl font-black text-blue-400 tracking-tight leading-none mb-0.5">{auto.price_financing_formatted}</p>
                                <p className="text-[9px] text-gray-500 font-medium">Contado: <span className="text-gray-300">{auto.price_formatted}</span></p>
                            </>
                        ) : (
                            <p className="text-xl font-black text-white tracking-tight">{auto.price_formatted}</p>
                        )}
                    </div>

                    <Link href={`/auto/${auto.slug}`} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-premium-gold hover:text-black transition-all duration-300 mb-1">
                        <i className="fa-solid fa-arrow-right text-sm"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function PremiumSection({ vehicles: initialVehicles }: { vehicles?: Vehicle[] }) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || []);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        AOS.init({ once: true });
        if (!initialVehicles) {
            getPremiumVehicles().then(res => setVehicles(res.data)).catch(console.error);
        }
    }, [initialVehicles]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 340;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (vehicles.length === 0) return null;

    return (
        <section id="premiumSection" className="w-full bg-white relative overflow-hidden py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6" data-aos="fade-up">
                    <div className="text-left max-w-2xl">
                        <span className="inline-block text-premium-gold font-bold uppercase tracking-[0.25em] text-xs mb-3 px-3 py-1 border border-premium-gold/30 rounded-full">
                            Exclusividad
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter leading-none">
                            Autos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b88c1c] to-[#996515]">Premium</span>
                        </h2>
                        <p className="text-gray-500 mt-4 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                            Una selección de vehículos de alta gama, verificados para entregar la máxima experiencia.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition duration-300">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition duration-300">
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x scrollbar-hide gap-6 pb-8 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0"
                >
                    {vehicles.map((auto) => (
                        <PremiumCard key={auto.id} auto={auto} />
                    ))}

                    {/* Ver Todos Card */}
                    <div className="snap-center shrink-0 w-[150px] flex items-center justify-center">
                        <Link href="/catalogo?is_premium=1" className="group flex flex-col items-center gap-3 text-gray-400 hover:text-black transition duration-300">
                            <div className="w-16 h-16 rounded-full border-2 border-gray-200 group-hover:border-black flex items-center justify-center transition duration-300">
                                <i className="fa-solid fa-arrow-right text-xl"></i>
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wider">Ver Todo</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
