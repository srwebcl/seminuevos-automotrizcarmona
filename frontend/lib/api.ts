import { PaginatedResponse, Vehicle, VehicleCategory } from '@/types/vehicle';
import { Banner } from '@/types/banner';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
// Safe backend URL derivation: remove trailing /api (and optional slash) only if it's at the end
export const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

async function fetchAPI<T>(endpoint: string, options?: { revalidate?: number }): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${API_URL}/${endpoint}`;

    // Default revalidate is 60s if not specified
    const revalidate = options?.revalidate ?? 60;

    const res = await fetch(url, {
        next: { revalidate },
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => 'No response text');
        console.error(`[API Error] ${res.status} ${res.statusText} at ${url}:`, errorText);
        throw new Error(`Failed to fetch API: ${res.statusText} (${res.status}) at ${url}`);
    }

    return res.json();
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    bg_color: string;
    text_color: string;
    vehicles_count?: number;
}

export async function getVehicles(page = 1, filters?: { category?: string; brand?: string; q?: string; sort?: string; is_premium?: boolean; is_featured?: boolean; tag?: string }): Promise<PaginatedResponse<Vehicle>> {
    let query = `vehicles?page=${page}`;
    if (filters?.category) query += `&category=${filters.category}`;
    if (filters?.brand) query += `&brand=${filters.brand}`;
    if (filters?.tag) query += `&tag=${filters.tag}`;
    if (filters?.q) query += `&q=${encodeURIComponent(filters.q)}`;
    if (filters?.sort) query += `&sort=${filters.sort}`;
    if (filters?.is_premium) query += `&is_premium=1`;
    if (filters?.is_featured) query += `&is_featured=1`;

    // Catalog: 5 minutes cache (300s)
    return fetchAPI<PaginatedResponse<Vehicle>>(query, { revalidate: 300 });
}

export async function getTags(): Promise<{ data: Tag[] }> {
    // Tags: 1 hour cache (3600s) - Tags structure changes rarely
    return fetchAPI<{ data: Tag[] }>('tags', { revalidate: 3600 });
}

export async function getPremiumVehicles(): Promise<PaginatedResponse<Vehicle>> {
    const response = await getVehicles(1, { is_premium: true });
    return response;
}

export async function getFeaturedVehicles(): Promise<{ data: Vehicle[] }> {
    // Featured home: 5 minutes (300s)
    return fetchAPI<{ data: Vehicle[] }>('vehicles/featured', { revalidate: 300 });
}

export async function getVehicleBySlug(slug: string): Promise<{ data: Vehicle }> {
    // Detail: 60s for immediate price updates (Business Requirement)
    return fetchAPI<{ data: Vehicle }>(`vehicles/${slug}`, { revalidate: 60 });
}

export async function getCategories(): Promise<{ data: VehicleCategory[] }> {
    return fetchAPI<{ data: VehicleCategory[] }>('categories', { revalidate: 3600 });
}

export async function getBrands(category?: string): Promise<{ data: { id: number; name: string; slug: string; vehicles_count: number }[] }> {
    let url = 'brands';
    if (category) {
        url += `?category=${category}`;
    }
    return fetchAPI<{ data: { id: number; name: string; slug: string; vehicles_count: number }[] }>(url, { revalidate: 3600 });
}

export async function searchGlobal(query: string): Promise<{ categories: VehicleCategory[], vehicles: Vehicle[] }> {
    // Search: Default 60s (or could be lower, but 60s is fine)
    return fetchAPI<{ categories: VehicleCategory[], vehicles: Vehicle[] }>(`search/global?query=${encodeURIComponent(query)}`);
}

export async function getBanners(): Promise<{ data: Banner[] }> {
    // Banners: 1 hour (3600s)
    return fetchAPI<{ data: Banner[] }>('banners', { revalidate: 3600 });
}

export async function getMenu(): Promise<{ data: VehicleCategory[] }> {
    // Menu: 1 hour (3600s)
    return fetchAPI<{ data: VehicleCategory[] }>('menu', { revalidate: 3600 });
}

export interface WhatsappNumber {
    number: string;
    label: string;
    for_premium_only: boolean;
}

export interface Settings {
    seasonal_mode: 'none' | 'christmas' | 'new_year' | '18sept' | 'cyber';
    whatsapp_numbers?: WhatsappNumber[];
    contact: {
        address: string;
        email: string;
    };
    social_links?: {
        instagram?: string;
        facebook?: string;
        linkedin?: string;
        youtube?: string;
    };
    locations?: {
        name: string;
        address: string;
        city: string;
        phone?: string;
        google_maps_url?: string;
    }[];
    main_categories?: {
        name: string;
        slug: string;
    }[];
}

export async function getSettings(): Promise<{ data: Settings }> {
    // Settings: 1 hour (3600s)
    return fetchAPI('settings', { revalidate: 3600 });
}

export async function getRelatedVehicles(categorySlug: string, currentVehicleId: number): Promise<Vehicle[]> {
    const { data } = await getVehicles(1, { category: categorySlug });
    return data.filter(v => v.id !== currentVehicleId).slice(0, 4);
}

export async function getLocations(): Promise<{ data: { id: number; name: string; address: string; phone?: string; city: string; image_path?: string; is_active: boolean; schedule?: string; google_maps_url?: string }[] }> {
    // Locations: 1 hour (3600s)
    return fetchAPI<{ data: { id: number; name: string; address: string; phone?: string; city: string; image_path?: string; is_active: boolean; schedule?: string; google_maps_url?: string }[] }>('locations', { revalidate: 3600 });
}
