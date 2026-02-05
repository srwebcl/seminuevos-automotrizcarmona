'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { VehicleCategory } from '@/types/vehicle';

interface NavbarProps {
    categories?: VehicleCategory[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Definición de ítems del menú central
    const menuItems: { name: string; slug: string; href: string; isSpecial?: boolean }[] = [
        { name: 'Seminuevos', slug: 'seminuevos', href: '/catalogo' },
        { name: 'Premium', slug: 'premium', href: '/catalogo?is_premium=1', isSpecial: true },
        // Segmentos dinámicos desde la API
        ...categories.map(cat => ({
            name: cat.slug === 'camion' ? 'Camiones' : (cat.slug === 'moto' ? 'Motos' : (cat.slug === 'camioneta' ? 'Camionetas' : cat.name)),
            slug: cat.slug,
            href: `/catalogo?category=${cat.slug}`
        }))
    ];

    return (
        <nav className={`fixed w-full z-[100] border-b bg-black/90 backdrop-blur-md border-white/10 text-white transition-all duration-300`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* 1. LOGO (Izquierda) */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer relative z-50">
                        <Link href="/">
                            <Image
                                src="/images/logo.png"
                                alt="Automotriz Carmona"
                                width={160}
                                height={50}
                                className={`h-9 w-auto object-contain transition-all ${scrolled ? 'brightness-0 invert' : ''}`}
                                priority
                            />
                        </Link>
                    </div>

                    {/* 2. MENÚ CENTRAL (Navegación) */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        <Link href="/" className={`text-sm font-bold uppercase tracking-widest hover:text-premium-gold transition-colors ${pathname === '/' ? 'text-premium-gold' : 'text-gray-300'}`}>
                            Inicio
                        </Link>

                        {menuItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.href}
                                className={`text-sm font-bold uppercase tracking-widest hover:text-premium-gold transition-colors flex items-center gap-1.5 ${pathname.includes(item.slug) ? 'text-premium-gold scale-105' : 'text-gray-300'} ${item.isSpecial ? 'text-premium-gold' : ''}`}
                            >
                                {item.name === 'Premium' && <i className="fa-solid fa-crown text-xs"></i>}
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* 3. ACCIONES (Derecha) - ESTRATEGIA DE DOS BOTONES */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Botón Secundario: Autos 0 KM (Outline) */}
                        <a
                            href="https://www.automotrizcarmona.cl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-4 py-2 rounded-full border border-white/20 hover:border-premium-gold hover:bg-premium-gold/10 text-white transition-all duration-300 flex items-center gap-2"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest group-hover:text-premium-gold">Autos 0 KM</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs text-gray-400 group-hover:text-premium-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                        </a>

                        {/* Botón Primario: Sucursales (Sólido) */}
                        <Link
                            href="/sucursales"
                            className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        >
                            Sucursales
                        </Link>
                    </div>

                    {/* Botón Hamburguesa (Móvil) */}
                    <div className="flex items-center lg:hidden">
                        <button onClick={() => setOpen(!open)} className="text-white focus:outline-none p-2" aria-label="Abrir menú">
                            {open ? <i className="fa-solid fa-xmark text-2xl"></i> : <i className="fa-solid fa-bars text-2xl"></i>}
                        </button>
                    </div>
                </div>
            </div>

            {/* MENÚ MÓVIL (Full Screen Overlay) */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl animate-slide-down flex flex-col h-[100dvh]">
                    <div className="flex justify-between items-center px-4 h-20 border-b border-white/10 shrink-0">
                        <div className="flex-shrink-0 flex items-center">
                            <Image src="/images/logo.png" alt="Carmona" width={140} height={40} className="h-8 w-auto object-contain brightness-0 invert" />
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white p-2 rounded-full hover:bg-white/10 transition">
                            <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center space-y-6 p-6 overflow-y-auto">
                        <Link href="/" onClick={() => setOpen(false)} className="text-2xl font-black text-white hover:text-premium-gold tracking-tight">INICIO</Link>
                        {menuItems.map((item) => (
                            <Link key={item.slug} href={item.href} onClick={() => setOpen(false)} className={`text-2xl font-black tracking-tight ${item.isSpecial ? 'text-premium-gold' : 'text-white hover:text-premium-gold'}`}>
                                {item.name.toUpperCase()} {item.isSpecial && <i className="fa-solid fa-crown ml-2"></i>}
                            </Link>
                        ))}

                        <div className="w-12 h-0.5 bg-white/20 my-4"></div>

                        {/* Acciones Móviles */}
                        <a href="https://www.automotrizcarmona.cl" target="_blank" className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2 uppercase tracking-widest border border-white/20 px-6 py-3 rounded-full">
                            <span>Ir a Autos 0 KM</span>
                            <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>

                        <Link href="/sucursales" onClick={() => setOpen(false)} className="bg-white text-black px-10 py-3 rounded-full text-sm font-black uppercase tracking-widest hover:bg-premium-gold hover:text-white transition-all">
                            VER SUCURSALES
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}