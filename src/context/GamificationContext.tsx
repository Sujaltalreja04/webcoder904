import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';

// Achievement definitions
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
}

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
    {
        id: 'explorer',
        title: 'Explorer',
        description: 'Visited all sections of the portfolio',
        icon: '🧭',
        rarity: 'rare',
        points: 50
    },
    {
        id: 'project_hunter',
        title: 'Project Hunter',
        description: 'Viewed 3 or more projects in detail',
        icon: '🎯',
        rarity: 'common',
        points: 30
    },
    {
        id: 'deep_diver',
        title: 'Deep Diver',
        description: 'Spent 2+ minutes exploring the portfolio',
        icon: '🤿',
        rarity: 'rare',
        points: 40
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Visited between 10 PM and 6 AM',
        icon: '🦉',
        rarity: 'common',
        points: 20
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Visited between 5 AM and 9 AM',
        icon: '🐦',
        rarity: 'common',
        points: 20
    },
    {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Clicked on a social media link',
        icon: '🦋',
        rarity: 'common',
        points: 15
    },
    {
        id: 'tech_explorer',
        title: 'Tech Explorer',
        description: 'Visited the 3D Tech Gallery',
        icon: '🚀',
        rarity: 'rare',
        points: 35
    },
    {
        id: 'first_contact',
        title: 'First Contact',
        description: 'Initiated contact via form or email',
        icon: '👋',
        rarity: 'epic',
        points: 60
    },
    {
        id: 'curious_mind',
        title: 'Curious Mind',
        description: 'Had a conversation with the AI chatbot',
        icon: '🧠',
        rarity: 'rare',
        points: 40
    },
    {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Scrolled through the entire page',
        icon: '⚡',
        rarity: 'common',
        points: 25
    },
    {
        id: 'secret_agent',
        title: 'Secret Agent',
        description: 'Found a hidden easter egg',
        icon: '🕵️',
        rarity: 'legendary',
        points: 100
    },
    {
        id: 'konami_master',
        title: 'Konami Master',
        description: 'Entered the legendary Konami code',
        icon: '🎮',
        rarity: 'legendary',
        points: 150
    },
    {
        id: 'returning_visitor',
        title: 'Loyal Fan',
        description: 'Returned to visit the portfolio again',
        icon: '💖',
        rarity: 'epic',
        points: 75
    },
    {
        id: 'skill_seeker',
        title: 'Skill Seeker',
        description: 'Explored the skills section thoroughly',
        icon: '🎓',
        rarity: 'common',
        points: 20
    }
];

interface GamificationState {
    achievements: Achievement[];
    visitedSections: Set<string>;
    projectsViewed: number;
    timeSpent: number;
    totalScrolled: number;
    chatbotInteracted: boolean;
    socialClicked: boolean;
    contactInitiated: boolean;
    techGalleryVisited: boolean;
    totalPoints: number;
    level: number;
}

