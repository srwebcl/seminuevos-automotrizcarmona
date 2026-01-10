{{-- CATALOG PAGE (WITH TOGGLE) --}}
{{-- Relies on Alpine x-data="{ view: 'grid' }" in parent --}}

{{-- A) GRID VIEW (3 COLUMNS) --}}
<div x-show="view === 'grid'" class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div class="col-span-3 text-center py-24">
            <h3 class="text-lg font-bold text-gray-900">No encontramos vehículos</h3>
            <p class="text-gray-500 text-sm mt-2">Intenta cambiar los filtros de búsqueda.</p>
        </div>
    @endforelse
</div>

{{-- B) LIST VIEW (Compact Row - Bruno Fritsch Style) --}}
<div x-show="view === 'list'" style="display: none;" class="flex flex-col gap-4 max-w-5xl mx-auto">
    @foreach($vehicles as $auto)
        <div
            class="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-premium-gold/50 transition-all duration-300 md:flex items-center p-3 gap-6 shadow-sm hover:shadow-md h-auto md:h-32">
            <div class="relative w-full md:w-40 h-40 md:h-full bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <a href="{{ route('vehicles.show', $auto->slug) }}" class="block w-full h-full">
                    <img src="{{ Storage::url($auto->thumbnail) }}" class="w-full h-full object-cover">
                </a>

                {{-- List View Badges --}}
                <div class="absolute top-1.5 left-1.5 z-30 flex gap-1">
                    @if($auto->is_premium)
                        <span class="bg-[#D4AF37] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase"><i
                                class="fa-solid fa-crown"></i></span>
                    @endif
                    @if($auto->is_offer)
                        <span class="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Oferta</span>
                    @endif
                    @if($auto->is_clearance)
                        <span class="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Liq.</span>
                    @endif
                </div>
            </div>

            <div class="flex-1 flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-0">
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{{ $auto->brand->name }}
                    </p>
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-black text-gray-900 leading-none">
                            <a href="{{ route('vehicles.show', $auto->slug) }}"
                                class="hover:text-premium-gold transition-colors">{{ $auto->model }}</a>
                        </h3>
                        {{-- List View Share Buttons --}}
                        <div class="flex gap-1">
                            <a href="https://wa.me/?text={{ urlencode('Hola, me interesa este auto: ' . route('vehicles.show', $auto->slug)) }}"
                                target="_blank"
                                class="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                                title="Compartir en WhatsApp">
                                <i class="fa-brands fa-whatsapp text-[10px]"></i>
                            </a>
                            <button onclick="copyLink('{{ route('vehicles.show', $auto->slug) }}', this)"
                                class="w-6 h-6 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                title="Copiar Enlace">
                                <i class="fa-solid fa-link text-[9px]"></i>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center text-xs text-gray-500 font-medium">
                        <span class="px-2 border-r border-gray-300 first:pl-0">{{ $auto->year }}</span>
                        <span class="px-2 border-r border-gray-300">{{ number_format($auto->km, 0, ',', '.') }} km</span>
                        <span class="px-2 border-r border-gray-300">{{ $auto->transmission }}</span>
                        <span class="px-2 last:pr-0">{{ $auto->fuel }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-6">
                    <div class="text-right">
                        <p class="text-xl font-black text-gray-900 tracking-tight">
                            ${{ number_format($auto->price, 0, ',', '.') }}</p>
                        @if($auto->is_offer)
                            <p class="text-[10px] text-red-500 font-bold">Oportunidad</p>
                        @endif
                    </div>
                    <a href="{{ route('vehicles.show', $auto->slug) }}"
                        class="w-8 h-8 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </a>
                </div>
            </div>
        </div>
    @endforeach
</div>