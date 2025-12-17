import { PaginatedResponse, Vehicle } from '@/types/vehicle';

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

export async function getVehicles(page = 1): Promise<PaginatedResponse<Vehicle>> {
    return fetchAPI<PaginatedResponse<Vehicle>>(`vehicles?page=${page}`);
}

export async function getFeaturedVehicles(): Promise<{ data: Vehicle[] }> {
    // The endpoint /vehicles/featured returns a collection resource, wrapping data in 'data'
    return fetchAPI<{ data: Vehicle[] }>('vehicles/featured');
}

export async function getVehicleBySlug(slug: string): Promise<{ data: Vehicle }> {
    return fetchAPI<{ data: Vehicle }>(`vehicles/${slug}`);
}
