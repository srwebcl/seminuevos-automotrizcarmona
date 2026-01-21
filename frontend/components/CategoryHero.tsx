'use client';

import Image from 'next/image';
import Aos from 'aos';
import { useEffect } from 'react';

interface CategoryHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage: string;
}

export default function CategoryHero({ title, subtitle, backgroundImage }: CategoryHeroProps) {
    useEffect(() => {
        Aos.init();
    }, []);

    return (
        <div className="relative h-[40vh] min-h-[350px] w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover opacity-60"
                    priority
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16" data-aos="fade-up">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
