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
        getVehicles(currentPage, filters),
        getBanners().catch(() => ({ data: [] })),
        getBrands(category).catch(() => ({ data: [] })),
        getCategories().catch(() => ({ data: [] }))
    ]);

    const { data: vehicles, meta, links } = vehiclesResponse;
    const banners = bannersResponse.data;
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
        heroImage = categoryBanner.image_url;
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
        if (premiumBanner) heroImage = premiumBanner.image_url;
        else heroImage = '/images/premium-hero.jpg';
    }

    // 3. Fallback if still default image (and we have banners, use first hero as generic background)
    if (heroImage.includes('default-hero') && banners.length > 0) {
        const firstHero = banners.find(b => b.type === 'hero');
        if (firstHero) heroImage = firstHero.image_url;
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
