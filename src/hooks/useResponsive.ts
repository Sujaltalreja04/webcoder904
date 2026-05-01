import { useState, useEffect } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const isMobile = useTransform(
    useMotionValue(windowSize.width),
    [0, 768],
    [true, false]
  );

  const isTablet = useTransform(
    useMotionValue(windowSize.width),
    [768, 1024],
    [true, false]
  );

  const isDesktop = useTransform(
    useMotionValue(windowSize.width),
    [1024, Infinity],
    [true, false]
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: windowSize.width < 768,
    isMediumScreen: windowSize.width >= 768 && windowSize.width < 1024,
    isLargeScreen: windowSize.width >= 1024,
  };
};