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
    // Lock body scroll when menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-transparent'} text-white`}>
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
                    <div className="flex items-center md:hidden z-[201]">
                        <button onClick={() => setOpen(!open)} className="text-white focus:outline-none p-2">
                            {open ? <i className="fa-solid fa-xmark text-3xl"></i> : <i className={`fa-solid fa-bars text-2xl ${scrolled ? 'text-white' : 'text-white drop-shadow-md'}`}></i>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Full Screen Overlay */}
            {open && (
                <div className="md:hidden fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl animate-slide-down flex flex-col justify-center items-center">

                    {/* Menu Items Container */}
                    <div className="flex flex-col items-center space-y-8 p-6 w-full">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="text-4xl font-black text-white hover:text-premium-gold tracking-tighter transition-all hover:scale-105 animate-fade-in"
                            style={{ animationDelay: '0.1s' }}
                        >
                            INICIO
                        </Link>

                        {menuItems.map((item, index) => (
                            <Link
                                key={item.slug}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`text-4xl font-black tracking-tighter transition-all hover:scale-105 flex items-center gap-3 animate-fade-in ${item.isSpecial ? 'text-premium-gold' : 'text-white hover:text-premium-gold'}`}
                                style={{ animationDelay: `${0.15 + (index * 0.05)}s` }}
                            >
                                {item.name === 'Premium' && <i className="fa-solid fa-crown text-2xl"></i>}
                                {item.name.toUpperCase()}
                            </Link>
                        ))}

                        <div className="w-20 h-1 bg-gray-800 rounded-full my-8 animate-fade-in" style={{ animationDelay: '0.4s' }}></div>

                        <Link
                            href="/sucursales"
                            onClick={() => setOpen(false)}
                            className="bg-white text-black px-10 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-premium-gold hover:text-white transition-all shadow-2xl shadow-white/5 animate-fade-in"
                            style={{ animationDelay: '0.5s' }}
                        >
                            Ver Sucursales
                        </Link>

                        {/* Social Footer */}
                        <div className="flex gap-8 text-2xl text-gray-500 mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
