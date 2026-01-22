'use client';

import ShareButton from './ShareButton';
import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';
import { formatEngine } from '@/lib/utils';

// Helper to darken hex color
function adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

interface VehicleListCardProps {
    vehicle: Vehicle;
}

export default function VehicleListCard({ vehicle }: VehicleListCardProps) {


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-row min-h-[145px] md:h-40 h-auto">
            {/* Image Section - Responsive Width */}
            <div className="w-[125px] xs:w-[135px] md:w-[280px] relative shrink-0 overflow-hidden">
                <Link href={`/auto/${vehicle.slug}`} className="block h-full w-full relative">
                    <Image
                        src={vehicle.cover_photo || '/images/placeholder-car.jpg'}
                        alt={`${vehicle.brand.name} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {vehicle.is_premium && (
                        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-black/90 backdrop-blur text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 z-10 border border-white/10">
                            <i className="fa-solid fa-crown text-[#D4AF37] md:text-[10px]"></i> Premium
                        </div>
                    )}

                    {/* Tags Container */}
                    <div className="absolute bottom-1.5 left-1.5 flex flex-wrap gap-1 z-10">
                        {vehicle.is_offer && (
                            <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
                                Oferta
                            </span>
                        )}
                        {vehicle.is_clearance && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">
                                Liquidación
                            </span>
                        )}
                        {vehicle.tags && vehicle.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-[8px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide"
                                style={{
                                    background: `linear-gradient(135deg, ${tag.bg_color}, ${adjustColor(tag.bg_color, -40)})`,
                                    color: tag.text_color
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </Link>
            </div>

            {/* Content Section - Adaptive Layout */}
            <div className="flex-1 p-2.5 md:p-0 min-w-0">

                {/* MOBILE LAYOUT (Stack) - Visible ONLY on Mobile */}
                <div className="md:hidden flex flex-col justify-between h-full">
                    <div>
                        <div className="mb-1">
                            <Link href={`/auto/${vehicle.slug}`}>
                                <h3 className="text-gray-900 text-base leading-tight uppercase mb-1 truncate">
                                    <span className="font-extrabold mr-1.5">{vehicle.brand.name}</span>
                                    <span className="font-bold text-gray-700">{vehicle.model}</span>
                                </h3>
                                <p className="text-[10px] text-gray-500 font-medium uppercase truncate">
                                    {[
                                        formatEngine(vehicle.motor),
                                        vehicle.traction,
                                        vehicle.transmission === 'MECANICO' || vehicle.transmission === 'MECÁNICO' ? 'MEC' : (vehicle.transmission === 'AUTOMATICO' || vehicle.transmission === 'AUTOMÁTICO' ? 'AUT' : vehicle.transmission),
                                        vehicle.year
                                    ].filter(Boolean).join(' • ')}
                                </p>
                            </Link>
                            <div className="mt-1">
                                {vehicle.is_offer && vehicle.price_offer_formatted ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="bg-red-100 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Oferta</span>
                                            <span className="text-[9px] text-gray-400 line-through decoration-red-200">{vehicle.price_formatted}</span>
                                        </div>
                                        <p className="text-lg font-black text-red-600 tracking-tight">{vehicle.price_offer_formatted}</p>
                                    </div>
                                ) : vehicle.price_financing_formatted ? (
                                    <div className="flex flex-col">
                                        <p className="text-[8px] text-blue-600 font-bold uppercase flex items-center gap-1">
                                            <i className="fa-solid fa-credit-card"></i> con Financiamiento
                                        </p>
                                        <p className="text-lg font-black text-blue-700 tracking-tight leading-none">{vehicle.price_financing_formatted}</p>
                                        <p className="text-[8px] text-gray-400 font-medium">Contado: <strong className="text-gray-600">{vehicle.price_formatted}</strong></p>
                                    </div>
                                ) : (
                                    <p className="text-lg font-black text-gray-900 tracking-tight">{vehicle.price_formatted}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 font-medium leading-none">
                            <span>{vehicle.year}</span>
                            <span className="text-gray-300">|</span>
                            <span>{vehicle.km_formatted}</span>
                            <span className="text-gray-300">|</span>
                            <span>{vehicle.transmission === 'Automática' ? 'Aut.' : 'Mec.'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                        <Link
                            href={`/auto/${vehicle.slug}`}
                            className="flex-1 h-9 bg-black text-white text-[10px] font-bold rounded-lg hover:bg-gray-800 transition text-center flex items-center justify-center"
                        >
                            Ver Detalles
                        </Link>
                        <div className="shrink-0">
                            <ShareButton
                                title={`${vehicle.brand.name} ${vehicle.model}`}
                                slug={vehicle.slug}
                                brand={vehicle.brand.name}
                                model={vehicle.model}
                                year={vehicle.year}
                                price={vehicle.price_offer_formatted || vehicle.price_financing_formatted || vehicle.price_formatted}
                            />
                        </div>
                    </div>
                </div>

                {/* DESKTOP LAYOUT (2-Column Grid) - Visible ONLY on Desktop */}
                <div className="hidden md:grid h-full grid-cols-12 gap-6 p-5 items-center">

                    {/* COL 1: Info & Specs (Merged) */}
                    <div className="col-span-7 flex flex-col justify-center border-r border-gray-100 pr-6">
                        <Link href={`/auto/${vehicle.slug}`} className="group-hover:text-premium-gold transition-colors block">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{vehicle.brand.name}</span>
                                    <h3 className="text-2xl font-black text-gray-900 leading-none truncate" title={vehicle.model}>{vehicle.model}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                        {vehicle.year}
                                    </span>
                                    {vehicle.is_unique_owner && (
                                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                            Único Dueño
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Horizontal Specs Row */}
                            <div className="flex items-center gap-6 text-sm font-medium text-gray-500 pt-3 border-t border-gray-50">
                                <div className="flex items-center gap-2" title="Kilometraje">
                                    <i className="fa-solid fa-gauge-high text-gray-300"></i>
                                    <span>{vehicle.km_formatted}</span>
                                </div>
                                <div className="flex items-center gap-2" title="Transmisión">
                                    <i className="fa-solid fa-gears text-gray-300"></i>
                                    <span className="capitalize">{vehicle.transmission?.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-2" title="Combustible">
                                    <i className="fa-solid fa-gas-pump text-gray-300"></i>
                                    <span className="capitalize">{vehicle.fuel?.toLowerCase() || 'N/A'}</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* COL 2: Price & Actions (Right Aligned) */}
                    <div className="col-span-5 flex flex-col justify-center items-end text-right pl-2">
                        <div className="mb-3">
                            {vehicle.is_offer && vehicle.price_offer_formatted ? (
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded uppercase">Oferta</span>
                                        <span className="text-xs text-gray-400 line-through">{vehicle.price_formatted}</span>
                                    </div>
                                    <p className="text-3xl font-black text-red-600 tracking-tight leading-none">{vehicle.price_offer_formatted}</p>
                                </div>
                            ) : vehicle.price_financing_formatted ? (
                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] text-blue-600 font-bold uppercase flex items-center gap-1 justify-end mb-1">
                                        <i className="fa-solid fa-credit-card"></i> Financiamiento
                                    </p>
                                    <p className="text-3xl font-black text-blue-700 tracking-tight leading-none mb-1">{vehicle.price_financing_formatted}</p>
                                    <p className="text-xs text-gray-400 font-medium">Contado: <strong className="text-gray-600">{vehicle.price_formatted}</strong></p>
                                </div>
                            ) : (
                                <p className="text-3xl font-black text-gray-900 tracking-tight leading-none">{vehicle.price_formatted}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full justify-end">
                            <ShareButton
                                title={`${vehicle.brand.name} ${vehicle.model}`}
                                slug={vehicle.slug}
                                brand={vehicle.brand.name}
                                model={vehicle.model}
                                year={vehicle.year}
                                price={vehicle.price_offer_formatted || vehicle.price_financing_formatted || vehicle.price_formatted}
                            />
                            <Link
                                href={`/auto/${vehicle.slug}`}
                                className="h-11 px-6 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center shadow-lg shadow-black/10 active:scale-95 group/btn"
                            >
                                Ver Detalle <i className="fa-solid fa-arrow-right ml-2 group-hover/btn:translate-x-1 transition-transform"></i>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
