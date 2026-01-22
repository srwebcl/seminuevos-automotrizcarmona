'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MessageCircle, X } from 'lucide-react';
import { WhatsappNumber } from '@/lib/api';

interface SmartWhatsAppButtonProps {
    numbers?: WhatsappNumber[];
}

export default function SmartWhatsAppButton({ numbers = [] }: SmartWhatsAppButtonProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showBubble, setShowBubble] = useState(false);
    const [config, setConfig] = useState({
        text: "¡Hola! ¿Necesitas ayuda con tu compra?",
        message: "Hola, estoy en el sitio web de Automotriz Carmona y me gustaría recibir asesoría."
    });
    const [selectedNumber, setSelectedNumber] = useState<string>("56912345678"); // Default fallback

    // Logic to select the best WhatsApp number
    useEffect(() => {
        if (!numbers || numbers.length === 0) return;

        // Context Detection
        const isPremiumContext =
            pathname.includes('premium') ||
            (searchParams.get('is_premium') === '1') ||
            (pathname.includes('/auto/')); // Assuming looking at a specific car might warrant premium checks, but for now we trust the tagging.

        // Actually, the user rule is: "X numero solo recibe autos premium". 
        // So if (isPremiumContext) -> Use specific pool? Or use ALL pool?
        // Usually: Premium numbers for Premium context. General numbers for General context.
        // We will define: 
        // Premium Context = Looking at Premium Catalog or Explicitly Premium.

        // Filter Numbers
        let availableNumbers = [];

        if (isPremiumContext) {
            // In premium context, we prioritize premium numbers. 
            // If there are premium-only numbers, use ONLY them? Or mix with general?
            // "X numero solo reciba autos premium" implies this number CANNOT start a conversation from a non-premium page.
            // It does NOT imply that a general number cannot receive a premium lead.
            // BUT usually you want the specialized executive.
            // Let's filter: Include 'for_premium_only' numbers AND general numbers? 
            // Or just 'for_premium_only' if available?
            // Let's try: If premium context, include ALL numbers (unless we strictly want to segregate executives).
            // Let's interpret "X number ONLY receives premium" as: This number shows up ONLY on premium pages.
            // General numbers show up everywhere? Or ONLY on general pages?
            // User: "si implemento más de 2 números se deben asociar, pero de forma aleatoria"
            // Let's assume:
            // Premium Page -> Pool includes Premium-only numbers + General numbers.
            // Regular Page -> Pool includes ONLY General numbers (exclude Premium-only).

            // Wait, if I have a "Premium Executive", I probably want them to handle Premium.
            // If I have a "General Executive", they handle General.
            // Ideally: Premium Page -> Random(Premium Numbers). If none, Random(General).
            // General Page -> Random(General Numbers).

            const premiumNumbers = numbers.filter(n => n.for_premium_only);
            if (premiumNumbers.length > 0) {
                availableNumbers = premiumNumbers;
            } else {
                availableNumbers = numbers.filter(n => !n.for_premium_only);
            }
        } else {
            // General Context -> Exclude Premium-only numbers
            availableNumbers = numbers.filter(n => !n.for_premium_only);
        }

        // Fallback if no numbers available after filter (shouldn't happen if data exists)
        if (availableNumbers.length === 0) availableNumbers = numbers;

        // Select Random
        if (availableNumbers.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            setSelectedNumber(availableNumbers[randomIndex].number);
        }

    }, [pathname, searchParams, numbers]);

    useEffect(() => {
        // Dynamic Logic based on Path
        let newConfig = {
            text: "¡Hola! ¿Buscas tu próximo auto?",
            message: "Hola, vengo de la web y me gustaría ver opciones de autos."
        };

        if (pathname === '/catalogo') {
            newConfig = {
                text: "¿Buscas un modelo específico? Te ayudo.",
                message: "Hola, estoy revisando el catálogo web y busco un auto específico."
            };
        } else if (pathname.startsWith('/auto/')) {
            const slug = pathname.split('/auto/')[1];
            if (slug) {
                // Intelligent Name Cleaning
                // Stops at years, technical terms, or engine sizes
                const parts = slug.split('-');
                const cleanParts = [];

                const stopTerms = new Set([
                    'cd', 'cc', 'cs', '4x2', '4x4', 'awd', 'wd',
                    'aut', 'mec', 'at', 'mt', 'cvt',
                    'full', 'base', 'sport', 'limited', 'ltd', 'xls', 'gli', 'glx', 'sel', 'xli', 'lx', 'sx', 'ga', 'gl',
                    'bluehdi', 'tdi', 'tfsi', 'tsi', 'hdi',
                    'v6', 'v8', 'turbo'
                ]);

                for (const part of parts) {
                    // Check for Year (2010-2030)
                    if (/^20[1-3][0-9]$/.test(part)) break;
                    // Check for Engine (1.6, 2.0, etc)
                    if (/^[0-9]\.[0-9]$/.test(part)) break;
                    // Check for plain numbers that might be versions (e.g. 1500)
                    if (/^\d{3,}$/.test(part)) break;
                    // Check for stop terms
                    if (stopTerms.has(part.toLowerCase())) break;

                    // Capitalize and add
                    cleanParts.push(part.charAt(0).toUpperCase() + part.slice(1));

                    // Safety limit: rarely more than 3 words for Brand + Model (e.g. Land Rover Discovery)
                    if (cleanParts.length >= 3) break;
                }

                const modelName = cleanParts.join(' ');

                newConfig = {
                    text: `¿Quieres más info del ${modelName}?`,
                    message: `Hola, estoy viendo el ${modelName} en la web y me gustaría más información.`
                };
            } else {
                newConfig = {
                    text: "¡Excelente elección! Cotízalo aquí.",
                    message: "Hola, estoy viendo un auto en la web y me gustaría cotizarlo o agendar una visita."
                };
            }
        } else if (pathname === '/financiamiento') {
            newConfig = {
                text: "¿Dudas con el crédito? Resuélvelas ahora.",
                message: "Hola, tengo dudas sobre las opciones de financiamiento."
            };
        } else if (pathname === '/parte-de-pago' || pathname === '/vendenos-tu-auto') {
            newConfig = {
                text: "¿Quieres vender rápido? Escríbenos.",
                message: "Hola, quiero vender mi auto con ustedes / dejarlo en parte de pago."
            };
        }

        setConfig(newConfig);

        // Initial bubble state
        setShowBubble(true);
    }, [pathname]);

    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCloseBubble = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBubble(false);
    };

    const whatsappLink = `https://wa.me/${selectedNumber}?text=${encodeURIComponent(config.message)}`;

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 group">

            {/* Context Bubble */}
            <div
                className={`
                    relative max-w-[280px] max-w-[85vw] bg-white text-gray-800 p-5 rounded-[2rem] rounded-br-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100
                    transform transition-all duration-500 ease-out origin-bottom
                    ${showBubble && hasScrolled ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8 pointer-events-none'}
                `}
            >
                <button
                    onClick={handleCloseBubble}
                    className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full p-1.5 transition-colors"
                >
                    <X size={14} />
                </button>
                <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md relative">
                            <Image
                                src="/images/ejecutivo_whatsapp.png"
                                alt="Ejecutivo Carmona"
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-gray-900 mb-0.5">Asesor Virtual</p>
                        <p className="text-[13px] font-medium leading-snug text-gray-600">
                            {config.text} 👋
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Button */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#25D366] to-[#128C7E] rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group-hover:animate-pulse-green"
                aria-label="Contactar por WhatsApp"
            >
                <i className="fa-brands fa-whatsapp text-white text-3xl"></i>

                {/* Ping Animation Wrapper */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-20 animate-ping duration-1000 -z-10"></span>
            </a>
        </div>
    );
}

