<x-app-layout>

    <!-- Dynamic Category Banner -->
    @if(isset($currentCategory))
        <div class="relative w-full h-40 md:h-64 lg:h-80 bg-gray-900 overflow-hidden">
            {{-- Layer 1: Background Image --}}
            @if($currentCategory->banner_path)
                <img src="{{ Storage::url($currentCategory->banner_path) }}"
                    class="absolute inset-0 w-full h-full object-cover object-center opacity-70">
            @else
                {{-- Fallback Random/Solid Background if no banner uploaded --}}
                <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
                    class="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay">
            @endif

            {{-- Layer 2: Full Width Overlay Gradient --}}
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {{-- Layer 3: Centered Content --}}
            <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto w-full">
                <div class="flex items-center gap-2 mb-2">
                    <span
                        class="bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm">
                        {{ $currentCategory->is_menu_item ? 'Destacado' : 'Categoría' }}
                    </span>
                    @if(request('is_premium'))
                        <span
                            class="bg-premium-gold text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm"><i
                                class="fa-solid fa-crown"></i> Premium</span>
                    @endif
                </div>

                <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-2 capitalize">
                    {{ $currentCategory->name }}
                </h1>

                <p class="text-gray-300 text-xs md:text-sm font-medium max-w-xl line-clamp-2">
                    Explora nuestra selección de {{ strtolower($currentCategory->name) }} garantizados.
                </p>
            </div>
        </div>
    @else
        <!-- Main Catalog Default Header (Seminuevos General) -->
        <div class="relative w-full h-40 md:h-64 lg:h-80 bg-gray-900 overflow-hidden">
            {{-- Layer 1: Background Image --}}
            <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80"
                class="absolute inset-0 w-full h-full object-cover object-center opacity-60">

            {{-- Layer 2: Full Width Overlay Gradient --}}
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {{-- Layer 3: Centered Content --}}
            <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto w-full">
                <div class="flex items-center gap-2 mb-2">
                    <span
                        class="bg-premium-gold text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-sm">Catálogo
                        Completo</span>
                </div>
                <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">Seminuevos</h1>
                <p class="text-gray-300 text-xs md:text-sm font-medium max-w-xl line-clamp-2">Encuentra el auto de tus
                    sueños con nuestra garantía de calidad Carmona.</p>
            </div>
        </div>
    @endif

    <div class="bg-white py-8 min-h-screen" x-data="{ view: 'grid' }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Mobile Controls: Search + Filter Button -->
            <div class="md:hidden flex flex-col gap-4 mb-8">
                <!-- Search -->
                <form action="{{ route('vehicles.index') }}" method="GET" class="relative group">
                    <i
                        class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition"></i>
                    <input type="text" name="search" value="{{ request('search') }}"
                        placeholder="Buscar marca o modelo..."
                        class="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-100 border-none text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:bg-white transition shadow-sm font-medium text-sm">
                </form>

                <!-- Filter Toggle + Sort -->
                <div class="flex gap-3">
                    <button onclick="document.getElementById('mobileFilters').classList.remove('translate-x-full')"
                        class="flex-1 bg-black text-white h-12 rounded-xl text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg active:scale-95 transition">
                        <i class="fa-solid fa-sliders"></i> Filtrar
                    </button>
                    <!-- Simple Sort Select for Mobile -->
                    <form action="{{ route('vehicles.index') }}" method="GET" class="flex-1">
                        @foreach(request()->except('sort', 'page') as $key => $value)
                            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
                        @endforeach
                        <div class="relative h-12">
                            <select name="sort" onchange="this.form.submit()"
                                class="w-full h-full rounded-xl bg-gray-100 border-none text-gray-900 text-xs font-bold pl-3 pr-8 focus:ring-2 focus:ring-black appearance-none uppercase tracking-wide">
                                <option value="latest" {{ request('sort') == 'latest' ? 'selected' : '' }}>Recientes
                                </option>
                                <option value="price_asc" {{ request('sort') == 'price_asc' ? 'selected' : '' }}>$ Menor
                                </option>
                                <option value="price_desc" {{ request('sort') == 'price_desc' ? 'selected' : '' }}>$ Mayor
                                </option>
                            </select>
                            <i
                                class="fa-solid fa-chevron-down absolute right-3 top-4 text-gray-500 text-xs pointer-events-none"></i>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Desktop Header: Breadcrumbs + Sort -->
            <div class="hidden md:flex justify-between items-end mb-8 pb-4 border-b border-gray-100">
                <div class="text-sm breadcrumbs text-gray-500 font-medium">
                    <ul class="flex items-center gap-2">
                        <li><a href="{{ route('home') }}"
                                class="hover:text-black transition border-b border-transparent hover:border-black">Inicio</a>
                        </li>
                        <li class="text-gray-300 text-xs"><i class="fa-solid fa-chevron-right"></i></li>
                        <li><a href="{{ route('vehicles.index') }}"
                                class="hover:text-black transition border-b border-transparent hover:border-black">Vehículos</a>
                        </li>
                        @if(isset($currentCategory))
                            <li class="text-gray-300 text-xs"><i class="fa-solid fa-chevron-right"></i></li>
                            <li class="text-black font-bold uppercase tracking-wide">{{ $currentCategory->name }}</li>
                        @endif
                    </ul>
                </div>

                <div class="flex items-center gap-3">
                    <!-- View Switcher -->
                    <div class="flex items-center gap-2 mr-4 border-r border-gray-200 pr-4">
                        <button type="button" @click="view = 'grid'"
                            :class="view === 'grid' ? 'text-black bg-gray-200' : 'text-gray-400 hover:text-black'"
                            class="w-8 h-8 rounded-lg flex items-center justify-center transition-all">
                            <i class="fa-solid fa-border-all"></i>
                        </button>
                        <button type="button" @click="view = 'list'"
                            :class="view === 'list' ? 'text-black bg-gray-200' : 'text-gray-400 hover:text-black'"
                            class="w-8 h-8 rounded-lg flex items-center justify-center transition-all">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                    </div>

                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordenar por:</span>
                    <form id="sortFormDesktop" action="{{ route('vehicles.index') }}" method="GET">
                        @foreach(request()->except('sort', 'page') as $key => $value)
                            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
                        @endforeach
                        <div class="relative group">
                            <select name="sort" onchange="document.getElementById('sortFormDesktop').submit()"
                                class="bg-gray-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black cursor-pointer hover:bg-gray-100 transition min-w-[160px]">
                                <option value="latest" {{ request('sort') == 'latest' ? 'selected' : '' }}>Más recientes
                                </option>
                                <option value="price_asc" {{ request('sort') == 'price_asc' ? 'selected' : '' }}>Menor
                                    precio</option>
                                <option value="price_desc" {{ request('sort') == 'price_desc' ? 'selected' : '' }}>Mayor
                                    precio</option>
                                <option value="year_desc" {{ request('sort') == 'year_desc' ? 'selected' : '' }}>Año
                                    (Nuevos)</option>
                            </select>
                            <i
                                class="fa-solid fa-chevron-down absolute right-3 top-3 text-xs text-gray-400 pointer-events-none group-hover:text-black transition"></i>
                        </div>
                    </form>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">

                <!-- Sidebar Filters (Desktop) -->
                <div class="hidden lg:block lg:col-span-1 space-y-8">
                    @include('vehicles.partials.filters')
                </div>

                <!-- Vehicles Grid -->
                <div class="lg:col-span-3">
                    @include('partials.category-grid', ['vehicles' => $vehicles])

                    <div class="mt-12">
                        {{ $vehicles->onEachSide(1)->links() }}
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Mobile Filters Drawer (Slide-over) -->
    <div id="mobileFilters"
        class="fixed inset-0 z-50 transform translate-x-full transition-transform duration-300 ease-in-out md:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onclick="document.getElementById('mobileFilters').classList.add('translate-x-full')"></div>

        <!-- Drawer Content -->
        <div class="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 class="text-lg font-black text-gray-900 uppercase tracking-tight">Filtros</h2>
                <button onclick="document.getElementById('mobileFilters').classList.add('translate-x-full')"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-black shadow-sm">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
                <!-- Re-use filters partial but ensure clear ID/Context -->
                @include('vehicles.partials.filters')
            </div>

            <div class="p-5 border-t border-gray-100 bg-gray-50">
                <button onclick="document.getElementById('mobileFilters').classList.add('translate-x-full')"
                    class="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition">
                    Ver {{ $vehicles->total() }} Vehículos
                </button>
            </div>
        </div>
    </div>

    <script>
        function copyLink(url, btnElement) {
            navigator.clipboard.writeText(url).then(() => {
                const originalContent = btnElement.innerHTML;
                btnElement.innerHTML = '<i class="fa-solid fa-check text-green-500 text-xs"></i>';
                setTimeout(() => { btnElement.innerHTML = originalContent; }, 2000);
            }).catch(err => { alert('Copia manual: ' + url); });
        }
    </script>
</x-app-layout>