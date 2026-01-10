<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automotriz Carmona - Seminuevos & Premium</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>


    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Inter', sans-serif;
        }

        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>

@php
    $setting = \App\Models\SiteSetting::first();
    $mode = $setting ? $setting->seasonal_mode : 'none';
    $whatsappGlobal = \App\Models\WhatsappNumber::where('is_active', true)->first();
@endphp

<body class="antialiased bg-gray-50 theme-{{ $mode }}">

    <nav x-data="{ open: false, scrolled: false }" @scroll.window="scrolled = (window.pageYOffset > 20)"
        :class="{ 'bg-black/90 backdrop-blur-md border-white/10': scrolled, 'bg-black border-gray-900': !scrolled }"
        class="fixed w-full z-50 transition-all duration-300 border-b bg-black text-gray-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center cursor-pointer relative z-50">
                    <a href="{{ route('home') }}">
                        <img src="{{ asset('images/logo.png') }}" alt="Carmona y Cia"
                            class="h-10 w-auto brightness-0 invert">
                    </a>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="{{ route('home') }}"
                        class="text-gray-300 font-medium hover:text-white hover:scale-110 transition-all duration-300 text-sm">Inicio</a>

                    @php
                        $menuCategories = \App\Models\Category::where('is_menu_item', true)->orderBy('menu_order')->get();
                    @endphp

                    @foreach($menuCategories as $cat)
                        @php
                            $isSpecial = in_array($cat->slug, ['seminuevos', 'autos-premium', 'ofertas', 'liquidacion', 'motos', 'camiones']);
                            $url = $isSpecial ? url($cat->slug) : route('vehicles.category', $cat->slug);
                            $active = request()->is($cat->slug) || request()->is('categoria/' . $cat->slug);
                        @endphp
                        <a href="{{ $url }}"
                            class="text-gray-300 font-medium hover:text-white hover:scale-110 transition-all duration-300 text-sm flex items-center gap-2 {{ $active ? 'text-premium-gold font-bold scale-110' : '' }}">
                            @if(Str::contains(strtolower($cat->name), 'premium')) <i
                            class="fa-solid fa-crown text-premium-gold"></i> @endif
                            {{ $cat->name }}
                        </a>
                    @endforeach

                    {{-- Manual Link for Camiones --}}
                    @if(!$menuCategories->contains('slug', 'camiones'))
                        <a href="{{ url('/camiones') }}"
                            class="text-gray-300 font-medium hover:text-white hover:scale-110 transition-all duration-300 text-sm {{ request()->is('camiones') ? 'text-premium-gold font-bold scale-110' : '' }}">Camiones</a>
                    @endif
                </div>

                <!-- Desktop Actions -->
                <div class="hidden md:flex items-center space-x-4">
                    <a href="{{ route('locations.index') }}"
                        class="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">Sucursales</a>
                </div>

                <!-- Mobile Hamburger Button -->
                <div class="flex items-center md:hidden">
                    <button @click="open = !open" class="text-gray-300 hover:text-white focus:outline-none p-2">
                        <i class="fa-solid fa-bars text-2xl" x-show="!open"></i>
                        <i class="fa-solid fa-xmark text-2xl" x-show="open" style="display: none;"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div x-show="open" style="display: none;" class="md:hidden bg-black border-t border-gray-800"
            x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 -translate-y-2"
            x-transition:enter-end="opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-150"
            x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 -translate-y-2">
            <div class="px-4 pt-2 pb-6 space-y-1">
                <a href="{{ route('home') }}"
                    class="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-md">Inicio</a>

                @foreach($menuCategories as $cat)
                    @php
                        $isSpecial = in_array($cat->slug, ['seminuevos', 'autos-premium', 'ofertas', 'liquidacion', 'motos', 'camiones']);
                        $url = $isSpecial ? url($cat->slug) : route('vehicles.category', $cat->slug);
                    @endphp
                    <a href="{{ $url }}"
                        class="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-md flex items-center gap-2">
                        @if(Str::contains(strtolower($cat->name), 'premium')) <i
                        class="fa-solid fa-crown text-premium-gold"></i> @endif
                        {{ $cat->name }}
                    </a>
                @endforeach

                @if(!$menuCategories->contains('slug', 'camiones'))
                    <a href="{{ url('/camiones') }}"
                        class="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-md">Camiones</a>
                @endif

                <div class="pt-4 border-t border-gray-800 mt-2">
                    <a href="{{ route('locations.index') }}"
                        class="block px-3 py-3 text-center bg-white text-black rounded-full font-bold">Sucursales</a>
                </div>
            </div>
        </div>
    </nav>

    <div class="pt-20">
        {{ $slot }}
    </div>

    <footer class="bg-black text-white pt-24 pb-12 border-t border-gray-900 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div class="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                <div class="md:w-1/3">
                    <img src="{{ asset('images/logo.png') }}" class="h-12 w-auto brightness-0 invert mb-6 opacity-90">
                    <p class="text-gray-500 text-sm leading-relaxed mb-8">Redefiniendo el estándar de seminuevos en
                        Chile.</p>
                    <div class="flex gap-4">
                        <a href="#"
                            class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all"><i
                                class="fa-brands fa-instagram"></i></a>
                        <a href="#"
                            class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all"><i
                                class="fa-brands fa-facebook-f"></i></a>
                    </div>
                </div>
                <div class="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                        <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Explorar</h4>
                        <ul class="space-y-4 text-sm text-gray-500">
                            <li><a href="{{ route('vehicles.index') }}" class="hover:text-white">Seminuevos</a></li>
                            <li><a href="{{ route('vehicles.index', ['is_premium' => 1]) }}"
                                    class="hover:text-premium-gold text-premium-gold font-bold">Premium</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Cliente</h4>
                        <ul class="space-y-4 text-sm text-gray-500">
                            <li><a href="{{ route('financing.index') }}" class="hover:text-white">Financiamiento</a>
                            </li>
                            <li><a href="#" class="hover:text-white">Vende tu auto</a></li>
                        </ul>
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <h4 class="text-white font-bold uppercase text-xs tracking-wider mb-6">Contacto</h4>
                        <ul class="space-y-4 text-sm text-gray-500">
                            <li class="flex items-start gap-3"><i
                                    class="fa-solid fa-location-dot mt-1 text-premium-gold"></i><span>Av. Balmaceda
                                    3570,<br>La Serena</span></li>
                            <li class="flex items-center gap-3"><i
                                    class="fa-solid fa-envelope text-premium-gold"></i><span>contacto@carmona.cl</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div
                class="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                <p>© {{ date('Y') }} Automotriz Carmona.</p>
            </div>
        </div>
    </footer>

    @if($whatsappGlobal)
        <a href="https://wa.me/{{ $whatsappGlobal->phone }}?text=Hola,%20quisiera%20más%20información." target="_blank"
            class="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 animate-pulse-green">

            <i class="fa-brands fa-whatsapp text-4xl text-white"></i>

            <span
                class="absolute right-20 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none transform translate-x-2 group-hover:translate-x-0 duration-300">
                ¡Hablemos ahora! 👋
            </span>
        </a>
    @endif

    <script>
        AOS.init({ once: true, offset: 50, duration: 800 });

        // Script Festivo (Partículas Footer)
        document.addEventListener('DOMContentLoaded', () => {
            const body = document.body;
            const footer = document.querySelector('footer');
            let particleColors = [];

            if (body.classList.contains('theme-christmas')) particleColors = ['#D42426', '#165B33', '#FFD700', '#FFFFFF'];
            else if (body.classList.contains('theme-new_year')) particleColors = ['#FFD700', '#C0C0C0', '#FFFFFF', '#F0E68C'];
            else if (body.classList.contains('theme-18sept')) particleColors = ['#00338D', '#FFFFFF', '#D52B1E'];

            if (particleColors.length > 0 && footer) {
                setInterval(() => {
                    const x = Math.random() * footer.offsetWidth;
                    const y = Math.random() * footer.offsetHeight;
                    for (let i = 0; i < 20; i++) { // Menos partículas para que sea sutil
                        const particle = document.createElement('div');
                        particle.classList.add('festive-particle');
                        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
                        particle.style.backgroundColor = color;
                        particle.style.boxShadow = `0 0 4px ${color}`;
                        particle.style.left = x + 'px';
                        particle.style.top = y + 'px';

                        const angle = Math.random() * Math.PI * 2;
                        const velocity = Math.random() * 80 + 40;
                        const tx = Math.cos(angle) * velocity + 'px';
                        const ty = Math.sin(angle) * velocity + 'px';

                        particle.style.setProperty('--tx', tx);
                        particle.style.setProperty('--ty', ty);
                        footer.appendChild(particle);
                        setTimeout(() => particle.remove(), 1500);
                    }
                }, 1000); // Frecuencia más relajada
            }
        });

        function copyLink(url, btnElement) {
            navigator.clipboard.writeText(url).then(() => {
                const originalContent = btnElement.innerHTML;
                btnElement.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
                setTimeout(() => { btnElement.innerHTML = originalContent; }, 2000);
            }).catch(err => { alert('Copia manual: ' + url); });
        }
    </script>
</body>

</html>