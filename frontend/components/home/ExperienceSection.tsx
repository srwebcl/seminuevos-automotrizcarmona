export default function ExperienceSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-black">
                {/* Fallback pattern/image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Experiencia <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Carmona</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg">
                    Más que un auto, te entregamos la tranquilidad de un servicio integral.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition hover:-translate-y-2 duration-300 group">
                        <div className="w-16 h-16 mx-auto bg-premium-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <i className="fa-solid fa-file-invoice-dollar text-3xl text-premium-gold"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Financiamiento</h3>
                        <p className="text-gray-400 text-sm">Gestionamos tu crédito con las tasas más competitivas.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition hover:-translate-y-2 duration-300 group">
                        <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <i className="fa-solid fa-car-on text-3xl text-blue-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Retoma Express</h3>
                        <p className="text-gray-400 text-sm">Deja tu auto en parte de pago. Tasación inmediata.</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition hover:-translate-y-2 duration-300 group">
                        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <i className="fa-solid fa-certificate text-3xl text-green-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Garantía Mecánica</h3>
                        <p className="text-gray-400 text-sm">Inspección de 100 puntos y respaldo total.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
