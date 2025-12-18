import { getVehicles, getPremiumVehicles, getCategories, getBanners } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import PremiumSection from '@/components/home/PremiumSection';
import HomeStockSection from '@/components/home/HomeStockSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import FullBanner from '@/components/home/FullBanner';
import CategoryPromos from '@/components/home/CategoryPromos';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const [
    recentVehicles,
    premiumVehicles,
    categoriesResponse,
    bannersResponse
  ] = await Promise.all([
    getVehicles(1),
    getPremiumVehicles(),
    getCategories().catch(() => ({ data: [] })), // Fallback in case categories endpoint doesn't exist yet
    getBanners().catch(() => ({ data: [] })) // Safe fallback
  ]);

  const categories = categoriesResponse.data;
  const banners = bannersResponse.data;

  // Filter Banners
  const fullBanner = banners.find(b => b.type === 'full') || null;
  const promos = banners.filter(b => b.type === 'promo') || [];

  return (
    <main>
      <HeroSection />

      <FullBanner banner={fullBanner} />
      <CategoryPromos promos={promos} />

      <PremiumSection vehicles={premiumVehicles.data} />
      <HomeStockSection initialVehicles={recentVehicles.data} categories={categories} />
      <ExperienceSection />
    </main>
  );
}
