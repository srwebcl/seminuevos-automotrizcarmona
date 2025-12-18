import Image from 'next/image';

export const metadata = {
    title: 'Nuestras Sucursales | Automotriz Carmona',
    description: 'Visítanos en nuestros showrooms exclusivos en La Serena. Seminuevos y Premium.',
};

export default function LocationsPage() {
    return (
        <main>
            <div className="relative bg-black py-24 text-center text-white">
                <div className="absolute inset-0 overflow-hidden opacity-40">
                    <Image
                        src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1920"
                        alt="Background Sucursales"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Nuestras Sucursales</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">Visítanos en nuestros showrooms exclusivos en La Serena.</p>
                </div>
            </div>

            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Sucursal Seminuevos */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1080"
                                    alt="Sucursal Seminuevos"
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Casa Matriz
                                </div>
                            </div>
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seminuevos Carmona</h2>
                                <div className="flex items-start gap-4 mb-6">
                                    <i className="fa-solid fa-location-dot text-black mt-1 text-xl"></i>
                                    <div>
                                        <p className="text-gray-900 font-bold">Avenida Balmaceda 3570</p>
                                        <p className="text-gray-500 text-sm">La Serena, Coquimbo</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-6">
                                    <a href="https://maps.google.com/?q=Avenida+Balmaceda+3570,+La+Serena" target="_blank" className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center font-bold gap-2 hover:bg-gray-800 transition">
                                        <i className="fa-solid fa-map-location-dot"></i> Ver Mapa
                                    </a>
                                    <a href="tel:+56912345678" className="bg-gray-100 text-gray-900 px-4 rounded-xl flex items-center justify-center hover:bg-gray-200 transition">
                                        <i className="fa-solid fa-phone"></i>
                                    </a>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horario de Atención</h3>
                                    <p className="text-sm text-gray-600">Lunes a Viernes: 09:00 - 19:00 hrs</p>
                                    <p className="text-sm text-gray-600">Sábado: 10:00 - 14:00 hrs</p>
                                </div>
                            </div>
                        </div>

                        {/* Sucursal Premium */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group ring-4 ring-premium-gold/10">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1486401899868-0e4eb5ce9507?q=80&w=1080"
                                    alt="Sucursal Premium"
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-premium-gold text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                                    <i className="fa-solid fa-crown mr-1"></i> Premium
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-premium-gold/5 to-transparent pointer-events-none"></div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seminuevos Premium</h2>
                                <div className="flex items-start gap-4 mb-6">
                                    <i className="fa-solid fa-location-dot text-premium-gold mt-1 text-xl"></i>
                                    <div>
                                        <p className="text-gray-900 font-bold">Avenida Balmaceda 3720</p>
                                        <p className="text-gray-500 text-sm">La Serena, Coquimbo</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-6">
                                    <a href="https://maps.google.com/?q=Avenida+Balmaceda+3720,+La+Serena" target="_blank" className="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center font-bold gap-2 hover:bg-premium-gold hover:text-black transition shadow-lg hover:shadow-premium-gold/50">
                                        <i className="fa-solid fa-map-location-dot"></i> Ver Mapa
                                    </a>
                                    <a href="tel:+56912345678" className="bg-gray-100 text-gray-900 px-4 rounded-xl flex items-center justify-center hover:bg-gray-200 transition">
                                        <i className="fa-solid fa-phone"></i>
                                    </a>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horario de Atención</h3>
                                    <p className="text-sm text-gray-600">Lunes a Viernes: 09:00 - 19:00 hrs</p>
                                    <p className="text-sm text-gray-600">Sábado: 10:00 - 14:00 hrs</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
