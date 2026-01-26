import { getVehicles, getPremiumVehicles, getCategories, getBanners } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import PremiumSection from '@/components/home/PremiumSection';
import HomeStockSection from '@/components/home/HomeStockSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import FullBanner from '@/components/home/FullBanner';
import CategoryPromos from '@/components/home/CategoryPromos';

export const dynamic = 'force-dynamic'; // Disable caching for real-time updates

export default async function Home() {
  let recentVehicles, premiumVehicles, categoriesResponse, bannersResponse;

  try {
    const results = await Promise.allSettled([
      getVehicles(1),
      getPremiumVehicles(),
      getCategories(),
      getBanners()
    ]);

    recentVehicles = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
    premiumVehicles = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
    categoriesResponse = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
    bannersResponse = results[3].status === 'fulfilled' ? results[3].value : { data: [] };

    // Log errors if any
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`[Home Page] API Limit/Error on request ${index}:`, result.reason);
      }
    });

  } catch (error) {
    console.error("Critical Error loading Home Data:", error);
    recentVehicles = { data: [] };
    categoriesResponse = { data: [] };
    bannersResponse = { data: [] };
  }

  const categories = categoriesResponse.data || [];
  const banners = bannersResponse.data || [];

  // Filter Banners
  const heroBanners = banners.filter(b => b.type === 'hero');
  const fullBanners = banners.filter(b => b.type === 'full') || [];
  const promos = banners.filter(b => b.type === 'promo') || [];

  return (
    <main>
      <HeroSection banners={heroBanners} />

      <FullBanner banners={fullBanners} />
      <CategoryPromos promos={promos} />

      <HomeStockSection initialVehicles={recentVehicles.data || []} categories={categories} />
      <ExperienceSection />
    </main>
  );
}
