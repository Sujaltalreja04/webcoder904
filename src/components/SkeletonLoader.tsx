import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
    className?: string;
    variant?: 'card' | 'text' | 'circle' | 'image';
}

export const SkeletonLoader = ({ className = '', variant = 'card' }: SkeletonLoaderProps) => {
    const baseClasses = 'relative overflow-hidden bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50';

    const variantClasses = {
        card: 'rounded-2xl h-96',
        text: 'rounded h-4',
        circle: 'rounded-full',
        image: 'rounded-lg h-full w-full',
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
};

interface ProjectCardSkeletonProps {
    className?: string;
}

export const ProjectCardSkeleton = ({ className = '' }: ProjectCardSkeletonProps) => {
    return (
        <div className={`relative h-80 sm:h-96 ${className}`}>
            <div className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-2xl p-6 h-full">
                {/* Image skeleton */}
                <div className="mb-4 h-48 rounded-lg overflow-hidden">
                    <SkeletonLoader variant="image" />
                </div>

                {/* Title skeleton */}
                <div className="mb-3">
                    <SkeletonLoader variant="text" className="w-3/4 mb-2" />
                </div>

                {/* Description skeleton */}
                <div className="mb-3 space-y-2">
                    <SkeletonLoader variant="text" className="w-full" />
                    <SkeletonLoader variant="text" className="w-5/6" />
                </div>

                {/* Tags skeleton */}
                <div className="flex gap-2">
                    <SkeletonLoader variant="text" className="w-16 h-6 rounded-full" />
                    <SkeletonLoader variant="text" className="w-20 h-6 rounded-full" />
                    <SkeletonLoader variant="text" className="w-16 h-6 rounded-full" />
                </div>
            </div>
        </div>
    );
};
