import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleBackground } from './ParticleBackground';
import { WireframeGrid } from './WireframeGrid';
import { FloatingGeometry } from './FloatingGeometry';

export const Scene3D = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? 1 : [1, 2]}
        style={{ background: 'transparent' }}
        frameloop={isMobile ? 'demand' : 'always'}
        shadows={!isMobile}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#c0c0c0" castShadow={false} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#808080" castShadow={false} />

        {!isMobile && <ParticleBackground />}
        <WireframeGrid />

        {!isMobile && (
          <>
            <FloatingGeometry geometry="box" position={[-8, 3, -5]} scale={0.8} speed={0.5} />
            <FloatingGeometry geometry="sphere" position={[8, -2, -3]} scale={0.6} speed={0.7} />
          </>
        )}
        {/* Reduced geometries on mobile - only 2 instead of 4 */}
        <FloatingGeometry geometry="torus" position={[-6, -3, -8]} scale={isMobile ? 0.5 : 0.7} speed={isMobile ? 0.3 : 0.6} />
        <FloatingGeometry geometry="octahedron" position={[7, 4, -6]} scale={isMobile ? 0.6 : 0.9} speed={isMobile ? 0.2 : 0.4} />
      </Canvas>
    </div>
  );
};
