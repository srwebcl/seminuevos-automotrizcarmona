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
                        <button onClick={() => setOpen(!open)} className="text-white focus:outline-none p-2">
                            {open ? <i className="fa-solid fa-xmark text-2xl"></i> : <i className="fa-solid fa-bars text-2xl"></i>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {open && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6">
                    <div className="space-y-4">
                        <Link href="/" onClick={() => setOpen(false)} className="block text-xl font-bold text-white hover:text-premium-gold">
                            Inicio
                        </Link>
                        {menuItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`block text-xl font-bold hover:text-premium-gold flex items-center gap-2 ${item.isSpecial ? 'text-premium-gold' : 'text-white'}`}
                            >
                                {item.name === 'Premium' && <i className="fa-solid fa-crown"></i>}
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-6 border-t border-gray-800">
                            <Link href="/sucursales" onClick={() => setOpen(false)} className="block w-full text-center bg-white text-black py-3 rounded-xl font-bold uppercase tracking-widest">
                                Sucursales
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
