import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ESTA LÍNEA ES OBLIGATORIA PARA EL 90+:
    formats: ['image/avif', 'image/webp'],

    // Tamaños exactos para dispositivos móviles
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

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
  compress: true, // Habilita compresión Gzip/Brotli
};

export default nextConfig;
