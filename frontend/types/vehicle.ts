export interface VehicleBrand {
    name: string;
    slug: string;
}

export interface Tag {
    name: string;
    bg_color: string;
    text_color: string;
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
    category_id?: number;
    price: number;
    price_formatted: string;
    price_financing?: number;
    price_financing_formatted?: string | null;
    price_offer?: number;
    price_offer_formatted?: string | null;
    year: number;
    km: number;
    km_formatted: string;

    // Technical details
    is_unique_owner?: boolean;
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
    is_offer: boolean;
    is_clearance: boolean;

    // Tags
    tags?: Tag[];

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
