{{-- HOME GRID (NO TOGGLE, 4 COLUMNS, CLEAN) --}}
<div class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    @forelse($vehicles as $auto)
        <div
            class="group relative bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-xl {{ $auto->is_premium ? 'border border-premium-gold/60 shadow-lg' : 'border border-gray-100 shadow-sm' }}">
            <div class="relative aspect-[16/10] bg-gray-100 overflow-hidden group/image">
                {{-- Badges Container --}}
                <div class="absolute top-3 left-3 z-30 flex flex-col gap-1 items-start">
                    @if($auto->is_offer)
                        <span
                            class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">Oferta</span>
                    @endif
                    @if($auto->is_clearance)
                        <span
                            class="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">Liquidación</span>
                    @endif
                </div>

                @if($auto->is_premium)
                    <div class="absolute top-3 right-3 z-30"><span
                            class="bg-[#D4AF37] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 shadow-sm"><i
                                class="fa-solid fa-crown"></i> Premium</span></div>
                @endif

                <a href="{{ route('vehicles.show', $auto->slug) }}" class="block w-full h-full">
                    <img src="{{ Storage::url($auto->thumbnail) }}"
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                </a>
            </div>
            <div class="p-5 flex flex-col flex-1 relative bg-white">
                <div class="mb-3 flex justify-between items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                            {{ $auto->brand->name }}</p>
                        <h3 class="text-lg font-extrabold text-gray-900 leading-tight truncate" title="{{ $auto->model }}">
                            {{ $auto->model }}</h3>
                    </div>
                    {{-- Share Actions --}}
                    <div class="flex gap-1 shrink-0">
                        <a href="https://wa.me/?text={{ urlencode('Hola, me interesa este auto: ' . route('vehicles.show', $auto->slug)) }}"
                            target="_blank"
                            class="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                            title="Compartir en WhatsApp">
                            <i class="fa-brands fa-whatsapp text-sm"></i>
                        </a>
                        <button onclick="copyLink('{{ route('vehicles.show', $auto->slug) }}', this)"
                            class="w-7 h-7 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                            title="Copiar Enlace">
                            <i class="fa-solid fa-link text-xs"></i>
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span
                        class="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{{ $auto->year }}</span>
                    <span
                        class="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{{ number_format($auto->km, 0, ',', '.') }}
                        km</span>
                    <span
                        class="px-2 py-1 bg-gray-50 rounded text-[10px] font-semibold text-gray-500">{{ $auto->transmission }}</span>
                </div>
                <div class="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                        <p class="text-[9px] text-gray-400 font-bold uppercase">Precio</p>
                        <p class="text-xl font-black text-gray-900">${{ number_format($auto->price, 0, ',', '.') }}</p>
                    </div>
                    <a href="{{ route('vehicles.show', $auto->slug) }}"
                        class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-premium-gold transition-colors">
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </a>
                </div>
            </div>
        </div>
    @empty
        <div class="col-span-4 text-center py-24">
            <h3 class="text-lg font-bold text-gray-900">No encontramos vehículos</h3>
            <p class="text-gray-500 text-sm mt-2">Intenta cambiar los filtros de búsqueda.</p>
        </div>
    @endforelse
</div>