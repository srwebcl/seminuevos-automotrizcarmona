import { getVehicles, getBanners, getBrands, getCategories } from '@/lib/api';
import CategoryHero from '@/components/CategoryHero';
import CatalogLayout from '@/components/catalogo/CatalogLayout';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string; brand?: string; q?: string; sort?: string; is_premium?: string }>;
}) {
    const params = await searchParams;
    const { page, category, brand, q, sort, is_premium } = params;
    const currentPage = Number(page) || 1;
    const isPremium = is_premium === '1' || is_premium === 'true';

    const filters = {
        category,
        brand,
        q,
        sort,
        is_premium: isPremium
    };

    // Parallel fetching
    const [vehiclesResponse, bannersResponse, brandsResponse, categoriesResponse] = await Promise.all([
        getVehicles(currentPage, filters).catch(() => null),
        getBanners().catch(() => ({ data: [] })),
        getBrands(category).catch(() => ({ data: [] })),
        getCategories().catch(() => ({ data: [] }))
    ]);

    if (!vehiclesResponse || !vehiclesResponse.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h1>
                <p className="text-gray-600 mb-4">No pudimos cargar el catálogo de vehículos.</p>
                <div className="flex gap-4">
                    <a href="/" className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100 transition">
                        Volver al Inicio
                    </a>
                    <a href="/catalogo" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                        Recargar Catálogo
                    </a>
                </div>
            </div>
        );
    }

    const { data: vehicles, meta, links } = vehiclesResponse;
    const banners = bannersResponse.data;
    console.log('Banners fetched:', banners.length);
    console.log('Catalog banners:', banners.filter(b => b.type === 'catalog'));
    const brands = brandsResponse.data;
    const categories = categoriesResponse.data;

    // Determine Page Configuration
    let heroTitle = 'Catálogo Completo';
    let heroImage = '/images/default-hero.jpg'; // Needs a real default
    let heroSubtitle = `Mostrando ${meta.total} vehículos disponibles`;

    // 1. Try to find a specific banner for this category
    const categoryBanner = category
        ? banners.find(b => b.category_slug === category)
        : null;

    if (categoryBanner) {
        heroTitle = categoryBanner.title || category?.toUpperCase() || 'CATÁLOGO';
        heroImage = categoryBanner.image_url[0] || '/images/hero-bg-2.jpg';
        heroSubtitle = categoryBanner.subtitle || heroSubtitle;
    } else if (category) {
        heroTitle = category === 'camionemen' ? 'CAMIONETAS' : // Prevent typo
            category === 'camioneta' ? 'CAMIONETAS' :
                category.replace('-', ' ').toUpperCase();
        // Fallback image for categories without specific banner?
        heroImage = '/images/hero-bg-2.jpg';
    }

    // 2. Premium Override
    if (isPremium) {
        heroTitle = 'COLECCIÓN PREMIUM';
        heroSubtitle = 'Vehículos de alta gama verificados.';
        const premiumBanner = banners.find(b => b.title?.toLowerCase().includes('premium'));
        if (premiumBanner) heroImage = premiumBanner.image_url[0] || '/images/premium-hero.jpg';
        else heroImage = '/images/premium-hero.jpg';
    }

    // 3. Main Catalog Banner (If no specific filters active or just fallback)
    if (heroImage.includes('default-hero') && banners.length > 0) {
        // Prioritize "catalog" type banner that is NOT specific to a category
        const catalogBanner = banners.find(b => b.type === 'catalog' && !b.category_slug);

        if (catalogBanner) {
            heroImage = catalogBanner.image_url[0] || '/images/hero-bg-2.jpg';
            // Optionally update title/subtitle if provided in banner
            if (catalogBanner.title) heroTitle = catalogBanner.title;
            if (catalogBanner.subtitle) heroSubtitle = catalogBanner.subtitle;
        } else {
            // Fallback to first Hero banner
            const firstHero = banners.find(b => b.type === 'hero');
            if (firstHero) heroImage = firstHero.image_url[0] || '/images/hero-bg-2.jpg';
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Dynamic Hero */}
            <CategoryHero
                title={heroTitle}
                subtitle={heroSubtitle}
                backgroundImage={heroImage}
            />

            {/* Layout with Sidebar & Content */}
            <div className="relative">
                <CatalogLayout
                    vehicles={vehicles}
                    meta={meta}
                    links={links}
                    brands={brands}
                    categories={categories}
                    searchParams={params}
                />
            </div>
        </div>
    );
}
