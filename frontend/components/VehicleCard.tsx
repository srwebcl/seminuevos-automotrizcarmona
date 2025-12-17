import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    return (
        <Link href={`/auto/${vehicle.slug}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                {vehicle.cover_photo ? (
                    <Image
                        src={vehicle.cover_photo}
                        alt={`${vehicle.brand.name} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}

                {vehicle.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        DESTACADO
                    </div>
                )}
            </div>

            <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{vehicle.brand.name}</p>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {vehicle.model}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{vehicle.year} • {vehicle.km_formatted}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-900">{vehicle.price_formatted}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Ver más</span>
                </div>
            </div>
        </Link>
    );
}
