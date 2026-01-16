import Link from 'next/link';
import Image from 'next/image';
import { Settings } from '../lib/api';

interface FooterProps {
    settings?: Settings;
}

export default function Footer({ settings }: FooterProps) {
    const defaultAddress = 'Av. Balmaceda 3570, La Serena';


    // Fallback locations if none from API
    const locations = settings?.locations && settings.locations.length > 0
        ? settings.locations
        : [{ name: 'Casa Matriz', address: defaultAddress, city: 'La Serena' }];

    const socialLinks = settings?.social_links || {};

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-gray-900 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                    <div className="md:w-1/3">
                        <div className="h-12 flex items-center mb-6">
                            <Image
                                src="/images/logo.png"
                                alt="Automotriz Carmona"
                                width={180}
                                height={60}
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Redefiniendo el estándar de seminuevos en Chile.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            )}
                            {socialLinks.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all">
                                    <i className="fa-brands fa-linkedin-in"></i>
                                </a>
                            )}
                            {socialLinks.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-premium-gold hover:text-black transition-all">
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Explorar</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/catalogo" className="hover:text-white">Todo el Stock</Link></li>
                                {settings?.main_categories?.map(cat => (
                                    <li key={cat.slug}>
                                        <Link href={`/catalogo?category=${cat.slug}`} className="hover:text-white">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                                <li><Link href="/catalogo?is_premium=1" className="hover:text-premium-gold text-premium-gold font-bold">Premium</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Cliente</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/financiamiento" className="hover:text-white">Financiamiento</Link></li>
                                <li><Link href="/parte-de-pago" className="hover:text-white">Consignaciones</Link></li>
                                <li><Link href="/sucursales" className="hover:text-white">Sucursales</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-6">Ubicaciones</h4>
                            <ul className="space-y-6 text-sm text-gray-500">
                                {locations.map((loc, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <i className="fa-solid fa-location-dot mt-1 text-premium-gold shrink-0"></i>
                                        <div>
                                            {loc.address && <span className="block text-white mb-0.5">{loc.name}</span>}
                                            <span className="block leading-snug" dangerouslySetInnerHTML={{ __html: loc.address.replace(',', '<br/>') }}></span>
                                            {loc.city && <span className="text-xs opacity-70 block mt-0.5">{loc.city}</span>}
                                        </div>
                                    </li>
                                ))}

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
