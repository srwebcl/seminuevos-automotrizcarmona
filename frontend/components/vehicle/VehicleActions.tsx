'use client';

import { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import FinancingModal from './FinancingModal';

interface VehicleActionsProps {
    vehicle: Vehicle;
    whatsappLink: string;
}

export default function VehicleActions({ vehicle, whatsappLink }: VehicleActionsProps) {
    const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);

    return (
        <>
            {/* Actions (Fixed Position in Card) */}
            <div className="flex flex-col gap-3 mt-6">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-[#128C7E] transition shadow-lg shadow-green-500/20 text-center flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                    <i className="fa-brands fa-whatsapp text-xl group-hover:scale-110 transition-transform"></i>
                    Cotizar por WhatsApp
                </a>
                <button
                    onClick={() => setIsFinancingModalOpen(true)}
                    className="w-full bg-black text-white font-bold py-3.5 px-8 rounded-xl hover:bg-gray-900 transition shadow-lg shadow-black/20 text-center flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <i className="fa-regular fa-credit-card"></i>
                    Solicitar Financiamiento
                </button>
            </div>

            <FinancingModal
                isOpen={isFinancingModalOpen}
                onClose={() => setIsFinancingModalOpen(false)}
                vehicle={vehicle}
            />
        </>
    );
}
