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
                <div className="hidden md:block w-full">
                    <img
                        src={banner.image_url?.[0] || ''}
                        alt={banner.title || 'Promoción'}
                        className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Mobile Image */}
                <div className="block md:hidden w-full">
                    <img
                        src={banner.mobile_image_url || banner.image_url?.[0] || ''}
                        alt={banner.title || 'Promoción'}
                        className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
                    />
                </div>
            </Link>
        </div>
    );
}
