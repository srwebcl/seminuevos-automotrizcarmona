import { getVehicles, getCategories } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import PremiumSection from '@/components/home/PremiumSection';
import HomeStockSection from '@/components/home/HomeStockSection';
import ExperienceSection from '@/components/home/ExperienceSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch initial data on server
  const [{ data: initialVehicles }, { data: categories }] = await Promise.all([
    getVehicles(1),
    getCategories().catch(() => ({ data: [] })) // Fallback in case categories endpoint doesn't exist yet
  ]);

  return (
    <main>
      <HeroSection />
      <PremiumSection />
      <HomeStockSection initialVehicles={initialVehicles} categories={categories} />
      <ExperienceSection />
    </main>
  );
}