interface GamificationContextType extends GamificationState {
    unlockAchievement: (id: string) => void;
    trackSectionVisit: (sectionId: string) => void;
    trackProjectView: () => void;
    trackScroll: (percentage: number) => void;
    trackChatbotInteraction: () => void;
    trackSocialClick: () => void;
    trackContactInitiated: () => void;
    trackTechGalleryVisit: () => void;
    checkTimeBasedAchievements: () => void;
    getAchievementById: (id: string) => Achievement | undefined;
    isAchievementUnlocked: (id: string) => boolean;
    showAchievementsPanel: boolean;
    setShowAchievementsPanel: (show: boolean) => void;
    recentUnlock: Achievement | null;
    clearRecentUnlock: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_gamification';

// Calculate level from points
const calculateLevel = (points: number): number => {
    if (points >= 500) return 5;
    if (points >= 300) return 4;
    if (points >= 150) return 3;
    if (points >= 50) return 2;
    return 1;
};

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
    const [projectsViewed, setProjectsViewed] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const [totalScrolled, setTotalScrolled] = useState(0);
    const [chatbotInteracted, setChatbotInteracted] = useState(false);
    const [socialClicked, setSocialClicked] = useState(false);
    const [contactInitiated, setContactInitiated] = useState(false);
    const [techGalleryVisited, setTechGalleryVisited] = useState(false);
    const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
    const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
    const [isReturningVisitor, setIsReturningVisitor] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setAchievements(data.achievements || []);
                setVisitedSections(new Set(data.visitedSections || []));
                setProjectsViewed(data.projectsViewed || 0);
                setTimeSpent(data.timeSpent || 0);
                setTotalScrolled(data.totalScrolled || 0);
                setChatbotInteracted(data.chatbotInteracted || false);
                setSocialClicked(data.socialClicked || false);
                setContactInitiated(data.contactInitiated || false);
                setTechGalleryVisited(data.techGalleryVisited || false);
                setIsReturningVisitor(true);
            } catch (e) {
                console.error('Failed to load gamification data:', e);
                initializeAchievements();
            }
        } else {
            initializeAchievements();
        }
    }, []);

    const initializeAchievements = () => {
        const initialAchievements = ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: false
        }));
        setAchievements(initialAchievements);
    };

    // Save to localStorage whenever state changes (throttled)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (achievements.length > 0) {
            // Clear previous timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            // Throttle saves to once every 2 seconds
            saveTimeoutRef.current = setTimeout(() => {
                const data = {
                    achievements,
                    visitedSections: Array.from(visitedSections),
                    projectsViewed,
                    timeSpent,
                    totalScrolled,
                    chatbotInteracted,
                    socialClicked,
                    contactInitiated,
                    techGalleryVisited
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }, 2000);
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [achievements, visitedSections, projectsViewed, timeSpent, totalScrolled, chatbotInteracted, socialClicked, contactInitiated, techGalleryVisited]);

    // Track time spent (optimized with 5-second intervals)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSpent(prev => prev + 5);
        }, 5000); // Update every 5 seconds instead of 1
        return () => clearInterval(interval);
    }, []);

    // Check returning visitor achievement
    useEffect(() => {
        if (isReturningVisitor) {
            unlockAchievement('returning_visitor');
        }
    }, [isReturningVisitor]);

    // Check time-based achievements
    useEffect(() => {
        if (timeSpent >= 120) { // 2 minutes
            unlockAchievement('deep_diver');
        }
    }, [timeSpent]);

    // Check scroll achievement
    useEffect(() => {
        if (totalScrolled >= 90) {
            unlockAchievement('speed_demon');
        }
    }, [totalScrolled]);

    // Check project hunter achievement
    useEffect(() => {
        if (projectsViewed >= 3) {
            unlockAchievement('project_hunter');
        }
    }, [projectsViewed]);

    // Check explorer achievement
    useEffect(() => {
        const requiredSections = ['hero', 'about', 'skills', 'projects', 'achievements', 'contact'];
        const hasAllSections = requiredSections.every(s => visitedSections.has(s));
        if (hasAllSections) {
            unlockAchievement('explorer');
        }
    }, [visitedSections]);

    // Unlock achievement function
    const unlockAchievement = useCallback((id: string) => {
        setAchievements(prev => {
            const achievement = prev.find(a => a.id === id);
            if (!achievement || achievement.unlocked) return prev;

            const updated = prev.map(a =>
                a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
            );

            // Show notification
            const unlockedAchievement = { ...achievement, unlocked: true, unlockedAt: new Date() };
            setRecentUnlock(unlockedAchievement);

            return updated;
        });
    }, []);

    const trackSectionVisit = useCallback((sectionId: string) => {
        setVisitedSections(prev => {
            const newSet = new Set(prev);
            newSet.add(sectionId);
            return newSet;
        });
    }, []);

    const trackProjectView = useCallback(() => {
        setProjectsViewed(prev => prev + 1);
    }, []);

    const trackScroll = useCallback((percentage: number) => {
        setTotalScrolled(prev => Math.max(prev, percentage));
    }, []);

    const trackChatbotInteraction = useCallback(() => {
        if (!chatbotInteracted) {
            setChatbotInteracted(true);
            unlockAchievement('curious_mind');
        }
    }, [chatbotInteracted, unlockAchievement]);

    const trackSocialClick = useCallback(() => {
        if (!socialClicked) {
            setSocialClicked(true);
            unlockAchievement('social_butterfly');
        }
    }, [socialClicked, unlockAchievement]);

    const trackContactInitiated = useCallback(() => {
        if (!contactInitiated) {
            setContactInitiated(true);
            unlockAchievement('first_contact');
        }
    }, [contactInitiated, unlockAchievement]);

    const trackTechGalleryVisit = useCallback(() => {
        if (!techGalleryVisited) {
            setTechGalleryVisited(true);
            unlockAchievement('tech_explorer');
        }
    }, [techGalleryVisited, unlockAchievement]);

    const checkTimeBasedAchievements = useCallback(() => {
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 6) {
            unlockAchievement('night_owl');
        }
        if (hour >= 5 && hour < 9) {
            unlockAchievement('early_bird');
        }
    }, [unlockAchievement]);

    // Check time-based achievements on mount
    useEffect(() => {
        checkTimeBasedAchievements();
    }, [checkTimeBasedAchievements]);

    const getAchievementById = useCallback((id: string) => {
        return achievements.find(a => a.id === id);
    }, [achievements]);

    const isAchievementUnlocked = useCallback((id: string) => {
        const achievement = achievements.find(a => a.id === id);
        return achievement?.unlocked || false;
    }, [achievements]);

    const clearRecentUnlock = useCallback(() => {
        setRecentUnlock(null);
    }, []);

    const totalPoints = useMemo(() =>
        achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0),
        [achievements]
    );
    const level = useMemo(() => calculateLevel(totalPoints), [totalPoints]);

    const value: GamificationContextType = useMemo(() => ({
        achievements,
        visitedSections,
        projectsViewed,
        timeSpent,
        totalScrolled,
        chatbotInteracted,
        socialClicked,
        contactInitiated,
        techGalleryVisited,
        totalPoints,
        level,
        unlockAchievement,
        trackSectionVisit,
        trackProjectView,
        trackScroll,
        trackChatbotInteraction,
        trackSocialClick,
        trackContactInitiated,
        trackTechGalleryVisit,
        checkTimeBasedAchievements,
        getAchievementById,
        isAchievementUnlocked,
        showAchievementsPanel,
        setShowAchievementsPanel,
        recentUnlock,
        clearRecentUnlock
    }), [
        achievements,
        visitedSections,
        projectsViewed,
        timeSpent,
        totalScrolled,
        chatbotInteracted,
        socialClicked,
        contactInitiated,
        techGalleryVisited,
        totalPoints,
        level,
        unlockAchievement,
        trackSectionVisit,
        trackProjectView,
        trackScroll,
        trackChatbotInteraction,
        trackSocialClick,
        trackContactInitiated,
        trackTechGalleryVisit,
        checkTimeBasedAchievements,
        getAchievementById,
        isAchievementUnlocked,
        showAchievementsPanel,
        setShowAchievementsPanel,
        recentUnlock,
        clearRecentUnlock
    ]);

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
