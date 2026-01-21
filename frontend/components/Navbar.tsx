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

    // Menu Structure: Fixed Segments + Dynamic API Segments
    const menuItems = [
        { name: 'Seminuevos', slug: 'seminuevos', href: '/catalogo' },
        { name: 'Premium', slug: 'premium', href: '/catalogo?is_premium=1', isSpecial: true },
        // Dynamic segments from API
        ...categories.map(cat => ({
            name: cat.slug === 'camion' ? 'Camiones' : (cat.slug === 'moto' ? 'Motos' : (cat.slug === 'camioneta' ? 'Camionetas' : cat.name)), // Manual pluralization for menu
            slug: cat.slug,
            href: `/catalogo?category=${cat.slug}`
        }))
    ];

    return (
        <nav className={`fixed w-full z-[100] border-b bg-black/90 backdrop-blur-md border-white/10 text-white`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer relative z-50">
                        <Link href="/">
                            <Image
                                src="/images/logo.png"
                                alt="Automotriz Carmona"
                                width={180}
                                height={60}
                                className={`h-10 w-auto object-contain transition-all ${scrolled ? 'brightness-0 invert' : ''}`}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className={`text-sm font-bold uppercase tracking-widest hover:text-premium-gold transition-colors ${pathname === '/' ? 'text-premium-gold' : 'text-gray-300'}`}>
                            Inicio
                        </Link>

                        {menuItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.href}
                                className={`text-sm font-bold uppercase tracking-widest hover:text-premium-gold transition-colors flex items-center gap-2 ${pathname.includes(item.slug) ? 'text-premium-gold scale-105' : 'text-gray-300'} ${item.isSpecial ? 'text-premium-gold' : ''}`}
                            >
                                {item.name === 'Premium' && <i className="fa-solid fa-crown text-xs"></i>}
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/sucursales" className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition">
                            Sucursales
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setOpen(!open)} className="text-white focus:outline-none p-2" aria-label="Abrir menú de navegación">
                            {open ? <i className="fa-solid fa-xmark text-2xl"></i> : <i className="fa-solid fa-bars text-2xl"></i>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Full Screen Overlay */}
            {open && (
                <div className="md:hidden fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl animate-slide-down flex flex-col h-[100dvh]">
                    {/* Header inside overlay to match position */}
                    <div className="flex justify-between items-center px-4 h-20 border-b border-white/10 shrink-0">
                        <div className="flex-shrink-0 flex items-center">
                            <Image
                                src="/images/logo.png"
                                alt="Automotriz Carmona"
                                width={150}
                                height={50}
                                className="h-8 w-auto object-contain brightness-0 invert"
                            />
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white p-2 rounded-full hover:bg-white/10 transition" aria-label="Cerrar menú">
                            <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 flex flex-col justify-center items-center space-y-6 p-6 overflow-y-auto">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="text-2xl font-black text-white hover:text-premium-gold tracking-tight transition-all hover:scale-105"
                        >
                            INICIO
                        </Link>

                        {menuItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`text-2xl font-black tracking-tight transition-all hover:scale-105 flex items-center gap-3 ${item.isSpecial ? 'text-premium-gold' : 'text-white hover:text-premium-gold'}`}
                            >
                                {item.name === 'Premium' && <i className="fa-solid fa-crown text-xl"></i>}
                                {item.name.toUpperCase()}
                            </Link>
                        ))}

                        <div className="w-16 h-1 bg-white/10 rounded-full my-4"></div>

                        <Link
                            href="/sucursales"
                            onClick={() => setOpen(false)}
                            className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-premium-gold hover:text-white transition-all shadow-xl shadow-white/5"
                        >
                            Ver Sucursales
                        </Link>
                    </div>

                    {/* Footer Info in Menu */}
                    <div className="p-6 text-center text-gray-500 text-[10px] border-t border-white/5 shrink-0">
                        <p className="mb-2 uppercase tracking-wider">Automotriz Carmona & Cia</p>
                        <div className="flex justify-center gap-6 text-lg text-gray-400">
                            <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
