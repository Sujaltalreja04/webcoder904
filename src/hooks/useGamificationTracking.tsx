import React, { useEffect, useCallback } from 'react';
import { useGamification } from '../context/GamificationContext';

// Custom hook for tracking section visibility
export const useSectionTracker = (sectionId: string) => {
    const { trackSectionVisit } = useGamification();

    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackSectionVisit(sectionId);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.3, // 30% of section must be visible
            rootMargin: '-50px'
        });

        // Find the section element
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }

        return () => observer.disconnect();
    }, [sectionId, trackSectionVisit]);
};

// Hook for tracking scroll progress
export const useScrollTracker = () => {
    const { trackScroll } = useGamification();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
            trackScroll(scrollPercent);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [trackScroll]);
};

// Hook for Konami code easter egg
export const useKonamiCode = () => {
    const { unlockAchievement, isAchievementUnlocked } = useGamification();

    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let inputSequence: string[] = [];

        const handleKeyDown = (e: KeyboardEvent) => {
            inputSequence.push(e.key);

            // Keep only last 10 inputs
            if (inputSequence.length > 10) {
                inputSequence = inputSequence.slice(-10);
            }

            // Check if sequence matches
            if (inputSequence.length === 10 &&
                inputSequence.every((key, i) => key.toLowerCase() === konamiCode[i].toLowerCase())) {
                if (!isAchievementUnlocked('konami_master')) {
                    unlockAchievement('konami_master');
                    // Trigger fun effect
                    triggerKonamiEffect();
                }
                inputSequence = [];
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [unlockAchievement, isAchievementUnlocked]);
};

// Fun visual effect when Konami code is entered
const triggerKonamiEffect = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f8a5c2', '#a29bfe', '#fd79a8'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden;';
    document.body.appendChild(container);

    // Create confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -20px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        container.appendChild(confetti);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Cleanup after animation
    setTimeout(() => {
        container.remove();
        style.remove();
    }, 5000);
};

// Hook for secret click easter egg (e.g., clicking logo 5 times)
export const useSecretClick = (requiredClicks: number = 5) => {
    const { unlockAchievement, isAchievementUnlocked } = useGamification();
    let clickCount = 0;
    let lastClickTime = 0;

    const handleSecretClick = useCallback(() => {
        const now = Date.now();

        // Reset if more than 2 seconds between clicks
        if (now - lastClickTime > 2000) {
            clickCount = 0;
        }

        lastClickTime = now;
        clickCount++;

        if (clickCount >= requiredClicks && !isAchievementUnlocked('secret_agent')) {
            unlockAchievement('secret_agent');
            clickCount = 0;
        }
    }, [unlockAchievement, isAchievementUnlocked]);

    return handleSecretClick;
};

// Component to wrap sections for automatic tracking
export const TrackedSection: React.FC<{
    id: string;
    children: React.ReactNode;
    className?: string;
}> = ({ id, children, className }) => {
    useSectionTracker(id);

    return (
        <section id={id} className={className}>
            {children}
        </section>
    );
};

// Component that tracks all sections automatically
export const SectionTracker: React.FC = () => {
    const { trackSectionVisit } = useGamification();

    useEffect(() => {
        const sections = ['hero', 'about', 'story', 'projects', 'skills', 'achievements', 'planning', 'contact'];

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id) {
                    trackSectionVisit(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.2,
            rootMargin: '-50px'
        });

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });

        return () => observer.disconnect();
    }, [trackSectionVisit]);

    return null;
};
