<x-app-layout>
    <div class="relative bg-black py-24 text-center text-white">
        <div class="absolute inset-0 overflow-hidden opacity-40">
            <img src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1920"
                class="w-full h-full object-cover">
        </div>
        <div class="relative z-10 max-w-7xl mx-auto px-4">
            <h1 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Nuestras Sucursales</h1>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">Visítanos en nuestros showrooms exclusivos en La Serena.
            </p>
        </div>
    </div>

    <div class="bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">

                <!-- Sucursal Seminuevos -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group">
                    <div class="h-64 bg-gray-200 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1080"
                            class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                        <div
                            class="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            Casa Matriz
                        </div>
                    </div>
                    <div class="p-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Seminuevos Carmona</h2>
                        <div class="flex items-start gap-4 mb-6">
                            <i class="fa-solid fa-location-dot text-black mt-1 text-xl"></i>
                            <div>
                                <p class="text-gray-900 font-bold">Avenida Balmaceda 3570</p>
                                <p class="text-gray-500 text-sm">La Serena, Coquimbo</p>
                            </div>
                        </div>

                        <div class="flex gap-3 mb-6">
                            <a href="https://maps.google.com/?q=Avenida+Balmaceda+3570,+La+Serena" target="_blank"
                                class="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center font-bold gap-2 hover:bg-gray-800 transition">
                                <i class="fa-solid fa-map-location-dot"></i> Ver Mapa
                            </a>
                            <a href="tel:+56912345678"
                                class="bg-gray-100 text-gray-900 px-4 rounded-xl flex items-center justify-center hover:bg-gray-200 transition">
                                <i class="fa-solid fa-phone"></i>
                            </a>
                        </div>

                        <div class="border-t border-gray-100 pt-6">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horario de
                                Atención</h3>
                            <p class="text-sm text-gray-600">Lunes a Viernes: 09:00 - 19:00 hrs</p>
                            <p class="text-sm text-gray-600">Sábado: 10:00 - 14:00 hrs</p>
                        </div>
                    </div>
                </div>

                <!-- Sucursal Premium -->
                <div
                    class="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 group ring-4 ring-premium-gold/10">
                    <div class="h-64 bg-gray-200 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1486401899868-0e4eb5ce9507?q=80&w=1080"
                            class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                        <div
                            class="absolute top-4 left-4 bg-premium-gold text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                            <i class="fa-solid fa-crown mr-1"></i> Premium
                        </div>
                    </div>
                    <div class="p-8 relative">
                        <div
                            class="absolute inset-0 bg-gradient-to-b from-premium-gold/5 to-transparent pointer-events-none">
                        </div>

                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Seminuevos Premium</h2>
                        <div class="flex items-start gap-4 mb-6">
                            <i class="fa-solid fa-location-dot text-premium-gold mt-1 text-xl"></i>
                            <div>
                                <p class="text-gray-900 font-bold">Avenida Balmaceda 3720</p>
                                <p class="text-gray-500 text-sm">La Serena, Coquimbo</p>
                            </div>
                        </div>

                        <div class="flex gap-3 mb-6">
                            <a href="https://maps.google.com/?q=Avenida+Balmaceda+3720,+La+Serena" target="_blank"
                                class="flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center font-bold gap-2 hover:bg-premium-gold hover:text-black transition shadow-lg hover:shadow-premium-gold/50">
                                <i class="fa-solid fa-map-location-dot"></i> Ver Mapa
                            </a>
                            <a href="tel:+56912345678"
                                class="bg-gray-100 text-gray-900 px-4 rounded-xl flex items-center justify-center hover:bg-gray-200 transition">
                                <i class="fa-solid fa-phone"></i>
                            </a>
                        </div>

                        <div class="border-t border-gray-100 pt-6">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Horario de
                                Atención</h3>
                            <p class="text-sm text-gray-600">Lunes a Viernes: 09:00 - 19:00 hrs</p>
                            <p class="text-sm text-gray-600">Sábado: 10:00 - 14:00 hrs</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>