import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
    fps: number;
    memory?: number;
    loadTime: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
}

/**
 * Performance monitoring hook
 * Tracks FPS, memory usage, and Core Web Vitals
 */
export const usePerformanceMonitor = (enabled = true) => {
    const metricsRef = useRef<PerformanceMetrics>({
        fps: 60,
        loadTime: 0
    });

    useEffect(() => {
        if (!enabled) return;

        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId: number;

        // FPS monitoring
        const measureFPS = (currentTime: number) => {
            frameCount++;
            const elapsed = currentTime - lastTime;

            if (elapsed >= 1000) {
                metricsRef.current.fps = Math.round((frameCount * 1000) / elapsed);
                frameCount = 0;
                lastTime = currentTime;

                // Log warning if FPS drops below 30
                if (metricsRef.current.fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${metricsRef.current.fps}`);
                }
            }

            animationFrameId = requestAnimationFrame(measureFPS);
        };

        animationFrameId = requestAnimationFrame(measureFPS);

        // Memory monitoring (if available)
        const checkMemory = () => {
            if ('memory' in performance) {
                const memory = (performance as any).memory;
                metricsRef.current.memory = Math.round(
                    memory.usedJSHeapSize / 1048576
                ); // Convert to MB
            }
        };

        const memoryInterval = setInterval(checkMemory, 5000);

        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // Largest Contentful Paint (LCP)
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1] as any;
                    metricsRef.current.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // First Contentful Paint (FCP)
                const fcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (entry.name === 'first-contentful-paint') {
                            metricsRef.current.firstContentfulPaint = entry.startTime;
                        }
                    });
                });
                fcpObserver.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Performance Observer not fully supported');
            }
        }

        // Page load time
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            metricsRef.current.loadTime = perfData.loadEventEnd - perfData.navigationStart;
        });

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(memoryInterval);
        };
    }, [enabled]);

    return metricsRef.current;
};

/**
 * Debounce utility for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle utility for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Request Idle Callback wrapper with fallback
 */
export const requestIdleCallback = (callback: () => void, timeout = 2000) => {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, { timeout });
    } else {
        // Fallback for browsers that don't support requestIdleCallback
        return setTimeout(callback, 1) as any;
    }
};

/**
 * Cancel Idle Callback wrapper with fallback
 */
export const cancelIdleCallback = (id: number) => {
    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
    } else {
        clearTimeout(id);
    }
};

/**
 * Preload critical resources
 */
export const preloadResource = (url: string, type: 'image' | 'script' | 'style' | 'font') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;

    if (type === 'font') {
        link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
};

/**
 * Prefetch resources for next navigation
 */
export const prefetchResource = (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get connection speed
 */
export const getConnectionSpeed = (): 'slow' | 'medium' | 'fast' => {
    if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection?.effectiveType;

        if (effectiveType === '4g') return 'fast';
        if (effectiveType === '3g') return 'medium';
        return 'slow';
    }

    return 'medium'; // Default assumption
};

/**
 * Optimize animations based on device capabilities
 */
export const shouldUseReducedAnimations = (): boolean => {
    return prefersReducedMotion() || getConnectionSpeed() === 'slow';
};
