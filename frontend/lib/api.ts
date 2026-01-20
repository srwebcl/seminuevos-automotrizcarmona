import { PaginatedResponse, Vehicle, VehicleCategory } from '@/types/vehicle';
import { Banner } from '@/types/banner';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
// Safe backend URL derivation: remove trailing /api (and optional slash) only if it's at the end
export const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

async function fetchAPI<T>(endpoint: string): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${API_URL}/${endpoint}`;

    const res = await fetch(url, {
        next: { revalidate: 60 }, // ISR: Cache for 60 seconds
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

export async function getVehicles(page = 1, filters?: { category?: string; brand?: string; q?: string; sort?: string; is_premium?: boolean; is_featured?: boolean }): Promise<PaginatedResponse<Vehicle>> {
    let query = `vehicles?page=${page}`;
    if (filters?.category) query += `&category=${filters.category}`;
    if (filters?.brand) query += `&brand=${filters.brand}`;
    if (filters?.q) query += `&q=${encodeURIComponent(filters.q)}`;
    if (filters?.sort) query += `&sort=${filters.sort}`;
    if (filters?.is_premium) query += `&is_premium=1`;
    if (filters?.is_featured) query += `&is_featured=1`;

    return fetchAPI<PaginatedResponse<Vehicle>>(query);
}

export async function getPremiumVehicles(): Promise<PaginatedResponse<Vehicle>> {
    // Only fetch first page of premium vehicles for the home section
    return getVehicles(1, { is_premium: true });
}

export async function getFeaturedVehicles(): Promise<{ data: Vehicle[] }> {
    // The endpoint /vehicles/featured returns a collection resource, wrapping data in 'data'
    return fetchAPI<{ data: Vehicle[] }>('vehicles/featured');
}

export async function getVehicleBySlug(slug: string): Promise<{ data: Vehicle }> {
    return fetchAPI<{ data: Vehicle }>(`vehicles/${slug}`);
}

export async function getCategories(): Promise<{ data: VehicleCategory[] }> {
    // Assuming backend has a /categories endpoint. If not, we might need to create it or infer.
    // For now, let's try standard endpoint.
    return fetchAPI<{ data: VehicleCategory[] }>('categories');
}

export async function getBrands(category?: string): Promise<{ data: { id: number; name: string; slug: string; vehicles_count: number }[] }> {
    let url = 'brands';
    if (category) {
        url += `?category=${category}`;
    }
    return fetchAPI<{ data: { id: number; name: string; slug: string; vehicles_count: number }[] }>(url);
}

export async function searchGlobal(query: string): Promise<{ categories: VehicleCategory[], vehicles: Vehicle[] }> {
    return fetchAPI<{ categories: VehicleCategory[], vehicles: Vehicle[] }>(`search/global?query=${encodeURIComponent(query)}`);
}

export async function getBanners(): Promise<{ data: Banner[] }> {
    return fetchAPI<{ data: Banner[] }>('banners');
}

export async function getMenu(): Promise<{ data: VehicleCategory[] }> {
    return fetchAPI<{ data: VehicleCategory[] }>('menu');
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
    return fetchAPI('settings');
}

export async function getRelatedVehicles(categorySlug: string, currentVehicleId: number): Promise<Vehicle[]> {
    // Fetch vehicles from the same category
    const { data } = await getVehicles(1, { category: categorySlug });
    // Filter out the current vehicle and limit to 4
    return data.filter(v => v.id !== currentVehicleId).slice(0, 4);
}

export async function getLocations(): Promise<{ data: { id: number; name: string; address: string; phone?: string; city: string; image_path?: string; is_active: boolean; schedule?: string; google_maps_url?: string }[] }> {
    return fetchAPI<{ data: { id: number; name: string; address: string; phone?: string; city: string; image_path?: string; is_active: boolean; schedule?: string; google_maps_url?: string }[] }>('locations');
}
