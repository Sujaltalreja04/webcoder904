import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

interface ScrollPrediction {
    nextSection: string;
    confidence: number;
    sectionId: string;
}

const SECTIONS = [
    { id: 'hero', name: 'Home', weight: 1 },
    { id: 'about', name: 'About', weight: 0.9 },
    { id: 'story', name: 'Story', weight: 0.8 },
    { id: 'projects', name: 'Projects', weight: 1.2 },
    { id: 'skills', name: 'Skills', weight: 0.9 },
    { id: 'achievements', name: 'Achievements', weight: 0.8 },
    { id: 'planning', name: 'Roadmap', weight: 1.1 },
    { id: 'contact', name: 'Contact', weight: 0.7 },
];

export const SmartScrollPredictor = () => {
    const [currentSection, setCurrentSection] = useState('hero');
    const [prediction, setPrediction] = useState<ScrollPrediction | null>(null);
    const [scrollVelocity, setScrollVelocity] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track scroll behavior and predict next section (optimized with throttling)
    useEffect(() => {
        // Disable on mobile for better performance
        if (isMobile) {
            setPrediction(null);
            return;
        }

        let scrollTimer: NodeJS.Timeout;
        let sectionStartTime = Date.now();
        let isThrottled = false;
        let lastUpdate = 0;

        const handleScroll = () => {
            const now = Date.now();
            const throttleDelay = isMobile ? 200 : 100; // More aggressive throttling on mobile

            // Throttle scroll events
            if (isThrottled || now - lastUpdate < throttleDelay) return;
            isThrottled = true;
            lastUpdate = now;
            setTimeout(() => { isThrottled = false; }, throttleDelay);

            const scrollY = window.scrollY;
            const velocity = scrollY - lastScrollY;
            setScrollVelocity(velocity);
            setLastScrollY(scrollY);

            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                setScrollVelocity(0);
            }, 150);

            // Detect current section
            const sections = SECTIONS.map(s => s.id);
            let current = 'hero';

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        if (current !== currentSection) {
                            // Track time spent in previous section
                            const timeSpent = Date.now() - sectionStartTime;
                            setSectionTimes(prev => ({
                                ...prev,
                                [currentSection]: (prev[currentSection] || 0) + timeSpent
                            }));
                            sectionStartTime = Date.now();
                        }
                        current = sectionId;
                        break;
                    }
                }
            }

            setCurrentSection(current);

            // Predict next section using simple AI heuristic
            const currentIndex = sections.indexOf(current);
            if (currentIndex >= 0 && currentIndex < sections.length - 1) {
                const scrollDirection = velocity > 0 ? 1 : -1;
                let nextIndex = currentIndex + scrollDirection;

                // Boundary check
                nextIndex = Math.max(0, Math.min(sections.length - 1, nextIndex));

                // Calculate confidence based on scroll velocity and section popularity
                const baseConfidence = Math.min(95, Math.abs(velocity) * 5 + 60);
                const sectionWeight = SECTIONS[nextIndex].weight;
                const visitTime = sectionTimes[SECTIONS[nextIndex].id] || 0;
                const timeBonus = Math.min(10, visitTime / 1000); // More time = more likely to revisit

                const confidence = Math.min(99, baseConfidence * sectionWeight + timeBonus);

                setPrediction({
                    nextSection: SECTIONS[nextIndex].name,
                    confidence: Math.round(confidence),
                    sectionId: SECTIONS[nextIndex].id,
                });

                // Preload next section content
                preloadSection(SECTIONS[nextIndex].id);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimer);
        };
    }, [lastScrollY, currentSection, sectionTimes, isMobile]);

    // Preload section content intelligently
    const preloadSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            // Preload images in the section
            const images = section.querySelectorAll('img[data-src]');
            images.forEach(img => {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.setAttribute('src', src);
                }
            });

            // Add 'preloading' class for any custom preload logic
            section.classList.add('preloaded');
        }
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {prediction && scrollVelocity !== 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 left-6 z-40"
                >
                    <motion.div
                        className="backdrop-blur-md bg-[rgba(26,26,26,0.9)] border border-[rgba(192,192,192,0.3)] rounded-xl p-4 shadow-2xl"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <Sparkles className="w-5 h-5 text-blue-400" />
                            </motion.div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-xs text-gray-500">AI Prediction:</p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${prediction.confidence}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400">{prediction.confidence}%</span>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={() => scrollToSection(prediction.sectionId)}
                                    className="flex items-center gap-2 text-white font-semibold hover:text-blue-400 transition-colors"
                                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                                    whileHover={{ x: 5 }}
                                >
                                    <span className="text-sm">Next: {prediction.nextSection}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Decorative glow */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-xl rounded-xl" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
