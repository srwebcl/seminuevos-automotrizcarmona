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

    const desktopImage = banner.image_url?.[0] || '/images/placeholder.jpg';
    const mobileImage = banner.mobile_image_url || desktopImage;

    return (
        <div className="w-full relative z-[45] px-4 max-w-7xl mx-auto -mt-20 md:-mt-16 mb-8" data-aos="fade-up">
            <Link href={href} className="block w-full group overflow-hidden rounded-xl md:rounded-3xl shadow-xl md:shadow-2xl relative">
                {/* Versión Desktop */}
                <div className="hidden md:block w-full relative aspect-[3/1]">
                    <Image
                        src={desktopImage}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="95vw"
                        quality={85}
                    />
                </div>
                {/* Versión Móvil: Usa aspect ratio cuadrado/alto para ocupar menos espacio visual si es necesario */}
                <div className="block md:hidden w-full relative aspect-[4/3]">
                    <Image
                        src={mobileImage}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="95vw"
                        quality={75}
                    />
                </div>
            </Link>
        </div>
    );
}
