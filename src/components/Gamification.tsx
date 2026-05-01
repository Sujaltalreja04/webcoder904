import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification, Achievement } from '../context/GamificationContext';

const rarityColors = {
    common: {
        bg: 'from-gray-600 to-gray-800',
        border: 'border-gray-500',
        glow: 'shadow-gray-500/30',
        text: 'text-gray-300'
    },
    rare: {
        bg: 'from-blue-600 to-blue-800',
        border: 'border-blue-400',
        glow: 'shadow-blue-500/50',
        text: 'text-blue-300'
    },
    epic: {
        bg: 'from-purple-600 to-purple-800',
        border: 'border-purple-400',
        glow: 'shadow-purple-500/50',
        text: 'text-purple-300'
    },
    legendary: {
        bg: 'from-yellow-500 to-orange-600',
        border: 'border-yellow-400',
        glow: 'shadow-yellow-500/50',
        text: 'text-yellow-300'
    }
};

export const AchievementPopup: React.FC = () => {
    const { recentUnlock, clearRecentUnlock } = useGamification();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (recentUnlock) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(clearRecentUnlock, 500);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [recentUnlock, clearRecentUnlock]);

    if (!recentUnlock) return null;

    const colors = rarityColors[recentUnlock.rarity];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.8 }}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none"
                >
                    <div className={`relative overflow-hidden rounded-2xl border-2 ${colors.border} shadow-2xl ${colors.glow}`}>
                        {/* Background with gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-95`} />

                        {/* Animated shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                        />

                        <div className="relative px-6 py-4 flex items-center gap-4">
                            {/* Icon with pulse animation */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="text-4xl"
                            >
                                {recentUnlock.icon}
                            </motion.div>

                            <div className="flex flex-col">
                                <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                                    Achievement Unlocked!
                                </span>
                                <span className="text-white font-bold text-lg">
                                    {recentUnlock.title}
                                </span>
                                <span className={`text-sm ${colors.text}`}>
                                    +{recentUnlock.points} points
                                </span>
                            </div>

                            {/* Rarity badge */}
                            <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${colors.text} bg-black/30`}>
                                {recentUnlock.rarity}
                            </div>
                        </div>

                        {/* Confetti particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    background: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f8a5c2'][i % 5],
                                    left: `${10 + i * 12}%`,
                                    top: '50%'
                                }}
                                initial={{ y: 0, opacity: 1 }}
                                animate={{
                                    y: [0, -50, 30],
                                    x: [(i % 2 === 0 ? -1 : 1) * 20, (i % 2 === 0 ? 1 : -1) * 30],
                                    opacity: [1, 1, 0],
                                    scale: [1, 1.5, 0]
                                }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface AchievementBadgeProps {
    achievement: Achievement;
    size?: 'sm' | 'md' | 'lg';
    showDetails?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
    achievement,
    size = 'md',
    showDetails = true
}) => {
    const colors = rarityColors[achievement.rarity];
    const sizeClasses = {
        sm: 'w-12 h-12 text-xl',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-20 h-20 text-3xl'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`relative group ${achievement.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
            {/* Badge circle */}
            <div
                className={`
                    ${sizeClasses[size]} 
                    rounded-full 
                    flex items-center justify-center
                    border-2 
                    transition-all duration-300
                    ${achievement.unlocked
                        ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
                        : 'bg-gray-900 border-gray-700 opacity-50 grayscale'
                    }
                `}
            >
                <span className={achievement.unlocked ? '' : 'opacity-30'}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                </span>
            </div>

            {/* Tooltip on hover */}
            {showDetails && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-black/95 backdrop-blur-md rounded-lg px-3 py-2 text-center min-w-[150px] border border-gray-700">
                        <div className="text-white font-semibold text-sm">{achievement.title}</div>
                        <div className="text-gray-400 text-xs mt-1">{achievement.description}</div>
                        <div className={`text-xs mt-1 ${colors.text}`}>
                            {achievement.unlocked ? `+${achievement.points} pts` : `${achievement.points} pts`}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export const AchievementsPanel: React.FC = () => {
    const {
        achievements,
        totalPoints,
        level,
        showAchievementsPanel,
        setShowAchievementsPanel,
        timeSpent,
        projectsViewed
    } = useGamification();

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const progressPercent = (unlockedCount / totalCount) * 100;

    const levelNames = ['Visitor', 'Explorer', 'Enthusiast', 'Fan', 'Super Fan'];
    const levelThresholds = [0, 50, 150, 300, 500];
    const nextLevelPoints = levelThresholds[level] || 999;
    const prevLevelPoints = levelThresholds[level - 1] || 0;
    const levelProgress = ((totalPoints - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!showAchievementsPanel) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowAchievementsPanel(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-orange-500/30 max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    🏆 Achievements
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    {unlockedCount} of {totalCount} unlocked
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAchievementsPanel(false)}
                                className="text-gray-400 hover:text-white transition-colors text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Level & Points */}
                        <div className="mt-4 flex gap-4">
                            <div className="flex-1 bg-gray-800/50 rounded-xl p-4">
                                <div className="text-orange-400 text-sm font-semibold">Level {level}</div>
                                <div className="text-white text-xl font-bold">{levelNames[level - 1]}</div>
                                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(levelProgress, 100)}%` }}
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                    />
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {totalPoints} / {nextLevelPoints} pts
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                    <div className="text-2xl">⏱️</div>
                                    <div className="text-white font-bold">{formatTime(timeSpent)}</div>
                                    <div className="text-gray-500 text-xs">Time</div>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                    <div className="text-2xl">📂</div>
                                    <div className="text-white font-bold">{projectsViewed}</div>
                                    <div className="text-gray-500 text-xs">Projects</div>
                                </div>
                            </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Overall Progress</span>
                                <span className="text-orange-400">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Achievements Grid */}
                    <div className="p-6 overflow-y-auto max-h-[50vh]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className="flex flex-col items-center">
                                    <AchievementBadge achievement={achievement} showDetails={false} />
                                    <div className="mt-2 text-center">
                                        <div className={`text-sm font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
                                            {achievement.title}
                                        </div>
                                        <div className={`text-xs ${achievement.unlocked ? rarityColors[achievement.rarity].text : 'text-gray-700'}`}>
                                            {achievement.rarity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer with hint */}
                    <div className="p-4 border-t border-gray-800 text-center">
                        <p className="text-gray-500 text-xs">
                            💡 Tip: Try exploring all sections, visiting at different times, or finding hidden secrets!
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Floating button to open achievements
export const AchievementsButton: React.FC = () => {
    const { achievements, setShowAchievementsPanel, level } = useGamification();
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const hasNew = achievements.some(a => a.unlocked && a.unlockedAt &&
        new Date().getTime() - new Date(a.unlockedAt).getTime() < 60000
    );

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAchievementsPanel(true)}
            className="fixed bottom-20 right-4 z-[100] bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-3 shadow-lg shadow-orange-500/30 border border-orange-400/50"
        >
            <div className="relative">
                <span className="text-2xl">🏆</span>

                {/* Badge count */}
                <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-orange-400">
                    {unlockedCount}
                </div>

                {/* New badge indicator */}
                {hasNew && (
                    <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full"
                    />
                )}
            </div>

            {/* Level indicator */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded-full text-xs text-orange-300 whitespace-nowrap">
                Lv.{level}
            </div>
        </motion.button>
    );
};

// Progress bar at top of page
export const ExplorationProgress: React.FC = () => {
    const { visitedSections, totalScrolled } = useGamification();

    const allSections = ['hero', 'about', 'skills', 'projects', 'achievements', 'contact', 'story'];
    const visitedCount = allSections.filter(s => visitedSections.has(s)).length;
    const sectionProgress = (visitedCount / allSections.length) * 100;
    const overallProgress = (sectionProgress + totalScrolled) / 2;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9997] h-1 bg-gray-900/50">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-600"
                style={{ boxShadow: '0 0 10px rgba(255,100,0,0.5)' }}
            />
        </div>
    );
};
