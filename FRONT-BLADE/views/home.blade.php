<x-app-layout>

    <div class="relative h-[500px] flex items-center justify-center">
        <div class="absolute inset-0 z-0 overflow-hidden">
            @if($hero && $hero->video_path)
                <video autoplay muted loop playsinline class="w-full h-full object-cover">
                    <source src="{{ Storage::url($hero->video_path) }}" type="video/mp4">
                </video>
            @elseif($hero && $hero->image_path)
                <img src="{{ Storage::url($hero->image_path) }}" class="w-full h-full object-cover">
            @else
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
                    class="w-full h-full object-cover">
            @endif
            <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
        </div>

        <div class="relative z-30 w-full max-w-4xl px-4 text-center" data-aos="fade-up">
            <h1 class="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Tu próximo auto, <br>
                <span
                    class="seasonal-word text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D8] via-[#D4AF37] to-[#996515] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter brightness-110">
                    está aquí.
                </span>
            </h1>

            <div class="mt-8 relative max-w-2xl mx-auto group">
                <div class="relative z-30">
                    <livewire:search-vehicles />
                </div>
            </div>
        </div>
    </div>

    @if($fullBanner)
        <div class="w-full relative z-20 -mt-10 mx-auto max-w-7xl px-4" data-aos="fade-up" data-aos-delay="100">
            <a href="{{ $fullBanner->category_id ? route('vehicles.index', ['category_id' => $fullBanner->category_id]) : ($fullBanner->link ?? '#') }}"
                class="block w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img src="{{ Storage::url($fullBanner->image_path) }}"
                    class="w-full h-auto hidden md:block object-cover max-h-[250px]" alt="Promoción">
                <img src="{{ $fullBanner->mobile_image_path ? Storage::url($fullBanner->mobile_image_path) : Storage::url($fullBanner->image_path) }}"
                    class="w-full h-auto block md:hidden object-cover" alt="Promoción">
            </a>
        </div>
    @endif

    @if($promos->count() > 0)
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-aos="fade-up">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Explora por Categorías</h2>
                <div class="flex gap-2">
                    <button id="scrollLeft"
                        class="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition"><i
                            class="fa-solid fa-chevron-left"></i></button>
                    <button id="scrollRight"
                        class="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition"><i
                            class="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
            <div id="categoryCarousel" class="flex overflow-x-auto snap-x scrollbar-hide gap-5 pb-4 scroll-smooth">
                @foreach($promos as $promo)
                    <a href="{{ $promo->category_id ? route('vehicles.index', ['category_id' => $promo->category_id]) : ($promo->link ?? '#') }}"
                        class="snap-center shrink-0 w-[80%] md:w-[32%] h-60 rounded-2xl overflow-hidden relative shadow-lg group">
                        <img src="{{ Storage::url($promo->image_path) }}"
                            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                            <h3
                                class="text-white font-bold text-xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                {{ $promo->title }}</h3>
                            <p class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {{ $promo->subtitle }}</p>
                        </div>
                    </a>
                @endforeach
            </div>
        </section>
    @endif

    @if(isset($premiumVehicles) && $premiumVehicles->count() > 0)
        <section id="premiumSection" class="w-full bg-white relative overflow-hidden py-16">
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div class="text-left max-w-2xl">
                        <span class="inline-block text-premium-gold font-bold uppercase tracking-[0.25em] text-xs mb-3 px-3 py-1 border border-premium-gold/30 rounded-full">
                            Exclusividad
                        </span>
                        <h2 class="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter leading-none">
                            Autos <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#b88c1c] to-[#996515]">Premium</span>
                        </h2>
                        <p class="text-gray-500 mt-4 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                            Una selección de vehículos de alta gama, verificados para entregar la máxima experiencia.
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button id="premiumScrollLeft"
                            class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition duration-300">
                            <i class="fa-solid fa-arrow-left"></i>
                        </button>
                        <button id="premiumScrollRight"
                            class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-black transition duration-300">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <div id="premiumCarousel" class="flex overflow-x-auto snap-x scrollbar-hide gap-6 pb-8 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                    @foreach($premiumVehicles as $auto)
                        <div class="snap-center shrink-0 w-[85%] sm:w-[320px] bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 group relative">
                            <div class="relative aspect-[16/10] overflow-hidden">
                                 <div class="absolute top-3 left-3 z-30 shadow-lg"><span class="bg-[#D4AF37] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide shadow-md">Elite</span></div>
                                <img src="{{ Storage::url($auto->thumbnail) }}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100">
                                <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                            </div>
                            <div class="p-6 relative">
                                <div class="flex justify-between items-start mb-3">
                                    <div class="min-w-0 pr-2">
                                        <p class="text-[10px] font-bold text-premium-gold uppercase mb-1 tracking-widest flex items-center gap-2">
                                            {{ $auto->brand->name }}
                                        </p>
                                        <h3 class="text-xl font-bold text-white truncate italic font-heading" title="{{ $auto->model }}">{{ $auto->model }}</h3>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-3 text-gray-400 text-xs font-medium mb-5 border-t border-white/10 pt-3">
                                     <span>{{ $auto->year }}</span>
                                     <span class="w-1 h-1 bg-white/20 rounded-full"></span>
                                     <span>{{ number_format($auto->km/1000, 0) }}K km</span>
                                     <span class="w-1 h-1 bg-white/20 rounded-full"></span>
                                     <span>{{ substr($auto->transmission, 0, 3) }}</span>
                                </div>

                                <div class="flex justify-between items-center">
                                    <p class="text-xl font-black text-white tracking-tight">${{ number_format($auto->price, 0, ',', '.') }}</p>
                                    <a href="{{ route('vehicles.show', $auto->slug) }}" class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-premium-gold hover:text-black transition-all duration-300">
                                        <i class="fa-solid fa-arrow-right text-sm"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                    
                    {{-- Tarjeta "Ver Todos" al final del carrusel --}}
                    <div class="snap-center shrink-0 w-[150px] flex items-center justify-center">
                        <a href="{{ route('vehicles.index', ['is_premium' => 1]) }}" class="group flex flex-col items-center gap-3 text-gray-400 hover:text-black transition duration-300">
                             <div class="w-16 h-16 rounded-full border-2 border-gray-200 group-hover:border-black flex items-center justify-center transition duration-300">
                                 <i class="fa-solid fa-arrow-right text-xl"></i>
                             </div>
                             <span class="font-bold text-sm uppercase tracking-wider">Ver Todo</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    @endif

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-16 md:pt-24" id="stock">



        <div class="text-center mb-10" data-aos="fade-up">
            <h2 class="text-4xl font-bold text-gray-900 tracking-tighter mb-4">
                Novedades en <span class="seasonal-word">Stock</span>
            </h2>

            <!-- Mobile Filter Carousel (Now Scrollable) -->
            <div class="flex flex-nowrap overflow-x-auto pb-4 md:flex-wrap md:justify-center gap-3 scrollbar-hide snap-x px-4 -mx-4 md:px-0 md:mx-0" id="quickFilters">
                <!-- Todo (AJAX for Home Preview) -->
                <button onclick="filterHome('')"
                    class="filter-btn active shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition bg-black text-white border-black whitespace-nowrap">Todo</button>

                <!-- Destacados (AJAX) -->
                <button onclick="filterHome('is_featured=1')"
                    class="filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition flex items-center gap-2 bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black whitespace-nowrap">
                    <i class="fa-solid fa-star text-yellow-500"></i> Destacados
                </button>

                <!-- Premium (AJAX) -->
                <button onclick="filterHome('is_premium=1')"
                    class="filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition flex items-center gap-2 bg-white text-premium-gold border-premium-gold hover:bg-black hover:text-premium-gold whitespace-nowrap">
                    <i class="fa-solid fa-crown"></i> Premium
                </button>

                <!-- Categories (Links to Dedicated Page) -->
                @foreach($categories as $cat)
                    <button onclick="filterHome('category_id={{ $cat->id }}')"
                        class="filter-btn shrink-0 snap-center px-6 py-2.5 rounded-full border text-sm font-bold transition flex items-center gap-2 bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black shadow-sm hover:shadow-lg whitespace-nowrap">
                        {{ $cat->name }}
                    </button>
                @endforeach
            </div>
        </div>

        <div id="homeGridContainer" data-aos="fade-up">
            @include('partials.home-grid', ['vehicles' => $recientes])
        </div>

        <div class="mt-16 text-center">
            <a id="viewAllBtn" href="{{ route('vehicles.index') }}"
                class="inline-block px-10 py-4 rounded-full border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition duration-300">
                Ver Inventario Completo
            </a>
        </div>
    </section>

    <section class="relative py-24 overflow-hidden">
        <div class="absolute inset-0 bg-black">
            <img src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1920"
                class="w-full h-full object-cover opacity-30 mix-blend-screen">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
                Experiencia <span class="seasonal-word">Carmona</span>
            </h2>
            <p class="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">Más que un auto, te entregamos la tranquilidad de
                un servicio integral.</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    class="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition hover:-translate-y-2 duration-300 group">
                    <div
                        class="w-16 h-16 mx-auto bg-premium-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <i class="fa-solid fa-file-invoice-dollar text-3xl text-premium-gold"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Financiamiento</h3>
                    <p class="text-gray-400 text-sm">Gestionamos tu crédito con las tasas más competitivas.</p>
                </div>
                <div
                    class="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition hover:-translate-y-2 duration-300 group">
                    <div
                        class="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <i class="fa-solid fa-car-on text-3xl text-blue-400"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Retoma Express</h3>
                    <p class="text-gray-400 text-sm">Deja tu auto en parte de pago. Tasación inmediata.</p>
                </div>
                <div
                    class="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition hover:-translate-y-2 duration-300 group">
                    <div
                        class="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                        <i class="fa-solid fa-certificate text-3xl text-green-400"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-3">Garantía Mecánica</h3>
                    <p class="text-gray-400 text-sm">Inspección de 100 puntos y respaldo total.</p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // 1. CAROUSEL FLECHAS
        const scrollContainer = document.getElementById('categoryCarousel');
        if (scrollContainer) {
            document.getElementById('scrollLeft').addEventListener('click', () => { scrollContainer.scrollBy({ left: -300, behavior: 'smooth' }); });
            document.getElementById('scrollRight').addEventListener('click', () => { scrollContainer.scrollBy({ left: 300, behavior: 'smooth' }); });
        }

        // 2. PREMIUM CAROUSEL CONTROLS
        const premiumScrollContainer = document.getElementById('premiumCarousel');
        if (premiumScrollContainer) {
            const btnLeft = document.getElementById('premiumScrollLeft');
            const btnRight = document.getElementById('premiumScrollRight');
            
            if(btnLeft) btnLeft.addEventListener('click', () => { premiumScrollContainer.scrollBy({ left: -340, behavior: 'smooth' }); });
            if(btnRight) btnRight.addEventListener('click', () => { premiumScrollContainer.scrollBy({ left: 340, behavior: 'smooth' }); });
        }

        // 3. FILTROS AJAX (Lógica de clases corregida)
        async function filterHome(queryString) {
            const clickedBtn = event.currentTarget;

            // Resetear TODOS los botones a estado inactivo (blanco)
            document.querySelectorAll('.filter-btn').forEach(btn => {
                // Quitar estilos activos
                btn.classList.remove('bg-black', 'text-white', 'border-black');

                // Restaurar estilos inactivos base
                btn.classList.add('bg-white', 'border');

                // Restaurar estilos específicos según tipo
                if (btn.textContent.includes('Premium') || btn.querySelector('.fa-crown')) {
                    btn.classList.add('text-premium-gold', 'border-premium-gold');
                    btn.classList.remove('text-gray-700', 'border-gray-200');
                } else {
                    btn.classList.add('text-gray-700', 'border-gray-200');
                    btn.classList.remove('text-premium-gold', 'border-premium-gold');
                }
            });

            // Activar el botón clickeado (negro)
            clickedBtn.classList.remove('bg-white', 'text-gray-700', 'border-gray-200', 'text-premium-gold', 'border-premium-gold');
            clickedBtn.classList.add('bg-black', 'text-white', 'border-black');

            // Cargar datos
            const container = document.getElementById('homeGridContainer');
            container.style.opacity = '0.5';
            try {
                const response = await fetch(`{{ route('api.home.filter') }}?${queryString}`);
                const html = await response.text();
                container.innerHTML = html;
                container.style.opacity = '1';
                document.getElementById('viewAllBtn').href = `{{ route('vehicles.index') }}?${queryString}`;
            } catch (error) { console.error(error); container.style.opacity = '1'; }
        }

        // Función Copiar Link
        function copyLink(url, btnElement) {
            navigator.clipboard.writeText(url).then(() => {
                const originalContent = btnElement.innerHTML;
                btnElement.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
                setTimeout(() => { btnElement.innerHTML = originalContent; }, 2000);
            }).catch(err => { alert('Copia manual: ' + url); });
        }
    </script>

</x-app-layout>