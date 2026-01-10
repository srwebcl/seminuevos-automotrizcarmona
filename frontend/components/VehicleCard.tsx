'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';
import ShareButton from './ShareButton';
import { formatEngine } from '@/lib/utils';

// Helper to darken hex color
function adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {

    return (
        <div className={`group relative bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-xl 
            ${vehicle.is_premium ? 'border-2 border-premium-gold shadow-lg shadow-premium-gold/10' :
                vehicle.is_featured ? 'border-2 border-blue-600 shadow-lg shadow-blue-600/10' :
                    'border border-gray-100 shadow-sm'}`}>
            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden group/image">
                {/* Badges Container */}
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 items-start">

                    {vehicle.tags && vehicle.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="text-[10px] font-bold px-3 py-1 rounded shadow-md uppercase tracking-wide"
                            style={{
                                background: `linear-gradient(135deg, ${tag.bg_color}, ${adjustColor(tag.bg_color, -40)})`,
                                color: tag.text_color
                            }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>

                {vehicle.is_premium && (
                    <div className="absolute top-3 right-3 z-30">
                        <span className="bg-[#D4AF37] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <i className="fa-solid fa-crown"></i> Premium
                        </span>
                    </div>
                )}

                {vehicle.is_featured && !vehicle.is_premium && (
                    <div className="absolute top-3 right-3 z-30">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <i className="fa-solid fa-star"></i> Destacado
                        </span>
                    </div>
                )}

                <Link href={`/auto/${vehicle.slug}`} className="block w-full h-full relative">
                    {vehicle.cover_photo ? (
                        <Image
                            src={vehicle.cover_photo}
                            alt={`${vehicle.brand.name} ${vehicle.model}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <i className="fa-solid fa-image text-3xl"></i>
                        </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
            </div>

            <div className="p-5 flex flex-col flex-1 relative bg-white">
                <div className="mb-3 flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <Link href={`/auto/${vehicle.slug}`}>
                            {/* Brand + Model (Single Line) */}
                            <h3 className="text-gray-900 text-lg leading-tight uppercase mb-1 truncate">
                                <span className="font-extrabold mr-1.5">{vehicle.brand.name}</span>
                                <span className="font-bold text-gray-700">{vehicle.model}</span>
                            </h3>

                            {/* Specs Subtitle */}
                            <p className="text-xs text-gray-500 font-medium uppercase truncate mb-3">
                                {[
                                    formatEngine(vehicle.motor),
                                    vehicle.traction,
                                    vehicle.transmission === 'MECANICO' || vehicle.transmission === 'MECÁNICO' ? 'MEC' : (vehicle.transmission === 'AUTOMATICO' || vehicle.transmission === 'AUTOMÁTICO' ? 'AUT' : vehicle.transmission),
                                    vehicle.year
                                ].filter(Boolean).join(' • ')}
                            </p>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{vehicle.year}</span>
                    <span className="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{vehicle.km_formatted.replace('km', '')} km</span>
                    <span className="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{vehicle.transmission?.substring(0, 3)}</span>
                </div>

                <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-50">
                    <div className="flex flex-col">
                        {vehicle.price_offer_formatted ? (
                            (() => {
                                // Prioritize the first available dynamic tag for styling
                                const activeTag = vehicle.tags && vehicle.tags.length > 0 ? vehicle.tags[0] : null;

                                return (
                                    <>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {activeTag ? (
                                                <span
                                                    className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm"
                                                    style={{
                                                        backgroundColor: activeTag.bg_color,
                                                        color: activeTag.text_color
                                                    }}
                                                >
                                                    {activeTag.name}
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                                                    Oferta
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 line-through decoration-red-200 font-medium">{vehicle.price_formatted}</span>
                                        </div>
                                        <p
                                            className="text-xl font-black tracking-tight"
                                            style={{ color: activeTag ? activeTag.bg_color : '#dc2626' }}
                                        >
                                            {vehicle.price_offer_formatted}
                                        </p>
                                    </>
                                );
                            })()
                        ) : vehicle.price_financing_formatted ? (
                            <>
                                <p className="text-[9px] text-blue-600 font-bold uppercase mb-0.5 flex items-center gap-1">
                                    <i className="fa-solid fa-credit-card"></i> con Financiamiento
                                </p>
                                <p className="text-xl font-black text-blue-700 tracking-tight leading-none mb-0.5">{vehicle.price_financing_formatted}</p>
                                <p className="text-[9px] text-gray-400 font-medium">
                                    Contado: <span className="text-gray-600 font-bold">{vehicle.price_formatted}</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Precio Contado</p>
                                <p className="text-xl font-black text-gray-900 tracking-tight">{vehicle.price_formatted}</p>
                            </>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <div className="shrink-0">
                            <ShareButton
                                title={`${vehicle.brand.name} ${vehicle.model}`}
                                slug={vehicle.slug}
                                brand={vehicle.brand.name}
                                model={vehicle.model}
                                year={vehicle.year}
                                price={vehicle.price_offer_formatted || vehicle.price_financing_formatted || vehicle.price_formatted}
                                variant="stack"
                            />
                        </div>
                        <Link href={`/auto/${vehicle.slug}`} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                            <i className="fa-solid fa-arrow-right text-xs"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
