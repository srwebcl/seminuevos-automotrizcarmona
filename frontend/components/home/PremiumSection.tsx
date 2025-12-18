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
            {/* Improved Luminous Effects */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-black/40 to-black pointer-events-none z-0"></div>

            {/* Dynamic Glow */}
            <div
                ref={glowRef}
                className="absolute top-0 left-0 w-[600px] h-[300px] bg-premium-gold/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-0 transition-transform duration-100 ease-out"
                style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '0' }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    {/* Fixed Visibility for Label */}
                    <span className="inline-block text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-4 border border-[#D4AF37]/50 px-6 py-2 rounded-full bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        Exclusividad Garantizada
                    </span>

                    <h2 className="text-5xl md:text-7xl font-bold text-white italic tracking-tighter mb-6 drop-shadow-2xl leading-tight py-2">
                        Autos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F1D8] via-[#D4AF37] to-[#F9F1D8] inline-block pr-2">Premium</span>
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        Una selección curada de vehículos de alta gama, verificados y listos para entregar la máxima experiencia de conducción.
                    </p>
                </div>

                <div className="flex overflow-x-auto snap-x scrollbar-hide gap-8 pb-12 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0 pt-8">
                    {vehicles.map((auto) => (
                        <div key={auto.id} className="snap-center shrink-0 w-[85%] sm:w-[380px] bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 transition-all duration-500 group relative shadow-2xl flex flex-col hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]/50 hover:-translate-y-2">
                            {/* Image Section */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Link href={`/auto/${auto.slug}`}>
                                    <div className="absolute top-6 left-6 z-30 pointer-events-none">
                                        <span className="bg-[#b8860b] text-white text-[10px] font-bold px-4 py-1.5 rounded uppercase flex items-center gap-2 tracking-widest shadow-lg backdrop-blur-md bg-opacity-90">
                                            <i className="fa-solid fa-crown text-[9px]"></i> ELITE
                                        </span>
                                    </div>
                                    {auto.cover_photo && (
                                        <Image
                                            src={auto.cover_photo}
                                            alt={auto.model}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 unoptimized={true}"
                                        />
                                    )}
                                    {/* Shine Effect Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/0 group-hover:via-white/10 transition-all duration-700 ease-in-out z-20"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-90"></div>
                                </Link>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 pb-8 pt-4 relative flex-1 flex flex-col">
                                {/* Header: Brand & Actions */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#D4AF37] font-bold text-xs tracking-[0.2em] uppercase glow-text">
                                            {auto.brand.name}
                                        </span>
                                        <div className="h-[1px] w-8 bg-[#D4AF37]/50"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(`https://wa.me/?text=Mira este ${auto.brand.name} ${auto.model} en Carmona: https://automotrizcarmona.cl/auto/${auto.slug}`, '_blank');
                                            }}
                                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#25D366] hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300 border border-white/5 hover:border-[#25D366] hover:scale-110"
                                            title="Compartir en WhatsApp"
                                        >
                                            <i className="fa-brands fa-whatsapp text-sm"></i>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: `${auto.brand.name} ${auto.model}`,
                                                        text: 'Mira este auto increíble en Automotriz Carmona',
                                                        url: `https://automotrizcarmona.cl/auto/${auto.slug}`,
                                                    }).catch(console.error);
                                                } else {
                                                    navigator.clipboard.writeText(`https://automotrizcarmona.cl/auto/${auto.slug}`);
                                                    alert('¡Enlace copiado al portapapeles!');
                                                }
                                            }}
                                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white hover:text-black flex items-center justify-center text-gray-400 transition-all duration-300 border border-white/5 hover:border-white hover:scale-110"
                                            title="Copiar Enlace"
                                        >
                                            <i className="fa-solid fa-link text-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Model Name - Constrained Height */}
                                <Link href={`/auto/${auto.slug}`} className="block mb-6 group-hover:text-white/90 transition-colors">
                                    <h3 className="text-[24px] leading-[1.1] font-bold text-white italic line-clamp-2 h-[52px] flex items-center">
                                        {auto.model}
                                    </h3>
                                </Link>

                                {/* Info Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <div className="bg-[#151515] rounded-xl py-3 border border-white/5 flex flex-col items-center justify-center group-hover:bg-[#222] transition-colors group-hover:border-[#D4AF37]/20">
                                        <p className="text-[9px] text-[#888] uppercase font-bold tracking-wider mb-0.5">AÑO</p>
                                        <p className="text-sm text-gray-200 font-bold">{auto.year}</p>
                                    </div>
                                    <div className="bg-[#151515] rounded-xl py-3 border border-white/5 flex flex-col items-center justify-center group-hover:bg-[#222] transition-colors group-hover:border-[#D4AF37]/20">
                                        <p className="text-[9px] text-[#888] uppercase font-bold tracking-wider mb-0.5">KMS</p>
                                        <p className="text-sm text-gray-200 font-bold">{auto.km_formatted.replace(' km', '')}</p>
                                    </div>
                                    <div className="bg-[#151515] rounded-xl py-3 border border-white/5 flex flex-col items-center justify-center group-hover:bg-[#222] transition-colors group-hover:border-[#D4AF37]/20">
                                        <p className="text-[9px] text-[#888] uppercase font-bold tracking-wider mb-0.5">TRANS.</p>
                                        <p className="text-sm text-gray-200 font-bold truncate px-1 w-full text-center">
                                            {auto.transmission === 'AUTOMATICA' ? 'Aut' : 'Mec'}
                                        </p>
                                    </div>
                                </div>

                                {/* Division Line */}
                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

                                {/* Footer: Price & CTA */}
                                <div className="mt-auto flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-[#666] font-bold uppercase tracking-wider mb-1">Precio Contado</p>
                                        <p className="text-2xl font-bold text-white tracking-tight">{auto.price_formatted}</p>
                                    </div>
                                    <Link href={`/auto/${auto.slug}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0 group-hover:bg-[#D4AF37] group-hover:text-black group-hover:scale-110 group-hover:rotate-[-45deg] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                                        <i className="fa-solid fa-arrow-right text-black text-lg group-hover:text-black transition-transform duration-300"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center relative z-20">
                    <Link href="/catalogo?is_premium=1" className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black font-bold uppercase tracking-[0.15em] text-sm rounded-full hover:scale-105 transition duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                        Ver Colección Completa
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}
