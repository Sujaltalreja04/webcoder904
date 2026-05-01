import { StrictMode, useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App.tsx';
import './index.css';
import './mobile-performance.css';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { ScrollProvider } from './contexts/ScrollContext.tsx';

const Main = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register service worker for PWA functionality and cache management
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);

            // Check for updates every 60 seconds
            setInterval(() => {
              registration.update();
            }, 60000);

            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available, reload to get fresh content
                    console.log('New version available! Reloading...');
                    window.location.reload();
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Always show loading screen in development
    // In production, check if loading screen was already shown (in this session)
    const isDevelopment = import.meta.env.DEV;
    const hasShownLoading = sessionStorage.getItem('hasShownLoading');

    if (!isDevelopment && hasShownLoading) {
      // Skip loading screen in production if already shown in this session
      setLoading(false);
    } else {
      // Show loading screen
      // Keep it in session storage so it doesn't show again during navigation (production only)
      if (!isDevelopment) {
        sessionStorage.setItem('hasShownLoading', 'true');
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <ScrollProvider>
      <App />
    </ScrollProvider>
  );
};

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {convex ? (
      <ConvexProvider client={convex}>
        <HelmetProvider>
          <Main />
        </HelmetProvider>
      </ConvexProvider>
    ) : (
      <HelmetProvider>
        <Main />
      </HelmetProvider>
    )}
  </StrictMode>
);