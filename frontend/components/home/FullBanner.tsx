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
        <div className="w-full relative z-[45] px-4 max-w-7xl mx-auto -mt-20 md:-mt-16 mb-8" data-aos="fade-up">
            <Link href={href} className="block w-full group overflow-hidden rounded-xl md:rounded-3xl shadow-xl md:shadow-2xl">
                {/* Desktop Image */}
                <div className="hidden md:block w-full relative h-96">
                    <Image
                        src={banner.image_url?.[0] || ''}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover transform transition duration-700 group-hover:scale-105"
                        sizes="100vw"
                        quality={80}
                        loading="lazy"
                    />
                </div>

                {/* Mobile Image */}
                <div className="block md:hidden w-full relative h-64">
                    <Image
                        src={banner.mobile_image_url || banner.image_url?.[0] || ''}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover transform transition duration-700 group-hover:scale-105"
                        sizes="100vw"
                        quality={80}
                        loading="lazy"
                    />
                </div>
            </Link>
        </div>
    );
}
