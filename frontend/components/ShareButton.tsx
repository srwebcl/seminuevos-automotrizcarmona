'use client';

import { useState } from 'react';

interface ShareButtonProps {
    title: string;
    slug: string;
    brand: string;
    model: string;
    year: number;
    price: string;
    variant?: 'row' | 'stack'; // Added variant prop
}

export default function ShareButton({ title, slug, brand, model, year, price, variant = 'row' }: ShareButtonProps) {
    const [showCopied, setShowCopied] = useState(false);

    const vehicleUrl = typeof window !== 'undefined' ? `${window.location.origin}/auto/${slug}` : '';
    const shareText = `Mira este ${brand} ${model} (${year}) - ${price} en Automotriz Carmona: ${vehicleUrl}`;

    const handleWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(vehicleUrl);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code: ', err);
        }
    };

    const [isOpen, setIsOpen] = useState(false);

    if (variant === 'stack') {
        return (
            <div className="relative group/share">
                {/* Options Menu (Pop-up) - Sophisticated Glassmorphism */}
                {isOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex gap-2 bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-200 z-[60]">
                        {/* WhatsApp Button */}
                        <button
                            onClick={handleWhatsApp}
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-[#25D366]/20"
                            aria-label="Compartir en WhatsApp"
                        >
                            <i className="fa-brands fa-whatsapp text-lg"></i>
                        </button>

                        {/* Copy Link Button */}
                        <button
                            onClick={handleCopy}
                            className="w-9 h-9 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/5"
                            aria-label="Copiar enlace"
                        >
                            <i className={`fa-solid ${showCopied ? 'fa-check text-green-400' : 'fa-link'} text-sm`}></i>
                        </button>

                        {/* Little arrow down */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black/90 backdrop-blur-xl border-r border-b border-white/10 rotate-45"></div>
                    </div>
                )}

                {/* Main Toggle Button - Improved Style & Icon */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${isOpen ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-900 hover:bg-gray-50'} relative group/btn`}
                    aria-label="Abrir opciones de compartir"
                >
                    <i className="fa-solid fa-share-nodes text-[14px]"></i>

                    {/* Tooltip on Hover - Only for Button */}
                    {!isOpen && (
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none translate-y-1 group-hover/btn:translate-y-0 shadow-xl z-50">
                            Compartir
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
                        </span>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
                Compartir
            </span>

            {/* WhatsApp Button */}
            <button
                onClick={handleWhatsApp}
                className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition flex items-center justify-center relative group"
                aria-label="Compartir en WhatsApp"
            >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                    WhatsApp
                </span>
            </button>

            {/* Copy Link Button */}
            <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition flex items-center justify-center relative group"
                aria-label="Copiar enlace"
            >
                <i className={`fa-solid ${showCopied ? 'fa-check text-green-500' : 'fa-link'} text-xs`}></i>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                    {showCopied ? '¡Copiado!' : 'Copiar Link'}
                </span>
            </button>
        </div>
    );
}
