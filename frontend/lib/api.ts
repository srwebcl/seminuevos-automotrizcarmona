import { PaginatedResponse, Vehicle, VehicleCategory } from '@/types/vehicle';
import { Banner } from '@/types/banner';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
export const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

// --- CONFIGURACIÓN DE TIEMPOS DE CACHÉ ---
const CACHE_FAST = 60;   // 1 minuto para stock y precios (sensible al negocio)
const CACHE_SLOW = 300;  // 5 minutos para menús, banners y ajustes (estabilidad servidor)

// Helper para esperar (Sleep)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAPI<T>(endpoint: string, options?: { revalidate?: number }, retries = 3): Promise<T> {
    const url = `${API_URL}/${endpoint}`;

    // Si no se especifica, el valor por defecto será 5 minutos para proteger el servidor
    const revalidate = options?.revalidate ?? CACHE_SLOW;

    try {
        const res = await fetch(url, {
            next: { revalidate },
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!res.ok) {
            // Si es un error de servidor (500, 502, 503) o límite (429), reintentamos
            if ((res.status >= 500 || res.status === 429) && retries > 0) {
                console.warn(`[API Retry] ${res.status} at ${url}. Reintentando en 1s... (${retries} restantes)`);
                await wait(1000); // Esperar 1 segundo
                return fetchAPI<T>(endpoint, options, retries - 1);
            }

            const errorText = await res.text().catch(() => 'No response text');
            console.error(`[API Error] ${res.status} ${res.statusText} at ${url}:`, errorText);
            throw new Error(`Failed to fetch API: ${res.statusText} (${res.status})`);
        }

        return res.json();
    } catch (error) {
        // Si es un error de red (Timeout, Connection Reset), reintentamos
        if (retries > 0) {
            console.warn(`[Network Retry] Failed to connect to ${url}. Reintentando en 1.5s... (${retries} restantes)`);
            await wait(1500); // Esperar 1.5 segundos
            return fetchAPI<T>(endpoint, options, retries - 1);
        }

        console.error(`[Network Error] Failed to connect to ${url}`, error);
        throw error;
    }
}

export async function getVehicles(page = 1, filters?: { category?: string; brand?: string; q?: string; sort?: string; is_premium?: boolean; is_featured?: boolean; is_offer?: boolean; tag?: string }): Promise<PaginatedResponse<Vehicle>> {
    let query = `vehicles?page=${page}`;
    if (filters?.category) query += `&category=${filters.category}`;
    if (filters?.brand) query += `&brand=${filters.brand}`;
    if (filters?.q) query += `&q=${encodeURIComponent(filters.q)}`;
    if (filters?.sort) query += `&sort=${filters.sort}`;
    if (filters?.is_premium) query += `&is_premium=1`;
    if (filters?.is_featured) query += `&is_featured=1`;
    if (filters?.is_offer) query += `&is_offer=1`;
    if (filters?.tag) query += `&tag=${filters.tag}`;

    // Catálogo: 1 minuto es el equilibrio perfecto entre ventas y carga
    return fetchAPI<PaginatedResponse<Vehicle>>(query, { revalidate: CACHE_FAST });
}

export async function getPremiumVehicles(): Promise<PaginatedResponse<Vehicle>> {
    return getVehicles(1, { is_premium: true });
}

export async function getFeaturedVehicles(): Promise<{ data: Vehicle[] }> {
    return fetchAPI<{ data: Vehicle[] }>('vehicles/featured', { revalidate: CACHE_FAST });
}

export async function getVehicleBySlug(slug: string): Promise<{ data: Vehicle }> {
    // Detalle del auto: 1 minuto
    return fetchAPI<{ data: Vehicle }>(`vehicles/${slug}`, { revalidate: CACHE_FAST });
}

export async function getCategories(): Promise<{ data: VehicleCategory[] }> {
    return fetchAPI<{ data: VehicleCategory[] }>('categories', { revalidate: CACHE_SLOW });
}

export async function getBrands(filters?: { category?: string; is_premium?: boolean; is_featured?: boolean; is_offer?: boolean; tag?: string }): Promise<{ data: { id: number; name: string; slug: string; vehicles_count: number }[] }> {
    let query = 'brands?';
    if (filters?.category) query += `&category=${filters.category}`;
    if (filters?.is_premium) query += `&is_premium=1`;
    if (filters?.is_featured) query += `&is_featured=1`;
    if (filters?.is_offer) query += `&is_offer=1`;
    if (filters?.tag) query += `&tag=${filters.tag}`;

    return fetchAPI<{ data: { id: number; name: string; slug: string; vehicles_count: number }[] }>(query, { revalidate: CACHE_SLOW });
}

export async function searchGlobal(query: string): Promise<{ categories: VehicleCategory[], vehicles: Vehicle[] }> {
    return fetchAPI<{ categories: VehicleCategory[], vehicles: Vehicle[] }>(`search/global?query=${encodeURIComponent(query)}`, { revalidate: CACHE_FAST });
}

export async function getBanners(): Promise<{ data: Banner[] }> {
    return fetchAPI<{ data: Banner[] }>('banners', { revalidate: CACHE_SLOW });
}

export async function getMenu(): Promise<{ data: VehicleCategory[] }> {
    // El menú está en todas las páginas, usar 5 min es vital para la salud de Hostgator
    return fetchAPI<{ data: VehicleCategory[] }>('menu', { revalidate: CACHE_SLOW });
}

export interface Settings {
    seasonal_mode: 'none' | 'christmas' | 'new_year' | '18sept' | 'cyber';
    whatsapp_numbers?: { number: string; label: string; for_premium_only: boolean; }[];
    contact: { address: string; email: string; };
    social_links?: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; };
}

export async function getSettings(): Promise<{ data: Settings }> {
    return fetchAPI('settings', { revalidate: CACHE_SLOW });
}

export async function getRelatedVehicles(categorySlug: string, currentVehicleId: number, isPremium: boolean = false): Promise<Vehicle[]> {
    const filters: any = { category: categorySlug };
    if (isPremium) filters.is_premium = true;
    const { data } = await getVehicles(1, filters);
    return data.filter(v => v.id !== currentVehicleId).slice(0, 4);
}

export async function getLocations(): Promise<{ data: any[] }> {
    return fetchAPI<{ data: any[] }>('locations', { revalidate: CACHE_SLOW });
}

export interface ClearanceSettings {
    hero_desktop: string | null;
    hero_mobile: string | null;
    legal_text: string | null;
}

export interface ClearanceData {
    settings: ClearanceSettings;
    vehicles: Vehicle[];
}

export async function getClearanceData(): Promise<ClearanceData> {
    return fetchAPI<ClearanceData>('clearance', { revalidate: CACHE_FAST });
}