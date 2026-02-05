import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },

    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
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
            },
            {
                protocol: 'https',
                hostname: 'api.automotrizcarmona.cl',
            },
            {
                protocol: 'https',
                hostname: 'automotrizcarmona.cl',
            },
            {
                protocol: 'https',
                hostname: 'www.automotrizcarmona.cl',
            },
            {
                protocol: 'https',
                hostname: 'seminuevos.automotrizcarmona.cl',
            }
        ],
        dangerouslyAllowSVG: true,
    },
    compress: true,

    async redirects() {
        return [
            {
                source: '/buscar-auto',
                destination: '/catalogo',
                permanent: true,
            },
            {
                source: '/vehiculos/:slug',
                destination: '/auto/:slug',
                permanent: true,
            },
            {
                source: '/contacto',
                destination: '/sucursales',
                permanent: true,
            },
            {
                source: '/nosotros',
                destination: '/sucursales',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;