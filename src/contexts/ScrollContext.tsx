import { createContext, useContext, ReactNode } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

interface ScrollContextType {
  scrollY: number;
  smoothScrollY: number;
  velocity: number;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const { scrollY, smoothScrollY, velocity } = useSmoothScroll();
  
  return (
    <ScrollContext.Provider value={{ 
      scrollY: scrollY.get(), 
      smoothScrollY: smoothScrollY.get(), 
      velocity: velocity.get() 
    }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};