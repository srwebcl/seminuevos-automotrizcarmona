import { getVehicles } from '@/lib/api';
import VehicleCard from '@/components/VehicleCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const currentPage = Number(searchParams.page) || 1;
    const { data: vehicles, meta, links } = await getVehicles(currentPage);

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Catálogo Completo</h1>
                    <p className="text-gray-500 mt-2">
                        Mostrando {vehicles.length} de {meta.total} vehículos
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2">
                    {links.prev && (
                        <Link
                            href={`/catalogo?page=${currentPage - 1}`}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Anterior
                        </Link>
                    )}

                    <span className="px-4 py-2 text-gray-500">
                        Página {currentPage} de {meta.last_page}
                    </span>

                    {links.next && (
                        <Link
                            href={`/catalogo?page=${currentPage + 1}`}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Siguiente
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
