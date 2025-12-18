import { PaginatedResponse, Vehicle, VehicleCategory } from '@/types/vehicle';
import { Banner } from '@/types/banner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function fetchAPI<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        cache: 'no-store', // Adjust caching strategy as needed
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch API: ${res.statusText}`);
    }

    return res.json();
}

export async function getVehicles(page = 1, filters?: { category?: string; is_premium?: boolean; is_featured?: boolean }): Promise<PaginatedResponse<Vehicle>> {
    let query = `vehicles?page=${page}`;
    if (filters?.category) query += `&category=${filters.category}`;
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

export async function searchGlobal(query: string): Promise<{ categories: VehicleCategory[], vehicles: Vehicle[] }> {
    return fetchAPI<{ categories: VehicleCategory[], vehicles: Vehicle[] }>(`search/global?query=${encodeURIComponent(query)}`);
}

export async function getBanners(): Promise<{ data: Banner[] }> {
    return fetchAPI<{ data: Banner[] }>('banners');
}
