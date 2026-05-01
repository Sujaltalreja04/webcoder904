import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    // Faster loading simulation
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 30;
        if (newProgress >= 100) {
          clearInterval(timer);
          // Show 100% for a brief moment
          setTimeout(() => {
            setShowLoader(false);
            // Delay completion slightly for smooth transition
            setTimeout(onComplete, 300);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a] z-50"
          style={{ willChange: 'opacity' }}
        >
          {/* Subtle background particles - reduced for mobile */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: isMobile ? 5 : 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gray-600"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  willChange: 'transform, opacity',
                }}
                animate={
                  isMobile
                    ? {
                      // Simplified animation for mobile
                      y: [0, -20, 0],
                      opacity: [0.1, 0.2, 0.1],
                    }
                    : {
                      y: [0, -30 - Math.random() * 20, 0],
                      x: [0, Math.random() * 10 - 5, 0],
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.2, 1],
                    }
                }
                transition={{
                  duration: isMobile ? 2 : 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="text-center w-full max-w-md px-4">
            {/* Enhanced name animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
              }}
              className="mb-16 relative"
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-clip-text text-transparent"
                style={{ fontFamily: 'Orbitron, sans-serif', willChange: 'transform' }}
                animate={
                  isMobile
                    ? {} // No animation on mobile for better performance
                    : {
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                SUJAL T
              </motion.h1>

              {/* Glowing effect behind the name - disabled on mobile */}
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 blur-2xl opacity-30"
                  style={{
                    background: 'conic-gradient(from 0deg, #c0c0c0, #808080, #404040, #808080, #c0c0c0)',
                    borderRadius: '50%',
                    width: '150%',
                    height: '150%',
                    left: '-25%',
                    top: '-25%',
                    willChange: 'transform',
                  }}
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>

            {/* Enhanced progress bar with glow */}
            <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mb-3 overflow-hidden shadow-lg">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                style={{
                  boxShadow: progress > 0 ? '0 0 15px rgba(203, 213, 225, 0.6), 0 0 30px rgba(148, 163, 184, 0.4)' : 'none',
                }}
              />
            </div>

            {/* Progress percentage with glow effect */}
            <motion.p
              className="text-gray-400 text-sm tracking-wider"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.min(Math.round(progress), 100)}%
            </motion.p>

            {/* Enhanced loading indicator */}
            <motion.div
              className="flex justify-center space-x-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-gray-400 rounded-full"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>

            {/* Subtle subtitle */}
            <motion.p
              className="text-gray-500 text-xs mt-12 uppercase tracking-widest"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2 }}
            >
              PORTFOLIO LOADING
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};