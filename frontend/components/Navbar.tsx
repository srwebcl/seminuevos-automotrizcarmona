'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
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

    // Menu Categories (Hardcoded for now based on legacy)
    const menuCategories = [
        { name: 'Seminuevos', slug: 'seminuevos', isSpecial: true },
        { name: 'Autos Premium', slug: 'autos-premium', isSpecial: true },
        { name: 'Camionetas', slug: 'camionetas', isSpecial: false },
        { name: 'SUV', slug: 'suv', isSpecial: false },
        { name: 'Sedan', slug: 'sedan', isSpecial: false },
        { name: 'Ofertas', slug: 'ofertas', isSpecial: true },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/90 backdrop-blur-md border-white/10' : 'bg-black border-gray-900'} text-gray-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer relative z-50">
                        <Link href="/">
                            {/* Original Logo */}
                            <Image
                                src="/images/logo.png"
                                alt="Automotriz Carmona"
                                width={180}
                                height={60}
                                className="h-10 w-auto brightness-0 invert object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className={`text-gray-300 font-medium hover:text-white hover:scale-110 transition-all duration-300 text-sm ${pathname === '/' ? 'text-white' : ''}`}>
                            Inicio
                        </Link>

                        {menuCategories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={cat.isSpecial ? `/catalogo?category=${cat.slug}` : `/catalogo?category=${cat.slug}`} // Adjusted routing
                                className={`text-gray-300 font-medium hover:text-white hover:scale-110 transition-all duration-300 text-sm flex items-center gap-2 ${pathname.includes(cat.slug) ? 'text-premium-gold font-bold scale-110' : ''}`}
                            >
                                {cat.name.toLowerCase().includes('premium') && (
                                    <i className="fa-solid fa-crown text-premium-gold"></i>
                                )}
                                {cat.name}
                            </Link>
                        ))}
                        <Link href="/catalogo?category=camiones" className="text-gray-300 font-medium hover:text-white hover:scale-110 transition-all duration-300 text-sm">
                            Camiones
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/sucursales" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
                            Sucursales
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setOpen(!open)} className="text-gray-300 hover:text-white focus:outline-none p-2">
                            {open ? (
                                <i className="fa-solid fa-xmark text-2xl"></i>
                            ) : (
                                <i className="fa-solid fa-bars text-2xl"></i>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {open && (
                <div className="md:hidden bg-black border-t border-gray-800 absolute w-full left-0">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link href="/" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-md">
                            Inicio
                        </Link>
                        {menuCategories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/catalogo?category=${cat.slug}`}
                                className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-md flex items-center gap-2"
                                onClick={() => setOpen(false)}
                            >
                                {cat.name.toLowerCase().includes('premium') && (
                                    <i className="fa-solid fa-crown text-premium-gold"></i>
                                )}
                                {cat.name}
                            </Link>
                        ))}
                        <Link href="/catalogo?category=camiones" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-md">
                            Camiones
                        </Link>
                        <div className="pt-4 border-t border-gray-800 mt-2">
                            <Link href="/sucursales" className="block px-3 py-3 text-center bg-white text-black rounded-full font-bold">
                                Sucursales
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
