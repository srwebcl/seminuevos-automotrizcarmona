export interface Banner {
    id: number;
    type: 'hero' | 'full' | 'promo';
    title: string | null;
    subtitle: string | null;
    image_url: string;
    mobile_image_url: string | null;
    video_url: string | null;
    link: string | null;
    category_slug: string | null;
    sort_order: number;
}
