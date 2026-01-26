'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/types/banner';

interface FullBannerProps {
    banners: Banner[];
}

export default function FullBanner({ banners }: FullBannerProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback((emblaApi: any) => {
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    if (!banners || banners.length === 0) return null;

    return (
        <div className="w-full relative z-[45] px-4 max-w-7xl mx-auto -mt-20 md:-mt-16 mb-8 group/banner" data-aos="fade-up">
            <div className="overflow-hidden rounded-xl md:rounded-3xl shadow-xl md:shadow-2xl relative">
                <div ref={emblaRef}>
                    <div className="flex">
                        {banners.map((banner, index) => {
                            const href = banner.category_slug
                                ? `/catalogo?category=${banner.category_slug}`
                                : (banner.link || '#');

                            const desktopImage = banner.image_url?.[0] || '/images/placeholder.jpg';
                            const mobileImage = banner.mobile_image_url || desktopImage;

                            return (
                                <div className="flex-[0_0_100%] min-w-0 relative" key={banner.id || index}>
                                    <Link href={href} className="block w-full h-full relative">
                                        {/* Versión Desktop: Pixel Perfect Ratio 1735x170 (~10.2:1) */}
                                        <div className="hidden md:block w-full relative aspect-[1735/170]">
                                            <Image
                                                src={desktopImage}
                                                alt={banner.title || 'Promoción'}
                                                fill
                                                className="object-cover"
                                                sizes="95vw"
                                                quality={85}
                                                priority={index === 0}
                                            />
                                        </div>

                                        {/* Versión Móvil: Pixel Perfect Ratio 767x301 (~2.55:1) */}
                                        <div className="block md:hidden w-full relative aspect-[767/301]">
                                            <Image
                                                src={mobileImage}
                                                alt={banner.title || 'Promoción'}
                                                fill
                                                className="object-cover"
                                                sizes="95vw"
                                                quality={80}
                                                priority={index === 0}
                                            />
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation Arrows (Desktop Only) - Show only if > 1 banner */}
                {banners.length > 1 && (
                    <>
                        <button
                            className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/banner:opacity-100 disabled:opacity-0"
                            onClick={scrollPrev}
                            disabled={!prevBtnEnabled}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/banner:opacity-100 disabled:opacity-0"
                            onClick={scrollNext}
                            disabled={!nextBtnEnabled}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
