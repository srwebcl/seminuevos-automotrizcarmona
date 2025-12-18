import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-gray-900 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                    <div className="md:w-1/3">
                        <div className="h-12 flex items-center mb-6">
                            <span className="text-white font-black text-2xl italic tracking-tighter">CARMONA<span className="text-premium-gold">.</span></span>
                            {/* <img src="/images/logo.png" class="h-12 w-auto brightness-0 invert mb-6 opacity-90" /> */}
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Redefiniendo el estándar de seminuevos en Chile.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Explorar</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/catalogo" className="hover:text-white">Seminuevos</Link></li>
                                <li><Link href="/catalogo?is_premium=1" className="hover:text-premium-gold text-premium-gold font-bold">Premium</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Cliente</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="#" className="hover:text-white">Financiamiento</Link></li>
                                <li><Link href="#" className="hover:text-white">Vende tu auto</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Contacto</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li className="flex items-start gap-3">
                                    <i className="fa-solid fa-location-dot mt-1 text-premium-gold"></i>
                                    <span>Av. Balmaceda 3570,<br />La Serena</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <i className="fa-solid fa-envelope text-premium-gold"></i>
                                    <span>contacto@carmona.cl</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} Automotriz Carmona.</p>
                </div>
            </div>
        </footer>
    );
}
