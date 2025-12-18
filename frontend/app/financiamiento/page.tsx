import Image from 'next/image';

export const metadata = {
    title: 'Financiamiento Automotriz | Automotriz Carmona',
    description: 'Facilitamos la compra de tu próximo vehículo con las mejores opciones de financiamiento del mercado.',
};

export default function FinancingPage() {
    return (
        <main>
            <div className="relative bg-black py-24 text-center text-white">
                <div className="absolute inset-0 overflow-hidden opacity-50">
                    <Image
                        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1920"
                        alt="Background Financiamiento"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Financiamiento Automotriz</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">Facilitamos la compra de tu próximo vehículo con las mejores opciones del mercado.</p>
                </div>
            </div>

            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Por qué financiar con Carmona?</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">Trabajamos con las principales entidades financieras del país para entregarte una evaluación rápida, flexible y ajustada a tu presupuesto. Gestionamos todo el proceso para que solo te preocupes de disfrutar tu auto.</p>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-bolt text-premium-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Evaluación Express</h3>
                                        <p className="text-gray-500 text-sm mt-1">Obtén tu pre-aprobación en minutos, solo con tu RUT.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-percent text-premium-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Tasas Preferenciales</h3>
                                        <p className="text-gray-500 text-sm mt-1">Accede a condiciones exclusivas gracias a nuestros convenios.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-premium-gold/10 flex items-center justify-center shrink-0">
                                        <i className="fa-regular fa-calendar-check text-premium-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Flexibilidad de Pago</h3>
                                        <p className="text-gray-500 text-sm mt-1">Cuotas fijas, meses de gracia y opciones de renovación.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/20 to-transparent rounded-3xl transform translate-x-4 translate-y-4"></div>
                            <div className="relative rounded-3xl shadow-2xl overflow-hidden aspect-[4/3]">
                                <Image
                                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000"
                                    alt="Financiamiento"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Requisitos Generales</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <i className="fa-solid fa-id-card text-4xl text-gray-300 mb-6"></i>
                            <h3 className="font-bold text-gray-900 mb-2">Identidad</h3>
                            <p className="text-sm text-gray-500">Cédula de identidad vigente y sin bloqueos.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <i className="fa-solid fa-file-invoice-dollar text-4xl text-gray-300 mb-6"></i>
                            <h3 className="font-bold text-gray-900 mb-2">Renta</h3>
                            <p className="text-sm text-gray-500">Acreditación de ingresos (Liquidaciones o Carpeta Tributaria).</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <i className="fa-solid fa-house-chimney text-4xl text-gray-300 mb-6"></i>
                            <h3 className="font-bold text-gray-900 mb-2">Domicilio</h3>
                            <p className="text-sm text-gray-500">Comprobante de domicilio a nombre del titular.</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <a href="https://wa.me/?text=Hola,%20quiero%20evaluar%20un%20financiamiento" target="_blank"
                            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-premium-gold hover:text-black transition shadow-xl hover:shadow-premium-gold/20 transform hover:-translate-y-1">
                            <i className="fa-brands fa-whatsapp text-2xl"></i>
                            Solicitar Evaluación Ahora
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

