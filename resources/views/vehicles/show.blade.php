<x-app-layout>
    <!-- Lightbox -->
    <div id="lightbox"
        class="fixed inset-0 z-[100] bg-black/95 hidden backdrop-blur-md flex items-center justify-center opacity-0 transition-opacity duration-300">
        <button onclick="closeLightbox()"
            class="absolute top-6 right-6 text-white text-5xl hover:text-gray-300 z-50 transition-colors">&times;</button>
        <div class="relative w-full max-w-7xl h-[90vh] flex items-center justify-center p-4">
            <img id="lightboxImage" src=""
                class="max-w-full max-h-full object-contain shadow-2xl scale-95 transition-transform duration-300">
        </div>
        <p class="absolute bottom-6 text-white/50 text-sm">Esc para cerrar</p>
    </div>

    <!-- Mobile Sticky Header -->
    <div
        class="md:hidden bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 sticky top-16 z-30 shadow-sm flex justify-between items-center transition-all duration-300">
        <div>
            <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">{{ $vehicle->brand->name }}</p>
            <h1 class="text-lg font-black text-gray-900 leading-none truncate w-40">{{ $vehicle->model }}</h1>
        </div>
        <p class="text-lg font-black text-black">${{ number_format($vehicle->price, 0, ',', '.') }}</p>
    </div>

    <div class="bg-white pb-20 pt-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Breadcrumbs -->
            <nav class="hidden md:flex text-xs font-bold text-gray-300 mb-8 uppercase tracking-widest">
                <a href="{{ route('home') }}" class="hover:text-black transition">Inicio</a>
                <span class="mx-3 text-gray-200">/</span>
                <a href="{{ route('vehicles.index') }}" class="hover:text-black transition">Catálogo</a>
                <span class="mx-3 text-gray-200">/</span>
                <span class="text-black">{{ $vehicle->brand->name }} {{ $vehicle->model }}</span>
            </nav>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

                <!-- Left Column: Gallery & Details -->
                <div class="lg:col-span-8 space-y-12">

                    <!-- Main Gallery -->
                    <div class="space-y-4">
                        <!-- Desktop: Main Stage + Thumbnails Strip -->
                        <div class="hidden md:block">
                            <!-- Main Image Stage -->
                            <div class="relative w-full aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden cursor-zoom-in group mb-4"
                                onclick="openLightbox(document.getElementById('desktopMainImage').src)">
                                <img id="desktopMainImage" src="{{ Storage::url($vehicle->thumbnail) }}"
                                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div
                                    class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300">
                                </div>
                                <div class="absolute top-5 left-5 flex gap-2 z-10">
                                    @if($vehicle->is_premium)
                                        <span
                                            class="bg-black/80 backdrop-blur-md text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/50 shadow-lg">Premium</span>
                                    @endif
                                    @if($vehicle->is_offer)
                                        <span
                                            class="bg-red-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Oferta</span>
                                    @endif
                                </div>
                                <div
                                    class="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-bold text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <i class="fa-solid fa-expand mr-1"></i> Ampliar
                                </div>
                            </div>

                            <!-- Thumbnails Strip -->
                            @if(is_array($vehicle->photos) && count($vehicle->photos) > 0)
                                <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    <!-- Thumbnail: Main (Active by default) -->
                                    <button onclick="updateMainImage('{{ Storage::url($vehicle->thumbnail) }}', this)"
                                        class="gallery-thumb shrink-0 w-28 aspect-[4/3] rounded-xl overflow-hidden border-2 border-black p-0.5 transition-all opacity-100 ring-2 ring-transparent">
                                        <img src="{{ Storage::url($vehicle->thumbnail) }}"
                                            class="w-full h-full object-cover rounded-lg">
                                    </button>
                                    @foreach($vehicle->photos as $photo)
                                        <button onclick="updateMainImage('{{ Storage::url($photo) }}', this)"
                                            class="gallery-thumb shrink-0 w-28 aspect-[4/3] rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-300 p-0.5 transition-all opacity-70 hover:opacity-100">
                                            <img src="{{ Storage::url($photo) }}" class="w-full h-full object-cover rounded-lg">
                                        </button>
                                    @endforeach
                                </div>
                            @endif
                        </div>

                        <!-- Mobile: Swiper-like Horizontal Scroll -->
                        <div class="md:hidden">
                            <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0 rounded-2xl">
                                <div class="snap-center shrink-0 w-full aspect-[4/3] relative"
                                    onclick="openLightbox('{{ Storage::url($vehicle->thumbnail) }}')">
                                    <img src="{{ Storage::url($vehicle->thumbnail) }}"
                                        class="w-full h-full object-cover">
                                    @if($vehicle->is_premium)
                                        <span
                                            class="absolute top-4 left-4 bg-black/80 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-[#D4AF37]/30">Premium</span>
                                    @endif
                                </div>
                                @if(is_array($vehicle->photos))
                                    @foreach($vehicle->photos as $photo)
                                        <div class="snap-center shrink-0 w-full aspect-[4/3] relative"
                                            onclick="openLightbox('{{ Storage::url($photo) }}')">
                                            <img src="{{ Storage::url($photo) }}" class="w-full h-full object-cover">
                                        </div>
                                    @endforeach
                                @endif
                            </div>
                            <div class="flex justify-center gap-1.5 mt-3">
                                <div class="w-1.5 h-1.5 rounded-full bg-black"></div>
                                @if(is_array($vehicle->photos))
                                    @foreach(array_slice($vehicle->photos, 0, 4) as $photo)
                                        <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    @endforeach
                                @endif
                            </div>
                        </div>
                    </div>

                    <!-- Technical Specs -->
                    <div>
                        <h3 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <i class="fa-solid fa-gauge-high text-gray-400"></i> Ficha Técnica
                        </h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <!-- Year -->
                            <div
                                class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-black/10 transition group">
                                <div
                                    class="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-black transition">
                                    <i class="fa-regular fa-calendar-days text-sm"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Año</p>
                                <p class="text-lg font-bold text-gray-900">{{ $vehicle->year }}</p>
                            </div>

                            <!-- KM -->
                            <div
                                class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-black/10 transition group">
                                <div
                                    class="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-black transition">
                                    <i class="fa-solid fa-gauge text-sm"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Kilometraje
                                </p>
                                <p class="text-lg font-bold text-gray-900">
                                    {{ number_format($vehicle->km, 0, ',', '.') }} km</p>
                            </div>

                            <!-- Transmission -->
                            <div
                                class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-black/10 transition group">
                                <div
                                    class="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-black transition">
                                    <i class="fa-solid fa-gears text-sm"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Transmisión
                                </p>
                                <p class="text-lg font-bold text-gray-900">{{ $vehicle->transmission ?? 'No esp.' }}</p>
                            </div>

                            <!-- Fuel -->
                            <div
                                class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-black/10 transition group">
                                <div
                                    class="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-black transition">
                                    <i class="fa-solid fa-gas-pump text-sm"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Combustible
                                </p>
                                <p class="text-lg font-bold text-gray-900">{{ $vehicle->fuel ?? 'No esp.' }}</p>
                            </div>

                            <!-- Traction -->
                            <div
                                class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-black/10 transition group">
                                <div
                                    class="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-black transition">
                                    <i class="fa-solid fa-truck-monster text-sm"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tracción
                                </p>
                                <p class="text-lg font-bold text-gray-900">{{ $vehicle->traction ?? 'No esp.' }}</p>
                            </div>

                            <!-- Location -->
                            <div
                                class="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-black/10 transition group">
                                <div
                                    class="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-black transition">
                                    <i class="fa-solid fa-location-dot text-sm"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Ubicación
                                </p>
                                <p class="text-lg font-bold text-gray-900 truncate">
                                    {{ $vehicle->location->name ?? 'Central' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    @if($vehicle->description)
                        <div class="border-t border-gray-100 pt-10">
                            <h3 class="text-xl font-black text-gray-900 mb-4">Observaciones</h3>
                            <div class="prose max-w-none text-gray-600 leading-relaxed font-medium">
                                <p class="whitespace-pre-line">{{ $vehicle->description }}</p>
                            </div>
                        </div>
                    @endif

                </div>

                <!-- Right Column: Sticky Action Card -->
                <div class="lg:col-span-4">
                    <div class="sticky top-24 space-y-6">

                        <!-- MAIN INFO CARD -->
                        <div
                            class="bg-white p-8 rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
                            @if($vehicle->is_offer)
                                <div
                                    class="absolute -right-12 top-6 bg-red-600 text-white text-[10px] font-bold px-12 py-1 rotate-45 shadow-sm uppercase tracking-widest">
                                    Oferta</div>
                            @endif

                            <div class="mb-8 border-b border-gray-100 pb-8">
                                <p class="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">
                                    {{ $vehicle->brand->name }}</p>
                                <h1 class="text-3xl lg:text-4xl font-black text-gray-900 leading-none mb-4">
                                    {{ $vehicle->model }}</h1>
                                <p class="text-sm text-gray-500 font-medium">{{ $vehicle->year }} •
                                    {{ number_format($vehicle->km, 0, ',', '.') }} km</p>
                            </div>

                            <div class="mb-8">
                                <p class="text-xs text-gray-400 font-bold uppercase mb-2">Precio Contado</p>
                                <div class="flex items-end gap-2">
                                    <p class="text-4xl font-black text-gray-900 tracking-tight">
                                        ${{ number_format($vehicle->price, 0, ',', '.') }}</p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                @if($whatsapp)
                                    @php
                                        $mensaje = "Hola, estoy interesado en el {$vehicle->brand->name} {$vehicle->model} ({$vehicle->year})";
                                        $link = "https://wa.me/{$whatsapp->phone}?text=" . urlencode($mensaje);
                                    @endphp
                                    <a href="{{ $link }}" target="_blank"
                                        class="block w-full bg-[#128C7E] hover:bg-[#075E54] text-white text-center py-4 rounded-xl font-bold uppercase tracking-wide transition transform hover:-translate-y-1 shadow-lg shadow-[#128C7E]/20">
                                        <i class="fa-brands fa-whatsapp mr-2 text-xl"></i> Solicitar Información
                                    </a>
                                @endif
                            </div>

                            <div class="mt-8 pt-6 border-t border-gray-100">
                                <p class="text-[10px] text-gray-400 font-bold uppercase mb-3 text-center">Compartir</p>
                                <div class="flex gap-3 justify-center">
                                    <a href="https://wa.me/?text={{ urlencode(route('vehicles.show', $vehicle->slug)) }}"
                                        target="_blank"
                                        class="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition">
                                        <i class="fa-brands fa-whatsapp"></i>
                                    </a>
                                    <button
                                        onclick="shareVehicle('{{ $vehicle->model }}', '{{ route('vehicles.show', $vehicle->slug) }}')"
                                        class="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-black hover:text-white transition">
                                        <i class="fa-solid fa-link"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- TRUST BADGES -->
                        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <i class="fa-solid fa-check-circle text-green-500"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-gray-900">Inspeccionado</p>
                                    <p class="text-xs text-gray-500">Revisión mecánica completa.</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <i class="fa-solid fa-file-shield text-blue-500"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-gray-900">Documentación al día</p>
                                    <p class="text-xs text-gray-500">Transferencia inmediata.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <!-- RELATED VEHICLES -->
            @if($related->count() > 0)
                <div class="mt-24 pt-16 border-t border-gray-200">
                    <div class="flex items-center justify-between mb-10">
                        <h2 class="text-2xl font-black text-gray-900 tracking-tight">También te podría interesar</h2>
                        <a href="{{ route('vehicles.index') }}"
                            class="hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-gray-600 transition">
                            Ver todo el catálogo <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                    @include('partials.home-grid', ['vehicles' => $related])
                </div>
            @endif

            <!-- CATEGORY CAROUSEL -->
            @if(isset($promos) && $promos->count() > 0)
                <div class="mt-24 pt-16 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-10">
                        <h2 class="text-2xl font-black text-gray-900 tracking-tight">Explora por Categoría</h2>
                        <div class="flex gap-2">
                            <button id="scrollLeft"
                                class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition"><i
                                    class="fa-solid fa-chevron-left"></i></button>
                            <button id="scrollRight"
                                class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition"><i
                                    class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
                    <div id="categoryCarousel" class="flex overflow-x-auto snap-x scrollbar-hide gap-6 pb-8 scroll-smooth">
                        @foreach($promos as $promo)
                            <a href="{{ $promo->category_id ? route('vehicles.index', ['category_id' => $promo->category_id]) : ($promo->link ?? '#') }}"
                                class="snap-start shrink-0 w-[280px] md:w-[350px] aspect-[16/9] rounded-2xl overflow-hidden relative shadow-lg group">
                                <img src="{{ Storage::url($promo->image_path) }}"
                                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <h3
                                        class="text-white font-black text-xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {{ $promo->title }}</h3>
                                    <p
                                        class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {{ $promo->subtitle }}</p>
                                </div>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

        </div>
    </div>

    <!-- Scripts -->
    <script>
        function openLightbox(src) {
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightboxImage');
            img.src = src;
            lightbox.classList.remove('hidden');
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
                img.classList.remove('scale-95');
                img.classList.add('scale-100');
            }, 10);
        }

        function updateMainImage(src, element) {
            // Update Main Image with Fade Effect
            const mainImage = document.getElementById('desktopMainImage');
            mainImage.style.opacity = '0.5';
            setTimeout(() => {
                mainImage.src = src;
                mainImage.style.opacity = '1';
            }, 150);

            // Update Active Thumbnail Border
            document.querySelectorAll('.gallery-thumb').forEach(el => {
                el.classList.remove('border-black', 'ring-2', 'ring-black/10', 'opacity-100');
                el.classList.add('border-transparent', 'opacity-70');
            });
            element.classList.remove('border-transparent', 'opacity-70');
            element.classList.add('border-black', 'ring-2', 'ring-black/10', 'opacity-100');
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            const img = document.getElementById('lightboxImage');
            lightbox.classList.add('opacity-0');
            img.classList.remove('scale-100');
            img.classList.add('scale-95');
            setTimeout(() => lightbox.classList.add('hidden'), 300);
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === "Escape") closeLightbox();
        });

        const scrollContainer = document.getElementById('categoryCarousel');
        if (scrollContainer) {
            document.getElementById('scrollLeft').addEventListener('click', () => { scrollContainer.scrollBy({ left: -350, behavior: 'smooth' }); });
            document.getElementById('scrollRight').addEventListener('click', () => { scrollContainer.scrollBy({ left: 350, behavior: 'smooth' }); });
        }

        function shareVehicle(model, url) {
            if (navigator.share) {
                navigator.share({ title: 'Automotriz Carmona', text: 'Mira este ' + model, url: url }).catch((e) => console.log('Error', e));
            } else {
                navigator.clipboard.writeText(url).then(() => alert('Enlace copiado'));
            }
        }
    </script>

    <!-- Mobile Bottom Bar -->
    <div
        class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        @if($whatsapp)
            <a href="{{ $link }}" target="_blank"
                class="flex-1 bg-[#25D366] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                <i class="fa-brands fa-whatsapp text-xl"></i> Cotizar
            </a>
        @endif
        <a href="tel:+56912345678"
            class="bg-gray-900 text-white w-14 rounded-xl flex items-center justify-center shadow-lg">
            <i class="fa-solid fa-phone"></i>
        </a>
    </div>

</x-app-layout>