'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/types/banner';

interface FullBannerProps {
    banner: Banner | null;
}

export default function FullBanner({ banner }: FullBannerProps) {
    if (!banner) return null;

    const href = banner.category_slug
        ? `/catalogo?category=${banner.category_slug}`
        : (banner.link || '#');

    return (
        <div className="w-full relative z-20 -mt-10 mx-auto max-w-7xl px-4" data-aos="fade-up" data-aos-delay="100">
            <Link href={href} className="block w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* Desktop Image */}
                <div className="relative w-full hidden md:block h-[250px]">
                    <Image
                        src={banner.image_url}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover"
                        unoptimized={true}
                    />
                </div>

                {/* Mobile Image */}
                <div className="relative w-full block md:hidden aspect-[16/9]">
                    <Image
                        src={banner.mobile_image_url || banner.image_url}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover"
                        unoptimized={true}
                    />
                </div>
            </Link>
        </div>
    );
}
