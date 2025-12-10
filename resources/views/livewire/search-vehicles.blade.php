<div class="relative w-full z-50">
    <div class="relative flex items-center w-full">
        <i class="fa-solid fa-magnifying-glass absolute left-6 text-gray-400 z-10"></i>
        <input type="text" wire:model.live.debounce.300ms="query"
            placeholder="Busca por marca, modelo o tipo... (Ej: Camionetas)"
            class="w-full h-14 pl-14 pr-16 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-gold/50 focus:bg-white transition-all text-base shadow-xl z-0"
            autocomplete="off">
        <div wire:loading class="absolute right-4">
            <i class="fa-solid fa-circle-notch fa-spin text-premium-gold"></i>
        </div>
    </div>

    @if(count($matchedCategories) > 0 || count($results) > 0)
        <div
            class="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl mt-3 overflow-hidden z-50 border border-gray-100 ring-1 ring-black/5">

            {{-- Categories Section --}}
            @if(count($matchedCategories) > 0)
                <div class="bg-gray-50 border-b border-gray-100 p-2">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1">Categorías</p>
                    @foreach($matchedCategories as $cat)
                        <a href="{{ route('vehicles.index', ['category_id' => $cat->id]) }}"
                            class="flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-900 hover:bg-white hover:text-premium-gold rounded-lg transition-colors group">
                            <span>Ver todos los <span class="capitalize">{{ strtolower($cat->name) }}</span></span>
                            <i class="fa-solid fa-arrow-right text-gray-300 group-hover:text-premium-gold text-xs"></i>
                        </a>
                    @endforeach
                </div>
            @endif

            {{-- Vehicles Section --}}
            @if(count($results) > 0)
                <ul class="divide-y divide-gray-100">
                    @foreach($results as $auto)
                        <li class="group">
                            <a href="{{ route('vehicles.show', $auto->slug) }}"
                                class="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors">
                                {{-- Image --}}
                                <div class="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                                    <img src="{{ Storage::url($auto->thumbnail) }}" class="w-full h-full object-cover">
                                </div>

                                {{-- Info --}}
                                <div class="flex-1 min-w-0 text-left pl-2">
                                    <p class="text-[10px] text-gray-500 font-bold uppercase truncate">{{ $auto->brand->name }}</p>
                                    <h4 class="text-sm font-black text-gray-900 leading-tight truncate">{{ $auto->model }}</h4>
                                    <p class="text-xs text-gray-500">{{ $auto->year }} • {{ number_format($auto->km, 0, ',', '.') }}
                                        km</p>
                                </div>

                                {{-- Price & Action --}}
                                <div class="text-right">
                                    <p class="text-sm font-black text-gray-900 tracking-tight">
                                        ${{ number_format($auto->price, 0, ',', '.') }}</p>
                                    <span
                                        class="inline-block mt-1 text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-full group-hover:bg-premium-gold transition-colors">
                                        VER <i class="fa-solid fa-chevron-right text-[8px] ml-0.5"></i>
                                    </span>
                                </div>
                            </a>
                        </li>
                    @endforeach
                </ul>
            @endif

            {{-- View All Link if needed --}}
            @if(count($results) >= 3)
                <a href="{{ route('vehicles.index', ['search' => $query]) }}"
                    class="block text-center py-3 bg-gray-50 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition border-t border-gray-100 uppercase tracking-wide">
                    Ver todos los resultados
                </a>
            @endif

        </div>
    @elseif(strlen($query) >= 2)
        <div
            class="absolute top-full left-0 w-full bg-white rounded-2xl shadow-xl mt-3 p-4 text-center z-50 text-sm text-gray-500">
            No encontramos resultados para "{{ $query }}"
        </div>
    @endif
</div>