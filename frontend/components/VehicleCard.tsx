import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {

    // Helper for badges - these would come from the API in a real implementation
    // For now we assume false or derive from props if available
    const isOffer = false;
    const isClearance = false;

    return (
        <div className={`group relative bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-xl ${vehicle.is_premium ? 'border border-premium-gold/60 shadow-lg' : 'border border-gray-100 shadow-sm'}`}>
            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden group/image">
                {/* Badges Container */}
                <div className="absolute top-3 left-3 z-30 flex flex-col gap-1 items-start">
                    {/* Placeholder for Offer/Clearance flags if added to API */}
                </div>

                {vehicle.is_premium && (
                    <div className="absolute top-3 right-3 z-30">
                        <span className="bg-[#D4AF37] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm">
                            <i className="fa-solid fa-crown"></i> Premium
                        </span>
                    </div>
                )}

                <Link href={`/auto/${vehicle.slug}`} className="block w-full h-full relative">
                    {vehicle.cover_photo ? (
                        <Image
                            src={vehicle.cover_photo}
                            alt={vehicle.model}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <i className="fa-solid fa-image text-3xl"></i>
                        </div>
                    )}
                </Link>
            </div>

            <div className="p-5 flex flex-col flex-1 relative bg-white">
                <div className="mb-3 flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                            {vehicle.brand?.name || 'Marca'}
                        </p>
                        <h3 className="text-lg font-extrabold text-gray-900 leading-tight truncate" title={vehicle.model}>
                            {vehicle.model}
                        </h3>
                    </div>
                    {/* Share Actions */}
                    <div className="flex gap-1 shrink-0">
                        <a href={`https://wa.me/?text=${encodeURIComponent('Hola, me interesa este auto: ' + vehicle.slug)}`}
                            target="_blank"
                            className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                            title="Compartir en WhatsApp">
                            <i className="fa-brands fa-whatsapp text-sm"></i>
                        </a>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{vehicle.year}</span>
                    <span className="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{vehicle.km_formatted.replace('km', '')} km</span>
                    <span className="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{vehicle.transmission?.substring(0, 3)}</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Precio</p>
                        <p className="text-xl font-black text-gray-900">{vehicle.price_formatted}</p>
                    </div>
                    <Link href={`/auto/${vehicle.slug}`} className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-premium-gold transition-colors">
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}
