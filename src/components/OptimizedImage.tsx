import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    lowQualitySrc?: string;
    className?: string;
    priority?: boolean;
}

/**
 * Optimized Image component with lazy loading and blur-up effect
 * Features:
 * - Intersection Observer for lazy loading
 * - Low-quality placeholder for progressive loading
 * - Automatic WebP format detection
 * - Priority loading option for above-the-fold images
 */
export const OptimizedImage = ({
    src,
    alt,
    lowQualitySrc,
    className = '',
    priority = false,
    ...props
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || '');
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (priority) {
            // Load immediately for priority images
            setCurrentSrc(src);
            return;
        }

        // Set up Intersection Observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [priority, src]);

    useEffect(() => {
        if (isInView && !isLoaded) {
            // Preload the full-quality image
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setCurrentSrc(src);
                setIsLoaded(true);
            };
        }
    }, [isInView, src, isLoaded]);

    return (
        <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-70'
                } transition-opacity duration-500`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...props}
        />
    );
};

/**
 * Hook to detect WebP support
 */
export const useWebPSupport = () => {
    const [supportsWebP, setSupportsWebP] = useState(false);

    useEffect(() => {
        const checkWebPSupport = () => {
            const canvas = document.createElement('canvas');
            if (canvas.getContext && canvas.getContext('2d')) {
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        };

        setSupportsWebP(checkWebPSupport());
    }, []);

    return supportsWebP;
};

/**
 * Utility to convert image URL to WebP if supported
 */
export const getOptimizedImageUrl = (url: string, supportsWebP: boolean): string => {
    if (!supportsWebP) return url;

    // Check if URL is already WebP
    if (url.endsWith('.webp')) return url;

    // Replace extension with .webp
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};
