'use client';

import { useEffect, useState, useRef, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPremiumVehicles } from '@/lib/api';
import { Vehicle } from '@/types/vehicle';

export default function PremiumSection({ vehicles: initialVehicles }: { vehicles?: Vehicle[] }) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || []);
    const glowRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

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
        if (!glowRef.current || !sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Move the glow to cursor position (centering the glow)
        // Offset logic from legacy: x - 300, y - 150 (half of w-600 h-300)
        glowRef.current.style.transform = `translate(${x - 300}px, ${y - 150}px)`;
    };

    const handleMouseLeave = () => {
        if (!glowRef.current) return;
        glowRef.current.style.transition = 'transform 1s ease-out';
        glowRef.current.style.transform = 'translate(-50%, -50%)'; // Reset center
        setTimeout(() => {
            if (glowRef.current) glowRef.current.style.transition = 'transform 0.1s ease-out';
        }, 1000);
    };

    if (vehicles.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full bg-[#050505] relative overflow-hidden py-24 border-t border-white/5"
        >
            {/* Luminous Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-black/0 to-transparent pointer-events-none z-0"></div>

            {/* Dynamic Glow */}
            <div
                ref={glowRef}
                className="absolute top-0 left-0 w-[600px] h-[300px] bg-premium-gold/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none z-0 animate-pulse transition-transform duration-100 ease-out"
                style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '0' }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="inline-block text-premium-gold font-bold uppercase tracking-[0.25em] text-xs mb-4 border border-premium-gold/30 px-5 py-1.5 rounded-full bg-premium-gold/5 backdrop-blur-md">
                        Exclusividad Garantizada
                    </span>

                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 drop-shadow-2xl leading-tight py-2">
                        Autos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F1D8] via-[#D4AF37] to-[#F9F1D8] inline-block pr-2">Premium</span>
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        Una selección curada de vehículos de alta gama, verificados y listos para entregar la máxima experiencia de conducción.
                    </p>
                </div>

                <div className="flex overflow-x-auto snap-x scrollbar-hide gap-8 pb-12 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                    {vehicles.map((auto) => (
                        <div key={auto.id} className="snap-center shrink-0 w-[85%] sm:w-[380px] bg-neutral-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-premium-gold/70 transition duration-500 group relative shadow-2xl">
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div className="absolute top-4 left-4 z-30 shadow-lg">
                                    <span className="bg-gradient-to-tr from-[#D4AF37] to-[#8a6e15] text-white text-[10px] font-black px-3 py-1.5 rounded uppercase flex items-center gap-1.5 shadow-md tracking-wider">
                                        <i className="fa-solid fa-crown text-yellow-100"></i> Elite
                                    </span>
                                </div>
                                {auto.cover_photo && (
                                    <Image
                                        src={auto.cover_photo}
                                        alt={auto.model}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            </div>

                            <div className="p-7 relative">
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-premium-gold uppercase mb-1.5 tracking-widest flex items-center gap-2">
                                        {auto.brand.name}
                                    </p>
                                    <h3 className="text-2xl font-black text-white truncate italic font-heading">{auto.model}</h3>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    <div className="text-center bg-white/5 rounded-lg py-2 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Año</p>
                                        <p className="text-xs text-gray-200 font-bold">{auto.year}</p>
                                    </div>
                                    <div className="text-center bg-white/5 rounded-lg py-2 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Kms</p>
                                        <p className="text-xs text-gray-200 font-bold">{auto.km_formatted.replace('km', '')}</p>
                                    </div>
                                    <div className="text-center bg-white/5 rounded-lg py-2 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Precio</p>
                                        <p className="text-xs text-gray-200 font-bold">{auto.price_formatted}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-5 border-t border-white/10">
                                    <Link href={`/auto/${auto.slug}`} className="w-full text-center py-3 bg-white text-black font-bold rounded-full hover:bg-premium-gold transition-colors">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center relative z-20">
                    <Link href="/catalogo?is_premium=1" className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black font-black uppercase tracking-[0.15em] text-sm rounded-full hover:scale-105 transition duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                        Ver Colección Completa
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}
