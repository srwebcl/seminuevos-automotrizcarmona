'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/types/banner';

interface CategoryPromosProps {
    promos: Banner[];
}

export default function CategoryPromos({ promos }: CategoryPromosProps) {
    const scrollContainer = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (!promos || promos.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5" data-aos="fade-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Explora por Categorías</h2>
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainer}
                className="flex overflow-x-auto snap-x scrollbar-hide gap-5 pb-4 scroll-smooth"
            >
                {promos.map((promo) => {
                    const href = promo.category_slug
                        ? `/catalogo?category=${promo.category_slug}`
                        : (promo.link || '#');

                    return (
                        <Link
                            key={promo.id}
                            href={href}
                            className="snap-center shrink-0 w-[80%] md:w-[32%] h-60 rounded-2xl overflow-hidden relative shadow-lg group"
                        >
                            <Image
                                src={promo.image_url}
                                alt={promo.title || ''}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized={true}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-white font-bold text-xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    {promo.title}
                                </h3>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {promo.subtitle}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
