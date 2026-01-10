'use client';

import { useState } from 'react';

export default function SellCarPage() {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        version: '',
        mileage: '',
        color: '',
        price: '',
        name: '',
        phone: '',
        email: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="relative h-[500px] md:h-[600px] bg-black text-white overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0 opacity-60">
                    <img
                        src="/images/vendenos.png"
                        alt="Vende tu auto Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-0"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-2xl">
                        Véndenos tu <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] via-[#D4AF37] to-[#8A6E2F] filter brightness-125">Auto</span>
                    </h1>
                    <p className="text-xl md:text-3xl font-light text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                        Transformamos tu auto en efectivo de forma rápida y segura.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Form Column (Main - Left) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-car-side text-lg"></i>
                                Datos del Vehículo
                            </h2>

                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fa-solid fa-check text-3xl text-green-600"></i>
                                    </div>
                                    <h3 className="font-bold text-2xl text-gray-900 mb-2">¡Datos Recibidos!</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                        Hemos recibido la información de tu vehículo. Uno de nuestros tasadores te contactará en breve para darte una oferta.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                                    >
                                        Cotizar otro auto
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Marca</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                placeholder="Ej. Toyota"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Modelo</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                placeholder="Ej. RAV4"
                                                value={formData.model}
                                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Año</label>
                                            <input
                                                type="number"
                                                required
                                                min="2010"
                                                max="2025"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                placeholder="Ej. 2020"
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Versión (Opcional)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                placeholder="Ej. 2.0 LE Aut"
                                                value={formData.version}
                                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Kilometraje</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                placeholder="Ej. 45.000"
                                                value={formData.mileage}
                                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Precio Esperado</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                placeholder="$"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6 mt-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Datos de Contacto</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Tu Nombre</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                    placeholder="Nombre y Apellido"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                    placeholder="+56 9"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Correo Electrónico</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                                                    placeholder="correo@ejemplo.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-black text-white font-black uppercase tracking-wide py-4.5 rounded-xl hover:bg-gray-900 transition shadow-lg shadow-black/20 text-lg flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                                        Enviar Datos
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Info Column (Right - Sticky) */}
                    <div className="lg:col-span-5 space-y-8 sticky top-24">

                        {/* Option 1 */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:border-black transition duration-300">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[100px] transition-colors group-hover:bg-black group-hover:text-white flex items-start justify-end p-4">
                                <i className="fa-solid fa-hand-holding-dollar text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-black uppercase mb-4 pr-16">Tasación Rápida</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Si necesitas vender rápido, tasamos tu auto en 30 minutos. Te ofrecemos un pago seguro y rápido una vez validado todo.
                            </p>
                            <ul className="text-sm space-y-2 text-gray-500">
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Transferencia en notaría</li>
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-green-500"></i> Pago electrónico seguro</li>
                            </ul>
                        </div>

                        {/* Option 2 */}
                        <div className="bg-black text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-800 rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[100px] flex items-start justify-end p-4">
                                <i className="fa-solid fa-store text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-black uppercase mb-4 pr-16">Consignación</h3>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                Déjanos la venta a nosotros. Publicamos tu auto en todos nuestros portales, gestionamos visitas y negociamos por ti para obtener el mejor precio.
                            </p>
                            <ul className="text-sm space-y-2 text-gray-400">
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#D4AF37]"></i> Mayor valor de venta</li>
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#D4AF37]"></i> Tu auto queda seguro</li>
                            </ul>
                        </div>

                        {/* Conditions */}
                        <div className="bg-gray-100 rounded-3xl p-6 md:p-8">
                            <h3 className="font-bold uppercase text-gray-900 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-circle-exclamation"></i> Condiciones
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></span>
                                    Año 2016 en adelante (sujeto a evaluación).
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></span>
                                    Papeles al día y sin multas.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0"></span>
                                    Sin siniestros estructurales graves.
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
