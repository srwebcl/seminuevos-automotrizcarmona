'use client';

import { useState } from 'react';

export default function FinancingPage() {
    const [formData, setFormData] = useState({
        name: '',
        rut: '',
        phone: '',
        email: '',
        renta: '',
        pie: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'financing',
                    data: formData
                })
            });

            if (!response.ok) throw new Error('Error al enviar');

            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Header/Hero for Financing */}
            <div className="relative h-[500px] md:h-[600px] bg-black text-white overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0 opacity-60">
                    <img
                        src="/images/financiamiento.png"
                        alt="Financiamiento Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-0"></div>
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-2xl">
                        Financiamiento <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D1] via-[#D4AF37] to-[#8A6E2F] filter brightness-125">Automotriz</span>
                    </h1>
                    <p className="text-xl md:text-3xl font-light text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                        Obtén tu crédito de forma rápida, segura y 100% online.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Content Column (Information) */}
                    <div className="lg:col-span-7 space-y-12">

                        {/* Benefits/Intro */}
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black">
                                    <i className="fa-solid fa-hand-holding-dollar"></i>
                                </span>
                                ¿Por qué financiar con nosotros?
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fa-solid fa-bolt text-3xl mb-4 text-[#D4AF37]"></i>
                                    <h3 className="font-bold text-lg mb-2">Aprobación Rápida</h3>
                                    <p className="text-gray-500 text-sm">Evaluamos tu solicitud en tiempo récord para que disfrutes tu auto cuanto antes.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fa-solid fa-percent text-3xl mb-4 text-[#D4AF37]"></i>
                                    <h3 className="font-bold text-lg mb-2">Tasas Preferenciales</h3>
                                    <p className="text-gray-500 text-sm">Accede a condiciones exclusivas gracias a nuestros convenios comerciales.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fa-solid fa-file-contract text-3xl mb-4 text-[#D4AF37]"></i>
                                    <h3 className="font-bold text-lg mb-2">Trámite Simplificado</h3>
                                    <p className="text-gray-500 text-sm">Nos encargamos de toda la gestión administrativa y notarial.</p>
                                </div>
                            </div>
                        </section>

                        {/* Requirements */}
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black">
                                    <i className="fa-solid fa-list-check"></i>
                                </span>
                                Requisitos
                            </h2>
                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 md:p-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-bold text-nav-item uppercase mb-4 border-b pb-2">Trabajador Dependiente</h3>
                                        <ul className="space-y-3">
                                            {[
                                                'Cédula de Identidad vigente',
                                                '6 últimas liquidaciones de sueldo',
                                                'Certificado de AFP (12 últimas cotizaciones)',
                                                'Comprobante de domicilio',
                                                'Antigüedad laboral mínima de 1 año'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <i className="fa-solid fa-check text-green-500"></i> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-nav-item uppercase mb-4 border-b pb-2">Trabajador Independiente</h3>
                                        <ul className="space-y-3">
                                            {[
                                                'Cédula de Identidad vigente',
                                                'Carpeta Tributaria',
                                                '2 últimos formularios 29 (IVA)',
                                                'Declaración de Renta anual (DAI)',
                                                'Comprobante de domicilio'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <i className="fa-solid fa-check text-green-500"></i> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ */}
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black">
                                    <i className="fa-regular fa-circle-question"></i>
                                </span>
                                Preguntas Frecuentes
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition">
                                    <h4 className="font-bold text-base mb-2">¿Cuál es el pie mínimo?</h4>
                                    <p className="text-gray-600 text-sm">Generalmente solicitamos un pie mínimo del 20% del valor del vehículo, sujeto a evaluación crediticia.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition">
                                    <h4 className="font-bold text-base mb-2">¿Puedo dar mi auto en parte de pago?</h4>
                                    <p className="text-gray-600 text-sm">¡Sí! Recibimos tu auto como parte del pie inicial. Lo tasamos al mejor precio de mercado.</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition">
                                    <h4 className="font-bold text-base mb-2">¿Hasta cuántas cuotas puedo pagar?</h4>
                                    <p className="text-gray-600 text-sm">Ofrecemos financiamiento desde 12 hasta 60 cuotas, dependiendo del año del vehículo y tu perfil.</p>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Form Column (Sticky) */}
                    <div className="lg:col-span-5 sticky top-24">
                        <div className="bg-black text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            {/* Decorative blurry blob */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37] rounded-full blur-[80px] opacity-30"></div>

                            <h2 className="text-2xl font-black uppercase mb-2 relative z-10">Evalúate Ahora</h2>
                            <p className="text-gray-400 text-sm mb-6 relative z-10">Completa tus datos y un ejecutivo te contactará hoy mismo.</p>

                            {submitted ? (
                                <div className="bg-white/10 rounded-xl p-6 text-center animate-in fade-in">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fa-solid fa-check text-xl text-white"></i>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">¡Solicitud Enviada!</h3>
                                    <p className="text-gray-300 text-sm">Te contactaremos a la brevedad.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-xs text-gray-400 underline hover:text-white"
                                    >
                                        Enviar otra solicitud
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/20 transition"
                                            placeholder="Tu nombre completo"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">RUT</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/20 transition"
                                            placeholder="12.345.678-9"
                                            value={formData.rut}
                                            onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Teléfono</label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/20 transition"
                                                placeholder="+56 9"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Renta (Aprox)</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/20 transition"
                                                placeholder="$"
                                                value={formData.renta}
                                                onChange={(e) => setFormData({ ...formData, renta: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Correo</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/20 transition"
                                            placeholder="nombre@correo.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pie Disponible</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/20 transition"
                                            placeholder="$ Tienes algún monto?"
                                            value={formData.pie}
                                            onChange={(e) => setFormData({ ...formData, pie: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black font-black uppercase tracking-wide py-4 rounded-xl hover:bg-gray-200 transition shadow-lg mt-4 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-regular fa-paper-plane"></i>}
                                        Enviar Solicitud
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
