import { MetadataRoute } from 'next';

// Mismo dominio de producción usado en app/layout.tsx (metadataBase) y app/sitemap.ts.
const SITE_URL = 'https://seminuevos.automotrizcarmona.cl';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
