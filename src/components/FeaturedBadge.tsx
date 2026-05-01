import { motion } from 'framer-motion';
import { Star, Award, Zap, Crown, Trophy, Rocket } from 'lucide-react';

interface FeaturedBadgeProps {
    variant?: 'ribbon' | 'corner' | 'floating' | 'glow';
    type?: 'featured' | 'top-rated' | 'award-winning' | 'best' | 'new' | 'startup';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    animated?: boolean;
}

export const FeaturedBadge = ({
    variant = 'ribbon',
    type = 'featured',
    position = 'top-right',
    animated = true
}: FeaturedBadgeProps) => {

    const getIcon = () => {
        switch (type) {
            case 'featured': return Star;
            case 'top-rated': return Crown;
            case 'award-winning': return Trophy;
            case 'best': return Award;
            case 'new': return Zap;
            case 'startup': return Rocket;
            default: return Star;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'featured':
                return {
                    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
                    glow: 'rgba(251, 191, 36, 0.5)',
                    border: 'border-yellow-400/50'
                };
            case 'top-rated':
                return {
                    gradient: 'from-purple-500 via-pink-500 to-rose-500',
                    glow: 'rgba(168, 85, 247, 0.5)',
                    border: 'border-purple-400/50'
                };
            case 'award-winning':
                return {
                    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
                    glow: 'rgba(59, 130, 246, 0.5)',
                    border: 'border-blue-400/50'
                };
            case 'best':
                return {
                    gradient: 'from-green-500 via-emerald-500 to-teal-500',
                    glow: 'rgba(34, 197, 94, 0.5)',
                    border: 'border-green-400/50'
                };
            case 'new':
                return {
                    gradient: 'from-red-500 via-orange-500 to-yellow-500',
                    glow: 'rgba(239, 68, 68, 0.5)',
                    border: 'border-red-400/50'
                };
            case 'startup':
                return {
                    gradient: 'from-orange-500 via-red-500 to-pink-500',
                    glow: 'rgba(249, 115, 22, 0.5)',
                    border: 'border-orange-400/50'
                };
            default:
                return {
                    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
                    glow: 'rgba(251, 191, 36, 0.5)',
                    border: 'border-yellow-400/50'
                };
        }
    };

    const getText = () => {
        switch (type) {
            case 'featured': return 'FEATURED';
            case 'top-rated': return 'TOP RATED';
            case 'award-winning': return 'AWARD WINNING';
            case 'best': return 'BEST';
            case 'new': return 'NEW';
            case 'startup': return 'STARTUP';
            default: return 'FEATURED';
        }
    };

    const Icon = getIcon();
    const colors = getColors();

    // Position classes
    const positionClasses = {
        'top-left': 'top-0 left-0',
        'top-right': 'top-0 right-0',
        'bottom-left': 'bottom-0 left-0',
        'bottom-right': 'bottom-0 right-0',
    };

    // Ribbon variant (diagonal corner ribbon)
    if (variant === 'ribbon') {
        const isRight = position.includes('right');
        const isTop = position.includes('top');

        return (
            <div className={`absolute ${positionClasses[position]} overflow-hidden w-32 h-32 pointer-events-none z-20`}>
                <motion.div
                    className={`absolute ${isTop ? 'top-0' : 'bottom-0'} ${isRight ? 'right-0' : 'left-0'} w-40 text-center py-2 ${isRight ? '-rotate-45' : 'rotate-45'} ${isTop ? (isRight ? 'origin-top-right translate-x-8 -translate-y-8' : 'origin-top-left -translate-x-8 -translate-y-8') : (isRight ? 'origin-bottom-right translate-x-8 translate-y-8' : 'origin-bottom-left -translate-x-8 translate-y-8')} bg-gradient-to-r ${colors.gradient} shadow-lg`}
                    initial={animated ? { scale: 0, rotate: isRight ? -45 : 45 } : {}}
                    animate={animated ? { scale: 1, rotate: isRight ? -45 : 45 } : {}}
                    transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                    <motion.div
                        className="flex items-center justify-center gap-1 text-white font-bold text-xs tracking-wider drop-shadow-lg"
                        animate={animated ? {
                            textShadow: [
                                '0 0 10px rgba(255,255,255,0.5)',
                                '0 0 20px rgba(255,255,255,0.8)',
                                '0 0 10px rgba(255,255,255,0.5)',
                            ],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Icon size={12} />
                        <span>{getText()}</span>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // Corner badge variant (small rounded badge)
    if (variant === 'corner') {
        return (
            <motion.div
                className={`absolute ${positionClasses[position]} m-3 z-20`}
                initial={animated ? { scale: 0, opacity: 0 } : {}}
                animate={animated ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 300 }}
            >
                <motion.div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${colors.gradient} shadow-lg border ${colors.border} backdrop-blur-sm`}
                    whileHover={{ scale: 1.1 }}
                    animate={animated ? {
                        boxShadow: [
                            `0 0 20px ${colors.glow}`,
                            `0 0 30px ${colors.glow}`,
                            `0 0 20px ${colors.glow}`,
                        ],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Icon size={14} className="text-white" />
                    <span className="text-white font-bold text-xs tracking-wide drop-shadow-md">
                        {getText()}
                    </span>
                </motion.div>
            </motion.div>
        );
    }

    // Floating badge variant (floats above card)
    if (variant === 'floating') {
        return (
            <motion.div
                className={`absolute ${positionClasses[position]} ${position.includes('top') ? '-top-3' : '-bottom-3'} ${position.includes('right') ? '-right-3' : '-left-3'} z-20`}
                initial={animated ? { y: -20, opacity: 0 } : {}}
                animate={animated ? {
                    y: [0, -5, 0],
                    opacity: 1
                } : {}}
                transition={animated ? {
                    y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.4, delay: 0.2 }
                } : {}}
            >
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colors.gradient} shadow-2xl border-2 ${colors.border}`}>
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
                        animate={animated ? {
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Icon size={24} className="text-white drop-shadow-lg z-10" />
                </div>
            </motion.div>
        );
    }

    // Glow badge variant (glowing text badge)
    if (variant === 'glow') {
        return (
            <motion.div
                className={`absolute ${positionClasses[position]} m-4 z-20`}
                initial={animated ? { scale: 0, opacity: 0 } : {}}
                animate={animated ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <motion.div
                    className={`relative px-4 py-2 rounded-lg bg-gradient-to-r ${colors.gradient} shadow-xl`}
                    animate={animated ? {
                        boxShadow: [
                            `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
                            `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`,
                            `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
                        ],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={animated ? { rotate: 360 } : {}}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            <Icon size={16} className="text-white" />
                        </motion.div>
                        <span className="text-white font-bold text-sm tracking-widest drop-shadow-lg">
                            {getText()}
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return null;
};
