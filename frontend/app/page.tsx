import Link from 'next/link';
import { getFeaturedVehicles } from '@/lib/api';
import VehicleCard from '@/components/VehicleCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: featuredVehicles } = await getFeaturedVehicles();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Encuentra tu próximo <span className="text-blue-400">Seminuevo</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Calidad garantizada, financiamiento flexible y la mejor atención de Santiago.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/catalogo"
              className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg"
            >
              Ver Catálogo
            </Link>
            <a
              href="#"
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Vehículos Destacados</h2>
              <p className="text-gray-500 mt-2">Nuestra selección premium de la semana</p>
            </div>
            <Link href="/catalogo" className="text-blue-600 font-bold hover:text-blue-800 hidden sm:block">
              Ver todos &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/catalogo" className="text-blue-600 font-bold hover:text-blue-800">
              Ver todos los vehículos &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
