export interface VehicleBrand {
    name: string;
    slug: string;
}

export interface VehicleCategory {
    name: string;
    slug: string;
}

export interface Vehicle {
    id: number;
    slug: string;
    model: string;
    brand: VehicleBrand;
    category: VehicleCategory;
    price: number;
    price_formatted: string;
    year: number;
    km: number;
    km_formatted: string;

    // Technical details
    transmission?: string;
    fuel?: string;
    traction?: string;
    motor?: string;
    color?: string;
    description?: string;

    // Flags
    is_published: boolean;
    is_featured: boolean;
    is_premium: boolean;

    // Media
    cover_photo: string | null;
    photos: string[];

    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}
