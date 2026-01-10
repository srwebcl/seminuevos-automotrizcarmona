/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'api-dev.automotrizcarmona.cl',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'api.automotrizcarmona.cl',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'automotrizcarmona.cl',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'seminuevos.automotrizcarmona.cl',
                pathname: '/storage/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            }
        ],
        // Disable optimization locally to prevent "resolved to private ip" errors
        unoptimized: true,
    },
};

export default nextConfig;
