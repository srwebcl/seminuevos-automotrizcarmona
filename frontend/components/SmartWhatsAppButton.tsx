'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

export default function SmartWhatsAppButton() {
    const pathname = usePathname();
    const [showBubble, setShowBubble] = useState(false);
    const [config, setConfig] = useState({
        text: "¡Hola! ¿Necesitas ayuda con tu compra?",
        message: "Hola, estoy en el sitio web de Automotriz Carmona y me gustaría recibir asesoría."
    });

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
            // Normally we would get the car name here, but for global button we keep it generic or need context context.
            // Since this is a global layout component, we can use generic detail message or standard one.
            newConfig = {
                text: "¡Excelente elección! Cotízalo aquí.",
                message: "Hola, estoy viendo un auto en la web y me gustaría cotizarlo o agendar una visita."
            };
        } else if (pathname === '/financiamiento') {
            newConfig = {
                text: "¿Dudas con el crédito? Resuélvelas ahora.",
                message: "Hola, tengo dudas sobre las opciones de financiamiento."
            };
        } else if (pathname === '/vende-tu-auto') {
            newConfig = {
                text: "¿Quieres vender rápido? Escríbenos.",
                message: "Hola, quiero vender mi auto con ustedes / dejarlo en parte de pago."
            };
        }

        setConfig(newConfig);

        // Reset bubble state to animate again on route change
        setShowBubble(false);
        const timer = setTimeout(() => {
            setShowBubble(true);
        }, 2000); // Delay for user to settle

        return () => clearTimeout(timer);
    }, [pathname]);

    const handleCloseBubble = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBubble(false);
    };

    // Placeholder number - User needs to update this for the bot
    const whatsappNumber = "56912345678";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(config.message)}`;

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 group">

            {/* Context Bubble */}
            <div
                className={`
                    relative max-w-[250px] bg-white text-gray-800 p-4 rounded-2xl rounded-br-none shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100
                    transform transition-all duration-500 ease-out origin-bottom-right
                    ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
                `}
            >
                <button
                    onClick={handleCloseBubble}
                    className="absolute -top-2 -right-2 bg-gray-200 text-gray-500 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                >
                    <X size={12} />
                </button>
                <p className="text-sm font-medium leading-relaxed">
                    {config.text} 👋
                </p>

                {/* Tail for speech bubble */}
                <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 mask-triangle"></div>
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
