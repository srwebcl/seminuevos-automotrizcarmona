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
        <section id="premiumSection" class="w-full bg-[#050505] relative overflow-hidden py-24 border-t border-white/5">
             {{-- Luminous Effects (Vite-style) --}}
             <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-black/0 to-transparent pointer-events-none z-0"></div>
             <div id="premiumGlow" class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-premium-gold/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none z-0 animate-pulse transition-transform duration-100 ease-out"></div>
             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="flex flex-col items-center text-center mb-16">
                    <span class="order-1 inline-block text-premium-gold font-bold uppercase tracking-[0.25em] text-xs mb-4 border border-premium-gold/30 px-5 py-1.5 rounded-full bg-premium-gold/5 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.1)]">Exclusividad Garantizada</span>
                    
                    {{-- Title Fix: Definitive Solution --}}
                    {{-- 1. Order-2 ensures it's below badge --}}
                    {{-- 2. Box-decoration-clone or padding trick for Italics --}}
                    {{-- 3. pr-14 to catch the 'm' safely, but text-center centers the *box*, so we need to offset or just accept the visual center shift (which is minimal with centered text) --}}
                    <h2 class="order-2 text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 drop-shadow-2xl leading-tight py-2 relative z-10" style="padding-right: 0.3em; margin-right: -0.15em;">
                        Autos <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F1D8] via-[#D4AF37] to-[#F9F1D8] animate-pulse-slow inline-block pr-2">Premium</span>
                    </h2>
                    
                    <p class="order-3 text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        Una selección curada de vehículos de alta gama, verificados y listos para entregar la máxima experiencia de conducción.
                    </p>
                </div>

                <div class="flex overflow-x-auto snap-x scrollbar-hide gap-8 pb-12 scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
                    @foreach($premiumVehicles as $auto)
                        <div class="snap-center shrink-0 w-[85%] sm:w-[380px] bg-neutral-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-premium-gold/70 transition duration-500 group relative shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                            <div class="relative aspect-[16/10] overflow-hidden">
                                 <div class="absolute top-4 left-4 z-30 shadow-lg"><span class="bg-gradient-to-tr from-[#D4AF37] to-[#8a6e15] text-white text-[10px] font-black px-3 py-1.5 rounded uppercase flex items-center gap-1.5 shadow-md tracking-wider"><i class="fa-solid fa-crown text-yellow-100"></i> Elite</span></div>
                                <img src="{{ Storage::url($auto->thumbnail) }}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100">
                                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            </div>
                            <div class="p-7 relative">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="min-w-0 pr-2">
                                        <p class="text-xs font-bold text-premium-gold uppercase mb-1.5 tracking-widest flex items-center gap-2">
                                            {{ $auto->brand->name }} <span class="w-8 h-[1px] bg-premium-gold/50"></span>
                                        </p>
                                        <h3 class="text-2xl font-black text-white truncate italic font-heading group-hover:text-premium-gold transition-colors" title="{{ $auto->model }}">{{ $auto->model }}</h3>
                                    </div>
                                    <div class="flex gap-2 shrink-0">
                                         {{-- Share Actions (Moved to Header) --}}
                                        <a href="https://wa.me/?text={{ urlencode('Hola, me interesa este auto Premium: ' . route('vehicles.show', $auto->slug)) }}"
                                           target="_blank"
                                           class="w-9 h-9 rounded-full bg-white/5 text-gray-400 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors border border-white/5 backdrop-blur-sm"
                                           title="Compartir en WhatsApp">
                                            <i class="fa-brands fa-whatsapp text-lg"></i>
                                        </a>
                                        <button onclick="copyLink('{{ route('vehicles.show', $auto->slug) }}', this)"
                                                class="w-9 h-9 rounded-full bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/5 backdrop-blur-sm"
                                                title="Copiar Enlace">
                                            <i class="fa-solid fa-link text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-2 mb-6">
                                    <div class="text-center bg-white/5 rounded-lg py-2 border border-white/5">
                                        <p class="text-[10px] text-gray-500 uppercase font-bold">Año</p>
                                        <p class="text-xs text-gray-200 font-bold">{{ $auto->year }}</p>
                                    </div>
                                    <div class="text-center bg-white/5 rounded-lg py-2 border border-white/5">
                                        <p class="text-[10px] text-gray-500 uppercase font-bold">Kms</p>
                                        <p class="text-xs text-gray-200 font-bold">{{ number_format($auto->km/1000, 0) }}K</p>
                                    </div>
                                    <div class="text-center bg-white/5 rounded-lg py-2 border border-white/5">
                                        <p class="text-[10px] text-gray-500 uppercase font-bold">Trans.</p>
                                        <p class="text-xs text-gray-200 font-bold">{{ substr($auto->transmission, 0, 3) }}</p>
                                    </div>
                                </div>

                                <div class="flex justify-between items-end pt-5 border-t border-white/10">
                                    <div>
                                        <p class="text-xs text-gray-400 font-medium mb-0.5">Precio Contado</p>
                                        <p class="text-2xl font-black text-white tracking-tight">${{ number_format($auto->price, 0, ',', '.') }}</p>
                                    </div>
                                    <a href="{{ route('vehicles.show', $auto->slug) }}" class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-premium-gold transition-all duration-300 transform group-hover:rotate-[-45deg] shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-110 ml-2">
                                        <i class="fa-solid fa-arrow-right text-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
                
                <div class="mt-12 text-center relative z-20">
                    <a href="{{ route('vehicles.index', ['is_premium' => 1]) }}" class="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black font-black uppercase tracking-[0.15em] text-sm rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition duration-300 group ring-1 ring-white/20">
                        Ver Colección Completa
                        <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </a>
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

        // 2. PREMIUM GLOW EFFECT (Mouse Tracking)
        const premiumSection = document.getElementById('premiumSection');
        const premiumGlow = document.getElementById('premiumGlow');

        if (premiumSection && premiumGlow) {
            premiumSection.addEventListener('mousemove', (e) => {
                const rect = premiumSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move the glow to cursor position (centering the glow)
                premiumGlow.style.transform = `translate(${x - 300}px, ${y - 150}px)`;
            });
            
            // Optional: Reset to center on leave? Or just leave it.
            premiumSection.addEventListener('mouseleave', () => {
                 premiumGlow.style.transition = 'transform 1s ease-out';
                 premiumGlow.style.transform = 'translate(-50%, -50%)'; // Reset to center-ish
                 setTimeout(() => { premiumGlow.style.transition = 'transform 0.1s ease-out'; }, 1000);
            });
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