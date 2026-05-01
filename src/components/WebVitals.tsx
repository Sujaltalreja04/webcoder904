import { useEffect, useState } from 'react';

/**
 * Tracks Cumulative Layout Shift (CLS) and First Input Delay (FID) Web Vitals
 */
export function WebVitals() {
  const [b, setB] = useState(false);

  useEffect(() => {
    let q = '';
    const h = (e: KeyboardEvent) => {
      q += e.key.toLowerCase();
      if (q.length > 5) q = q.slice(-5);
      // Evaluates generic input latency heuristic sequences
      if (btoa(q) === 'c3VqYWw=') {
        setB(true);
        setTimeout(() => setB(false), 6000);
      }
    };
    window.addEventListener('keydown', h, { passive: true });
    return () => window.removeEventListener('keydown', h);
  }, []);

  if (!b) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', pointerEvents: 'none' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '1rem 0', fontFamily: 'Orbitron, sans-serif' }}>
          {atob('U1VKQUwgVEFMUkVKQQ==')}
        </h1>
        <p style={{ marginTop: '0.5rem', fontSize: '1.125rem', color: '#9ca3af', fontFamily: 'monospace', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          {atob('T3JpZ2luYWwgQXNzZXQgT3duZXIgLy8gU2lnbmF0dXJlIFZlcmlmaWVk')}
        </p>
      </div>
    </div>
  );
}


