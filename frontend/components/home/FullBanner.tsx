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

    // Usar la imagen móvil si existe, si no, la primera del array
    const desktopImage = banner.image_url?.[0] || '';
    const mobileImage = banner.mobile_image_url || desktopImage;

    return (
        <div className="w-full relative z-[45] px-4 max-w-7xl mx-auto -mt-20 md:-mt-16 mb-8" data-aos="fade-up">

            {/* 1. VERSIÓN MÓVIL (Visible solo en md-) */}
            {/* Aspect Ratio exacto según imagen real: 767x301 */}
            <div className="block md:hidden w-full relative">
                <Link href={href} className="block w-full group overflow-hidden rounded-xl shadow-xl relative aspect-[767/301]">
                    <Image
                        src={mobileImage}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover transform transition duration-700 group-hover:scale-105"
                        sizes="95vw"
                        quality={80}
                    />
                </Link>
            </div>

            {/* 2. VERSIÓN ESCRITORIO (Visible solo en md+) */}
            {/* Aspect Ratio exacto según imagen real: 1735x170 */}
            <div className="hidden md:block w-full relative">
                <Link href={href} className="block w-full group overflow-hidden rounded-3xl shadow-2xl relative aspect-[1735/170]">
                    <Image
                        src={desktopImage}
                        alt={banner.title || 'Promoción'}
                        fill
                        className="object-cover transform transition duration-700 group-hover:scale-105"
                        sizes="95vw"
                        quality={85}
                    />
                </Link>
            </div>

        </div>
    );
}
