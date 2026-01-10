'use client';

import { useState } from 'react';
import { Vehicle } from '@/types/vehicle';

interface FinancingModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle;
}

export default function FinancingModal({ isOpen, onClose, vehicle }: FinancingModalProps) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        rut: '',
        email: '',
        phone: '',
        salary: '',
        downPayment: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Datos enviados:', { ...formData, vehicle_id: vehicle.id, vehicle_name: `${vehicle.brand.name} ${vehicle.model}` });

        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl scale-in-95 animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-check text-2xl text-green-600"></i>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">¡Solicitud Recibida!</h3>
                    <p className="text-gray-500 mb-6">Hemos recibido tus datos correctamente. Un ejecutivo comercial te contactará a la brevedad para gestionar el financiamiento de tu <strong>{vehicle.brand.name} {vehicle.model}</strong>.</p>
                    <button
                        onClick={onClose}
                        className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-lg shadow-black/20"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative scale-in-95 animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition z-10"
                >
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Vehicle Summary */}
                    <div className="bg-gray-50 p-6 md:w-2/5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estas cotizando</span>
                        <h3 className="text-xl font-black text-gray-900 leading-tight mb-4">
                            {vehicle.brand.name} <br />
                            <span className="text-gray-500">{vehicle.model}</span>
                        </h3>

                        <div className="relative aspect-video bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={vehicle.cover_photo || '/images/placeholder-car.jpg'}
                                alt={vehicle.model}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Precio Lista</span>
                                <span className="font-bold text-gray-900">{vehicle.price_formatted}</span>
                            </div>
                            {vehicle.price_financing_formatted && (
                                <div className="flex justify-between text-blue-600">
                                    <span className="font-bold"><i className="fa-solid fa-star"></i> Financiamiento</span>
                                    <span className="font-black">{vehicle.price_financing_formatted}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <span className="block text-gray-400 text-[10px] uppercase">Referencia</span>
                                <span className="font-mono font-bold text-gray-600">#{vehicle.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="p-6 md:w-3/5">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-gray-900 mb-1">Solicitar Evaluación</h2>
                            <p className="text-sm text-gray-500">Completa tus datos para pre-evaluar tu crédito automotriz.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">RUT</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        placeholder="12.345.678-9"
                                        value={formData.rut}
                                        onChange={e => setFormData({ ...formData, rut: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        placeholder="nombre@correo.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        placeholder="+56 9..."
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Renta Líquida</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        placeholder="$"
                                        value={formData.salary}
                                        onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pie Inicial</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                        placeholder="$"
                                        value={formData.downPayment}
                                        onChange={e => setFormData({ ...formData, downPayment: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow-lg shadow-black/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i> Enviando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-regular fa-paper-plane"></i> Enviar Solicitud
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center leading-tight mt-2">
                                Al enviar esta solicitud aceptas ser contactado para fines de evaluación crediticia.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
