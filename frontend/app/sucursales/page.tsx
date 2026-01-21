import { getLocations, BACKEND_URL } from '@/lib/api';
import CategoryHero from '@/components/CategoryHero';
import Image from 'next/image';

export const metadata = {
    title: 'Nuestras Sucursales | Automotriz Carmona',
    description: 'Visítanos en nuestros showrooms exclusivos en La Serena. Seminuevos y Premium.',
};

export const dynamic = 'force-dynamic';

export default async function LocationsPage() {
    const { data: locations } = await getLocations().catch(() => ({ data: [] }));

    return (
        <main>
            <CategoryHero
                title="Nuestras Sucursales"
                subtitle="Encuentra tu Carmona más cercano"
                backgroundImage="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1920"
            />

            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {locations.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No hay sucursales disponibles por el momento.</p>
                        </div>
                    ) : (
                        <div className={locations.length % 2 === 0 ? "grid grid-cols-1 md:grid-cols-2 gap-10" : "grid grid-cols-1 md:grid-cols-3 gap-10"}>
                            {locations.map((location) => (
                                <div key={location.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group flex flex-col">
                                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                                        {location.image_path ? (
                                            <Image
                                                src={`${BACKEND_URL}/storage/${location.image_path}`}
                                                alt={location.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition duration-700"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                <i className="fa-solid fa-building text-4xl"></i>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                                            {location.city}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{location.name}</h2>
                                        <div className="flex items-start gap-4 mb-6">
                                            <i className="fa-solid fa-location-dot text-black mt-1 text-xl"></i>
                                            <div>
                                                <p className="text-gray-900 font-bold">{location.address}</p>
                                                <p className="text-gray-500 text-sm">{location.city}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex gap-3 mb-6">
                                            <a
                                                href={location.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(`${location.address}, ${location.city}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center font-bold gap-2 hover:bg-gray-800 transition shadow-lg shadow-black/10"
                                            >
                                                <i className="fa-solid fa-map-location-dot"></i> Ver Mapa
                                            </a>
                                            {location.phone && (
                                                <a href={`tel:${location.phone}`} className="bg-gray-100 text-gray-900 px-4 rounded-xl flex items-center justify-center hover:bg-gray-200 transition">
                                                    <i className="fa-solid fa-phone"></i>
                                                </a>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-100 pt-6">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horario de Atención</h3>
                                            <p className="text-sm text-gray-600 whitespace-pre-line">{location.schedule || 'Lunes a Viernes: 09:00 - 19:00 hrs\nSábado: 10:00 - 14:00 hrs'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
