import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export const useSmoothScroll = () => {
  const scrollY = useMotionValue(0);
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 1000,
    damping: 100,
    mass: 3
  });
  
  const velocity = useSpring(0, {
    stiffness: 100,
    damping: 30
  });

  useEffect(() => {
    let previousY = window.scrollY;
    
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - previousY;
      
      scrollY.set(currentY);
      velocity.set(deltaY);
      
      previousY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY, velocity]);

  return { scrollY, smoothScrollY, velocity };
};