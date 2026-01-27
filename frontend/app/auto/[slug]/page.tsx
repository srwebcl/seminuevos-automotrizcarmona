import { getVehicleBySlug, getSettings, getRelatedVehicles } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { formatEngine } from '@/lib/utils';
import Gallery from '@/components/vehicle/Gallery';
import VehicleCard from '@/components/VehicleCard';
import ShareButton from '@/components/ShareButton';
import VehicleActions from '@/components/vehicle/VehicleActions';

export const dynamic = 'force-dynamic';

function adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    if (!slug) return null;

    // Server Component: Fetch data directly
    const { data: vehicle } = await getVehicleBySlug(slug);

    // Fetch related vehicles
    const categoryIdentifier = vehicle.category?.slug || vehicle.category_id?.toString() || '';
    const relatedVehicles = await getRelatedVehicles(categoryIdentifier, vehicle.id, vehicle.is_premium).catch(() => []);

    // Fallback for settings if needed
    const { data: settings } = await getSettings().catch(() => ({ data: { contact: { address: '', email: '' }, whatsapp_numbers: [] } }));

    // Logic to select appropriate WhatsApp number (e.g. general enquiry or specific sales agent)
    // For now, take the first available number or fallback
    const defaultWhatsapp = '56934160477';
    const whatsappNumber = settings?.whatsapp_numbers?.find(n => !n.for_premium_only)?.number || settings?.whatsapp_numbers?.[0]?.number || defaultWhatsapp;

    // Prepare images array (Cover + Photos)
    const galleryImages = [vehicle.cover_photo, ...vehicle.photos].filter(Boolean) as string[];
    // Unique images
    const uniqueImages = [...new Set(galleryImages)];

    const whatsappMessage = `Hola, estoy interesado en el ${vehicle.brand.name} ${vehicle.model} (${vehicle.year}) que vi en la web.`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="pt-24 pb-12 bg-white min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="text-sm mb-8 text-gray-500 flex items-center gap-2">
                    <Link href="/" className="hover:text-black transition">Inicio</Link>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <Link href="/catalogo" className="hover:text-black transition">Catálogo</Link>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className="text-gray-900 font-bold">{vehicle.brand.name} {vehicle.model}</span>
                </nav>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Gallery Section (Left - 7 cols) */}
                    <div className="lg:col-span-7 mb-8 lg:mb-0">
                        <Gallery images={uniqueImages} model={vehicle.model} />

                        {/* Description Desktop (Optional placement) */}
                        <div className="hidden lg:block mt-12 prose prose-stone max-w-none">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Descripción del Vehículo</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vehicle.description || 'Sin descripción disponible para este vehículo.'}</p>
                        </div>
                    </div>

                    {/* Details Section (Right - 5 cols) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 bg-white rounded-3xl lg:p-6 lg:shadow-[0_0_50px_-15px_rgba(0,0,0,0.1)] lg:border lg:border-gray-100">
                            {/* Badge */}
                            {/* Header: Badges & Share */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-block bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-black/20">
                                        Seminuevo
                                    </span>
                                    {vehicle.is_unique_owner && (
                                        <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-600/20">
                                            Único Dueño
                                        </span>
                                    )}
                                    {vehicle.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-block text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg"
                                            style={{
                                                background: `linear-gradient(135deg, ${tag.bg_color}, ${adjustColor(tag.bg_color, -40)})`,
                                                color: tag.text_color,
                                                boxShadow: `0 10px 15px -3px ${tag.bg_color}40`
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>

                                <ShareButton
                                    title={`${vehicle.brand.name} ${vehicle.model}`}
                                    slug={vehicle.slug}
                                    brand={vehicle.brand.name}
                                    model={vehicle.model}
                                    year={vehicle.year}
                                    price={vehicle.price_formatted}
                                />
                            </div>

                            {/* Dynamic Title Structure: Brand + Model (Single Line) */}
                            <h1 className="text-2xl md:text-3xl uppercase tracking-tight mb-2 leading-none">
                                <span className="font-black text-gray-900 mr-2">{vehicle.brand.name}</span>
                                <span className="font-bold text-gray-400">{vehicle.model}</span>
                            </h1>

                            {/* Dynamic Specs Subtitle */}
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-6">
                                {[
                                    formatEngine(vehicle.motor),
                                    vehicle.traction,
                                    vehicle.transmission,
                                    vehicle.year
                                ].filter(Boolean).join(' • ')}
                            </p>
                            <div className="mb-8">
                                {vehicle.price_offer_formatted ? (
                                    (() => {
                                        // Prioritize the first available dynamic tag for styling
                                        const activeTag = vehicle.tags && vehicle.tags.length > 0 ? vehicle.tags[0] : null;

                                        return (
                                            <div
                                                className="flex flex-col items-start p-4 rounded-2xl border transition-colors duration-300"
                                                style={{
                                                    backgroundColor: activeTag ? `${activeTag.bg_color}10` : 'rgba(254, 226, 226, 0.5)', // 10 is approx 6% opacity
                                                    borderColor: activeTag ? `${activeTag.bg_color}30` : 'rgb(254, 202, 202)'
                                                }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    {activeTag ? (
                                                        <span
                                                            className="text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm animate-pulse"
                                                            style={{
                                                                backgroundColor: activeTag.bg_color,
                                                                color: activeTag.text_color
                                                            }}
                                                        >
                                                            ¡{activeTag.name}!
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm animate-pulse">
                                                            ¡Oferta Limitada!
                                                        </span>
                                                    )}

                                                    <span className="text-sm text-gray-400 line-through decoration-red-300 font-bold">
                                                        Antes: {vehicle.price_formatted}
                                                    </span>
                                                </div>
                                                <p
                                                    className="text-5xl md:text-6xl font-black tracking-tighter leading-none"
                                                    style={{ color: activeTag ? activeTag.bg_color : '#dc2626' }}
                                                >
                                                    {vehicle.price_offer_formatted}
                                                </p>
                                                <p
                                                    className="text-xs font-medium mt-1"
                                                    style={{ color: activeTag ? activeTag.bg_color : '#f87171' }}
                                                >
                                                    Precio con todo medio de pago
                                                </p>
                                            </div>
                                        );
                                    })()
                                ) : vehicle.price_financing_formatted ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                                <i className="fa-solid fa-credit-card text-6xl text-blue-900"></i>
                                            </div>
                                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <i className="fa-solid fa-star"></i> Precio Financiamiento
                                            </p>
                                            <p className="text-5xl md:text-5xl font-black text-blue-700 tracking-tighter leading-none relative z-10">
                                                {vehicle.price_financing_formatted}
                                            </p>
                                        </div>
                                        <div className="px-4">
                                            <p className="text-sm text-gray-500 font-medium">
                                                Precio Contado: <span className="font-bold text-gray-900 text-lg">{vehicle.price_formatted}</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Precio Contado</p>
                                        <p className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
                                            {vehicle.price_formatted}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Key Specs */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                                        <i className="fa-regular fa-calendar text-xs"></i>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Año</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{vehicle.year}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                                        <i className="fa-solid fa-gauge-high text-xs"></i>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Kms</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{vehicle.km_formatted}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                                        <i className="fa-solid fa-gears text-xs"></i>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Transmisión</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{vehicle.transmission || '-'}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                                        <i className="fa-solid fa-gas-pump text-xs"></i>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Combust.</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{vehicle.fuel || 'Gasolina'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Specs Toggle or List */}
                            <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                                <h3 className="font-extrabold text-gray-900 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                                    <i className="fa-solid fa-list-check"></i> Ficha Técnica
                                </h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-gray-200/50 pb-2 border-dashed">
                                        <dt className="text-gray-500 font-medium">Motor</dt>
                                        <dd className="font-bold text-gray-900">{vehicle.motor || 'No especificado'}</dd>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200/50 pb-2 border-dashed">
                                        <dt className="text-gray-500 font-medium">Color</dt>
                                        <dd className="font-bold text-gray-900">{vehicle.color || 'No especificado'}</dd>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200/50 pb-2 border-dashed">
                                        <dt className="text-gray-500 font-medium">Tracción</dt>
                                        <dd className="font-bold text-gray-900">{vehicle.traction || 'No especificado'}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* TRUST BADGES */}
                            <div className="bg-white/50 backdrop-blur rounded-2xl p-4 border border-gray-100 flex flex-col gap-3 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                        <i className="fa-solid fa-check-circle text-green-500 text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Inspeccionado y Garantizado</p>
                                        <p className="text-[10px] text-gray-500">Revisión mecánica exhaustiva.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <i className="fa-solid fa-file-shield text-blue-500 text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Documentación al día</p>
                                        <p className="text-[10px] text-gray-500">Transferencia inmediata sin multas.</p>
                                    </div>
                                </div>
                            </div>

                            <VehicleActions vehicle={vehicle} whatsappLink={whatsappLink} />

                            {/* Mobile Description (Visible only below lg) */}
                            <div className="lg:hidden mt-12 prose prose-stone max-w-none">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Descripción</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{vehicle.description || 'Sin descripción disponible.'}</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Related Vehicles Section */}
                {relatedVehicles.length > 0 && (
                    <div className="mt-20 border-t border-gray-100 pt-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <i className="fa-solid fa-fire text-red-500"></i>
                                También te podría interesar
                            </h2>
                            <Link href="/catalogo" className="text-sm font-bold text-gray-500 hover:text-black transition">
                                Ver todo <i className="fa-solid fa-arrow-right ml-1"></i>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedVehicles.map((related) => (
                                <VehicleCard key={related.id} vehicle={related} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
