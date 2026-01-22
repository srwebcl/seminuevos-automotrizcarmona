import { getVehicles, getPremiumVehicles, getCategories, getBanners, getTags } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import PremiumSection from '@/components/home/PremiumSection';
import HomeStockSection from '@/components/home/HomeStockSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import FullBanner from '@/components/home/FullBanner';
import CategoryPromos from '@/components/home/CategoryPromos';

export const dynamic = 'force-dynamic'; // Disable caching for real-time updates

export default async function Home() {
  let recentVehicles, premiumVehicles, categoriesResponse, bannersResponse, tagsResponse;

  try {
    const results = await Promise.allSettled([
      getVehicles(1),
      getPremiumVehicles(),
      getCategories(),
      getBanners(),
      getTags()
    ]);

    recentVehicles = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
    premiumVehicles = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
    categoriesResponse = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
    bannersResponse = results[3].status === 'fulfilled' ? results[3].value : { data: [] };
    tagsResponse = results[4].status === 'fulfilled' ? results[4].value : { data: [] };

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
    tagsResponse = { data: [] };
  }

  const categories = categoriesResponse.data || [];
  const banners = bannersResponse.data || [];
  const tags = tagsResponse.data || [];

  // Filter Banners
  const heroBanners = banners.filter(b => b.type === 'hero');
  const fullBanner = banners.find(b => b.type === 'full') || null;
  const promos = banners.filter(b => b.type === 'promo') || [];

  return (
    <main>
      <HeroSection banners={heroBanners} />

      <FullBanner banner={fullBanner} />
      <CategoryPromos promos={promos} />

      <HomeStockSection initialVehicles={recentVehicles.data || []} categories={categories} tags={tags} />
      <ExperienceSection />
    </main>
  );
}
