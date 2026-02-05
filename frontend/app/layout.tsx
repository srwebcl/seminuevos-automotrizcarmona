import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AosInit from '@/components/AosInit';
import SmartWhatsAppButton from '@/components/SmartWhatsAppButton';
import { getMenu, getSettings } from '@/lib/api';

// --- 1. IMPORTACIONES DE ANALÍTICA
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  adjustFontFallback: false
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seminuevos.automotrizcarmona.cl'),
  title: 'Automotriz Carmona | Venta de Seminuevos',
  description: 'Encuentra tu próximo auto seminuevo en La Serena al mejor precio y calidad. Automotriz Carmona, líderes en la IV Región.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [menuResponse, settingsResponse] = await Promise.all([
    getMenu().catch(() => ({ data: [] })),
    getSettings().catch(() => ({
      data: {
        seasonal_mode: 'none' as const,
        whatsapp_numbers: [],
        contact: { address: 'Av. Balmaceda 3570, La Serena', email: 'mfarias@carmonaycia.cl' }
      }
    }))
  ]);

  const menuItems = menuResponse.data;
  const settings = settingsResponse.data;

  const themeClass = settings.seasonal_mode !== 'none' ? `theme-${settings.seasonal_mode}` : '';

  // --- 2. CONFIGURACIÓN ID GOOGLE ---
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-506B9N7C46";

  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-gray-50 flex flex-col min-h-screen ${themeClass}`} suppressHydrationWarning={true}>
        <Navbar categories={menuItems} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer settings={settings} />
        <Suspense fallback={null}>
          <SmartWhatsAppButton numbers={settings.whatsapp_numbers} />
        </Suspense>
        <AosInit />

        {/* --- 3. COMPONENTES DE MEDICIÓN */}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={gaId} />

      </body>
    </html>
  );
}