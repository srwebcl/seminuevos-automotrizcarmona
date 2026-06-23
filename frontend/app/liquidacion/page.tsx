import { Metadata } from 'next';
import Image from 'next/image';
import { getClearanceData, BACKEND_URL } from '@/lib/api';
import ClearanceGrid from '@/components/ClearanceGrid';

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
        <div className="bg-gray-50 min-h-screen pt-20 pb-16">
            {/* 1. Hero Banner */}
            <div className="w-full bg-black flex items-center justify-center">
                {desktopHeroUrl ? (
                    <div className="w-full">
                        {/* Mobile Banner */}
                        <div className="block md:hidden w-full">
                            <Image 
                                src={mobileHeroUrl as string} 
                                alt="Liquidación Automotriz Carmona" 
                                width={800}
                                height={1000}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                                priority
                            />
                        </div>
                        {/* Desktop Banner */}
                        <div className="hidden md:block w-full">
                            <Image 
                                src={desktopHeroUrl as string} 
                                alt="Liquidación Automotriz Carmona" 
                                width={1920}
                                height={600}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                                priority
                            />
                        </div>
                    </div>
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

            {/* 2. Grid Interactivo de Vehículos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <ClearanceGrid initialVehicles={vehicles} />
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
