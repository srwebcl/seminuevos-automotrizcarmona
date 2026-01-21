import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Activar AVIF (formato ultra-ligero de Google)
    formats: ['image/avif', 'image/webp'],

    // 2. Ajustar tamaños para móviles específicos (reduce peso en celulares)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api-dev.automotrizcarmona.cl',
      }
    ],
  },
  // 3. Comprimir JS (ayuda con el aviso de "JavaScript heredado")
  compress: true,
};

export default nextConfig;
