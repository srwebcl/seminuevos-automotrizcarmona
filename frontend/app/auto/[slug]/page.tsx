import { getVehicleBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { data: vehicle } = await getVehicleBySlug(slug);

    return (
        <div className="py-12 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-6 text-gray-500">
                    <Link href="/" className="hover:text-blue-600">Inicio</Link>
                    <span className="mx-2">/</span>
                    <Link href="/catalogo" className="hover:text-blue-600">Catálogo</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{vehicle.brand.name} {vehicle.model}</span>
                </nav>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    {/* Gallery */}
                    <div className="mb-8 lg:mb-0">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                            {vehicle.cover_photo ? (
                                <Image
                                    src={vehicle.cover_photo}
                                    alt={vehicle.model}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">Sin Imagen</div>
                            )}
                        </div>

                        {/* Thumbnails grid (simple implementation) */}
                        {vehicle.photos.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {vehicle.photos.slice(1, 5).map((photo, index) => (
                                    <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={photo}
                                            alt={`Foto ${index + 2}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <span className="text-blue-600 font-bold tracking-wide uppercase text-sm">
                            {vehicle.condition === 'new' ? 'Nuevo' : 'Seminuevo'}
                        </span>
                        <h1 className="text-3xl font-black text-gray-900 mt-2 mb-4">
                            {vehicle.brand.name} {vehicle.model}
                        </h1>

                        <p className="text-4xl font-black text-blue-900 mb-6">
                            {vehicle.price_formatted}
                        </p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Ficha Técnica</h3>
                            <dl className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <dt className="text-sm text-gray-500">Año</dt>
                                    <dd className="font-medium">{vehicle.year}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Kilometraje</dt>
                                    <dd className="font-medium">{vehicle.km_formatted}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Transmisión</dt>
                                    <dd className="font-medium">{vehicle.transmission || 'No especificado'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Combustible</dt>
                                    <dd className="font-medium">{vehicle.fuel || 'No especificado'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Motor</dt>
                                    <dd className="font-medium">{vehicle.motor || 'No especificado'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Color</dt>
                                    <dd className="font-medium">{vehicle.color || 'No especificado'}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="prose prose-blue text-gray-600 mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Descripción</h3>
                            <p>{vehicle.description || 'Sin descripción disponible.'}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition shadow-lg text-center">
                                Cotizar por WhatsApp
                            </button>
                            <button className="flex-1 bg-white border-2 border-gray-200 text-gray-900 font-bold py-4 px-8 rounded-full hover:border-blue-600 hover:text-blue-600 transition text-center">
                                Solicitar Crédito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
