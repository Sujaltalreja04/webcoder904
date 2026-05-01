import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Constellation data structure
interface Star {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'project' | 'skill' | 'achievement';
  description?: string;
  details?: {
    title: string;
    tech: string[];
    impact: string;
    link?: string;
  };
  size?: number;
  color?: string;
}

interface ConstellationConnection {
  from: string;
  to: string;
  label?: string;
}

interface ConstellationData {
  stars: Star[];
  connections: ConstellationConnection[];
}

// Production-ready constellation data
const CONSTELLATION_DATA: ConstellationData = {
  stars: [
    // Core Projects
    {
      id: 'infrasentinel',
      name: 'InfraSentinel',
      position: [0, 0, 0],
      type: 'project',
      description: 'AI-powered infrastructure monitoring',
      details: {
        title: 'InfraSentinel - Infrastructure Monitoring',
        tech: ['Python', 'TensorFlow', 'AWS', 'Docker'],
        impact: 'Reduced downtime by 40% through predictive maintenance',
        link: 'https://github.com/sktalreja/Infrasentinel'
      },
      size: 1.5,
      color: '#00ffff'
    },
    {
      id: 'evolvex',
      name: 'Evolvex AI',
      position: [8, 3, -5],
      type: 'project',
      description: 'Generative AI for business transformation',
      details: {
        title: 'Evolvex AI - Business Transformation',
        tech: ['GenAI', 'RAG', 'LangChain', 'React'],
        impact: 'Helped 10+ businesses automate workflows with AI',
        link: 'https://evolvex-ai.com'
      },
      size: 1.4,
      color: '#ff00ff'
    },
    {
      id: 'museai',
      name: 'MuseAI',
      position: [-7, 5, 3],
      type: 'project',
      description: 'AI art generation platform',
      details: {
        title: 'MuseAI - Creative AI Platform',
        tech: ['Stable Diffusion', 'FastAPI', 'Next.js'],
        impact: 'Generated 50K+ artworks for 1000+ users',
      },
      size: 1.2,
      color: '#ffff00'
    },
    
    // Technical Skills
    {
      id: 'ml-core',
      name: 'Machine Learning',
      position: [5, -4, 2],
      type: 'skill',
      description: 'Core ML expertise',
      details: {
        title: 'Machine Learning Expertise',
        tech: ['Scikit-learn', 'XGBoost', 'Random Forest', 'SVM'],
        impact: 'Built 20+ production ML models',
      },
      size: 1.0,
      color: '#00ff00'
    },
    {
      id: 'dl-deep',
      name: 'Deep Learning',
      position: [-5, -6, -3],
      type: 'skill',
      description: 'Neural networks & architectures',
      details: {
        title: 'Deep Learning Specialization',
        tech: ['PyTorch', 'TensorFlow', 'Transformers', 'CNNs', 'RNNs'],
        impact: 'Deployed computer vision & NLP solutions',
      },
      size: 1.1,
      color: '#ff6600'
    },
    {
      id: 'data-viz',
      name: 'Data Visualization',
      position: [3, 7, -4],
      type: 'skill',
      description: 'Turning data into insights',
      details: {
        title: 'Data Visualization & Analytics',
        tech: ['Tableau', 'Power BI', 'D3.js', 'Plotly'],
        impact: 'Created dashboards for C-level executives',
      },
      size: 0.9,
      color: '#00ccff'
    },
    
    // Achievements
    {
      id: 'cert-aws',
      name: 'AWS Certified',
      position: [-8, -2, 6],
      type: 'achievement',
      description: 'AWS Solutions Architect',
      details: {
        title: 'AWS Solutions Architect Associate',
        tech: ['EC2', 'Lambda', 'S3', 'RDS', 'CloudFormation'],
        impact: 'Certified to design scalable AWS architectures',
      },
      size: 0.8,
      color: '#ff9900'
    },
    {
      id: 'hackathon-win',
      name: 'Hackathon Winner',
      position: [6, -8, 4],
      type: 'achievement',
      description: '1st Place - AI Innovation Challenge',
      details: {
        title: 'National AI Hackathon Winner',
        tech: ['Computer Vision', 'Edge AI', 'IoT'],
        impact: 'Won among 500+ teams with real-time object detection system',
      },
      size: 0.85,
      color: '#ffd700'
    },
  ],
  connections: [
    { from: 'infrasentinel', to: 'ml-core', label: 'ML Models' },
    { from: 'infrasentinel', to: 'dl-deep', label: 'Anomaly Detection' },
    { from: 'evolvex', to: 'ml-core', label: 'NLP' },
    { from: 'evolvex', to: 'data-viz', label: 'Insights Dashboard' },
    { from: 'museai', to: 'dl-deep', label: 'Diffusion Models' },
    { from: 'museai', to: 'data-viz', label: 'Gallery UI' },
    { from: 'ml-core', to: 'cert-aws', label: 'Deployment' },
    { from: 'dl-deep', to: 'hackathon-win', label: 'Competition' },
    { from: 'data-viz', to: 'infrasentinel', label: 'Monitoring' },
  ]
};

