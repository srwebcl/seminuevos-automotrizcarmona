'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface GalleryProps {
    images: string[];
    model: string;
}

export default function Gallery({ images, model }: GalleryProps) {
    const [mainImage, setMainImage] = useState(images[0]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Update main image when prop changes
    useEffect(() => {
        setMainImage(images[0]);
        setCurrentIndex(0);
    }, [images]);

    const handleImageClick = (img: string, index: number) => {
        setMainImage(img);
        setCurrentIndex(index);
        setIsLightboxOpen(true);
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);
        setMainImage(images[nextIndex]);
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(prevIndex);
        setMainImage(images[prevIndex]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    useEffect(() => {
        if (isLightboxOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, currentIndex]); // Added currentIndex dependency for closure capture

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                Sin Imágenes
            </div>
        );
    }

    return (
        <div className="mb-8 lg:mb-0">
            {/* Desktop Main Image */}
            <div
                className="hidden lg:block relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 mb-4 shadow-sm border border-gray-100 group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image
                    src={mainImage}
                    alt={model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                    unoptimized={true}
                />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm pointer-events-none">
                    <i className="fa-solid fa-expand mr-1.5"></i> Ampliar
                </div>

                {/* Desktop Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center transition shadow-lg opacity-0 group-hover:opacity-100"
                        >
                            <i className="fa-solid fa-chevron-left text-sm"></i>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center transition shadow-lg opacity-0 group-hover:opacity-100"
                        >
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Swipeable Gallery */}
            <div className="lg:hidden relative">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 gap-4 pb-4"
                >
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-full aspect-video snap-center rounded-xl overflow-hidden bg-gray-100 shadow-sm"
                            onClick={() => handleImageClick(img, index)}
                        >
                            <Image
                                src={img}
                                alt={`${model} - view ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>
                    ))}
                </div>
                {/* Mobile Counter */}
                <div className="absolute bottom-8 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm pointer-events-none">
                    <i className="fa-regular fa-images mr-1.5"></i> {images.length} Fotos
                </div>
            </div>

            {/* Thumbnails (Desktop) */}
            {images.length > 1 && (
                <div className="hidden lg:grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setMainImage(img);
                                setCurrentIndex(index);
                            }}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${mainImage === img ? 'border-black opacity-100 ring-2 ring-black/10' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${model} view ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Overlay */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-[110]"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-[110] backdrop-blur-sm"
                    >
                        <i className="fa-solid fa-chevron-left text-xl"></i>
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex]}
                                alt={model}
                                fill
                                className="object-contain"
                                unoptimized={true}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-[110] backdrop-blur-sm"
                    >
                        <i className="fa-solid fa-chevron-right text-xl"></i>
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
}
