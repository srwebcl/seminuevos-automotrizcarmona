import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AosInit from '@/components/AosInit';
import SmartWhatsAppButton from '@/components/SmartWhatsAppButton';
import { getMenu, getSettings } from '@/lib/api';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Automotriz Carmona | Venta de Seminuevos',
  description: 'Encuentra tu próximo auto al mejor precio y calidad.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch global data on server
  const [menuResponse, settingsResponse] = await Promise.all([
    getMenu().catch(() => ({ data: [] })),
    getSettings().catch(() => ({
      data: {
        seasonal_mode: 'none' as const,
        whatsapp_numbers: [],
        contact: { address: 'Av. Balmaceda 3570, La Serena', email: 'contacto@carmona.cl' }
      }
    }))
  ]);

  const menuItems = menuResponse.data;
  const settings = settingsResponse.data;

  // Apply seasonal theme class if needed to body (mapped from 'settings.seasonal_mode')
  const themeClass = settings.seasonal_mode !== 'none' ? `theme-${settings.seasonal_mode}` : '';

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
      </body>
    </html>
  );
}
