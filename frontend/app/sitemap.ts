import { MetadataRoute } from 'next';
import { getAllVehicleSlugs } from '@/lib/api';

// Mismo dominio de producción usado en app/layout.tsx (metadataBase).
const SITE_URL = 'https://seminuevos.automotrizcarmona.cl';

// Se regenera como máximo cada hora: un crawler no necesita el catálogo al minuto,
// y así evitamos pegarle al backend en Hostgator en cada visita a /sitemap.xml.
export const revalidate = 3600;

const STATIC_ROUTES = [
    '',
    '/catalogo',
    '/liquidacion',
    '/financiamiento',
    '/parte-de-pago',
    '/sucursales',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
    }));

    // Incluye TODO vehículo publicado, liquidación incluida: su página de detalle
    // siempre estuvo accesible, solo faltaba una forma de descubrirla sin depender
    // del listado /catalogo (que hasta ahora los excluía).
    const vehicles = await getAllVehicleSlugs().catch(() => []);
    const vehicleEntries: MetadataRoute.Sitemap = vehicles.map(({ slug, updated_at }) => ({
        url: `${SITE_URL}/auto/${slug}`,
        lastModified: new Date(updated_at),
    }));

    return [...staticEntries, ...vehicleEntries];
}
