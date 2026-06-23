import { Metadata } from 'next';
import Image from 'next/image';
import { getClearanceData, BACKEND_URL } from '@/lib/api';
import VehicleCard from '@/components/VehicleCard';

export const metadata: Metadata = {
    title: 'Liquidación Seminuevos | Automotriz Carmona',
    description: 'Aprovecha nuestras ofertas exclusivas en vehículos seminuevos seleccionados en liquidación.',
};

export const dynamic = 'force-dynamic';

export default async function ClearancePage() {
    const data = await getClearanceData().catch(() => null);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h1>
                <p className="text-gray-600 mb-4">No pudimos cargar la liquidación.</p>
                <a href="/" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                    Volver al Inicio
                </a>
            </div>
        );
    }

    const { settings, vehicles } = data;
    
    // Construct valid image URLs
    const desktopHeroUrl = settings.hero_desktop ? `${BACKEND_URL}/storage/${settings.hero_desktop}` : null;
    const mobileHeroUrl = settings.hero_mobile ? `${BACKEND_URL}/storage/${settings.hero_mobile}` : desktopHeroUrl;

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* 1. Hero Banner */}
            <div className="w-full relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                {desktopHeroUrl ? (
                    <>
                        {/* Mobile Banner */}
                        <div className="block md:hidden w-full h-[400px] relative">
                            <Image 
                                src={mobileHeroUrl as string} 
                                alt="Liquidación Automotriz Carmona" 
                                fill 
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Desktop Banner */}
                        <div className="hidden md:block w-full h-[500px] lg:h-[600px] relative">
                            <Image 
                                src={desktopHeroUrl as string} 
                                alt="Liquidación Automotriz Carmona" 
                                fill 
                                className="object-cover"
                                priority
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
                            Gran <span className="text-red-600">Liquidación</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl">
                            Las mejores oportunidades en vehículos seleccionados.
                        </p>
                    </div>
                )}
            </div>

            {/* 2. Grid de Vehículos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                        Vehículos en <span className="text-red-600">Liquidación</span>
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Mostrando {vehicles.length} vehículos disponibles
                    </p>
                </div>

                {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <i className="fa-solid fa-car-side text-4xl text-gray-300 mb-3"></i>
                        <h3 className="text-xl font-bold text-gray-600">No hay vehículos en liquidación</h3>
                        <p className="text-gray-400">Vuelve a revisar más tarde.</p>
                    </div>
                )}
            </div>

            {/* 3. Términos y Condiciones Legales */}
            {settings.legal_text && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 border-b pb-2">
                            Términos y Condiciones
                        </h3>
                        <div 
                            className="prose prose-sm md:prose-base prose-gray max-w-none prose-p:text-gray-600 prose-a:text-red-600 prose-a:font-bold prose-headings:text-gray-800"
                            dangerouslySetInnerHTML={{ __html: settings.legal_text }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
