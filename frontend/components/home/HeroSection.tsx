'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/catalogo?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* Fallback Image */}
                <Image
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
            </div>

            <div className="relative z-30 w-full max-w-4xl px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Tu próximo auto, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F9F1D8] via-[#D4AF37] to-[#996515] drop-shadow-md filter brightness-110">
                        está aquí.
                    </span>
                </h1>

                <div className="mt-10 relative max-w-2xl mx-auto group">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por marca, modelo o año..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pl-6 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-premium-gold transition-all shadow-xl"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-premium-gold rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                        >
                            <i className="fa-solid fa-search"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