// Animated star component
function AnimatedStar({ 
  star, 
  onClick, 
  isSelected 
}: { 
  star: Star; 
  onClick: (star: Star) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Debug: Log star rendering
  useEffect(() => {
    console.log(`⭐ Rendering star: ${star.name} at position`, star.position);
  }, [star.name, star.position]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(hovered || isSelected ? scale * 1.3 : scale);
      
      // Rotation
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={star.position}>
      {/* Glow effect */}
      <pointLight
        distance={3}
        intensity={2}
        color={star.color || '#ffffff'}
      />
      
      <mesh
        ref={meshRef}
        onClick={() => onClick(star)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[star.size || 1, 32, 32]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#ffffff' : (star.color || '#ffffff')}
          emissive={star.color || '#ffffff'}
          emissiveIntensity={hovered || isSelected ? 3 : 1.5}
          transparent
          opacity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Star label - wrapped in its own Suspense so font loading doesn't block the whole scene */}
      <Suspense fallback={null}>
        <Text
          position={[0, star.size || 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="bottom"
          fontWeight="bold"
        >
          {star.name}
        </Text>
      </Suspense>
    </group>
  );
}

// Connection lines between stars
function ConstellationLines({ 
  connections, 
  stars 
}: { 
  connections: ConstellationConnection[]; 
  stars: Star[];
}) {
  return (
    <>
      {connections.map((conn, idx) => {
        const fromStar = stars.find(s => s.id === conn.from);
        const toStar = stars.find(s => s.id === conn.to);
        
        if (!fromStar || !toStar) return null;
        
        return (
          <Line
            key={idx}
            points={[fromStar.position, toStar.position]}
            color="#4a90e2"
            lineWidth={1.5}
            transparent
            opacity={0.6}
            dashed={false}
          />
        );
      })}
    </>
  );
}

// Camera controller for smooth navigation
function CameraController({ targetPosition }: { targetPosition: THREE.Vector3 | null }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (targetPosition) {
      camera.position.lerp(targetPosition, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

// Main constellation scene
function ConstellationScene({ 
  onStarSelect 
}: { 
  onStarSelect: (star: Star) => void;
}) {
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const targetPosition = useRef<THREE.Vector3 | null>(null);
  
  // Debug: Log when scene mounts
  useEffect(() => {
    console.log('🎬 ConstellationScene mounted');
    console.log('Number of stars to render:', CONSTELLATION_DATA.stars.length);
  }, []);
  
  const handleStarClick = (star: Star) => {
    setSelectedStar(star);
    onStarSelect(star);
    
    // Move camera closer to selected star
    targetPosition.current = new THREE.Vector3(
      star.position[0] * 0.5,
      star.position[1] * 0.5,
      star.position[2] * 0.5 + 10
    );
  };

  return (
    <>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.3}
        minDistance={5}
        maxDistance={50}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
      />
      
      <CameraController targetPosition={targetPosition.current} />
      
      {/* Background stars - more visible */}
      <Stars 
        radius={100} 
        depth={50} 
        count={8000} 
        factor={6} 
        saturation={1} 
        fade 
        speed={2} 
      />
      
      {/* Enhanced lighting */}
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#4a90e2" />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      
      {/* Debug: Visual grid helper */}
      {/* <gridHelper args={[50, 50, 0xff0000, 0xffffff]} /> */}
      
      {/* Constellation stars */}
      {CONSTELLATION_DATA.stars.map((star) => (
        <AnimatedStar
          key={star.id}
          star={star}
          onClick={handleStarClick}
          isSelected={selectedStar?.id === star.id}
        />
      ))}
      
      {/* Connection lines */}
      <ConstellationLines 
        connections={CONSTELLATION_DATA.connections}
        stars={CONSTELLATION_DATA.stars}
      />
    </>
  );
}

// Detail panel component
function StarDetailPanel({ 
  star, 
  onClose 
}: { 
  star: Star | null; 
  onClose: () => void;
}) {
  if (!star?.details) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute top-4 right-4 w-80 bg-black/90 backdrop-blur-lg border border-cyan-500/50 rounded-lg p-6 text-white z-10"
      style={{ fontFamily: 'Orbitron, sans-serif' }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>
      
      <h3 className="text-xl font-bold mb-2 text-cyan-400">{star.details.title}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {star.details.tech.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-cyan-900/50 border border-cyan-500/30 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm text-gray-400 mb-2">Impact</h4>
          <p className="text-sm text-gray-300">{star.details.impact}</p>
        </div>
        
        {star.details.link && (
          <a
            href={star.details.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded hover:from-cyan-400 hover:to-blue-400 transition-all text-sm font-semibold"
          >
            View Project →
          </a>
        )}
      </div>
    </motion.div>
  );
}

// Main navigator component
export function ConstellationNavigator({ onClose }: { onClose: () => void }) {
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Debug: Log constellation data
  useEffect(() => {
    console.log('🌌 Constellation Navigator opened');
    console.log('Stars count:', CONSTELLATION_DATA.stars.length);
    console.log('Connections count:', CONSTELLATION_DATA.connections.length);
  }, []);
  
  // Prevent body scroll when navigator is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      className="fixed inset-0 bg-black z-[9999]"
      onClick={(e) => {
        // Close if clicking outside the canvas
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          🌌 Secret Constellation Navigator
        </h2>
        <p className="text-sm text-gray-400 max-w-md">
          Explore my journey through the stars. Click on any constellation to discover projects, skills, and achievements.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          🖱️ Drag to rotate • Scroll to zoom • Click stars for details
        </p>
      </div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-cyan-400 transition-colors"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <X size={24} />
      </button>
      
      {/* Detail panel */}
      <AnimatePresence>
        {selectedStar && (
          <StarDetailPanel 
            star={selectedStar} 
            onClose={() => setSelectedStar(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-[50] pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-4">🌌</div>
            <p className="text-lg animate-pulse">Loading constellation...</p>
          </div>
        </div>
      )}
      
      {/* 3D Canvas - Main Container */}
      <div 
        className="absolute inset-0" 
        style={{ zIndex: 1, pointerEvents: 'auto' }}
      >
        <Canvas 
          camera={{ position: [0, 0, 30], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]} // Performance optimization
          onCreated={() => setIsLoaded(true)}
          style={{ 
            width: '100%', 
            height: '100%',
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Suspense fallback={null}>
            <ConstellationScene onStarSelect={setSelectedStar} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Footer hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-gray-500 text-xs z-[20]">
        Press <kbd className="px-2 py-1 bg-gray-800 rounded">ESC</kbd> or click ✕ to close
      </div>
    </motion.div>
  );
}
