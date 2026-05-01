import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useTexture, MeshReflectorMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Move, Eye, Info, PlayCircle, Pause, Loader2 } from 'lucide-react';

interface Museum3DGalleryProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        title: string;
        description: string;
        image: string;
        tags: string[];
        projectUrl?: string;
        githubUrl?: string;
        videoUrl?: string;
    };
}

// Floating Particles for atmosphere
function FloatingParticles() {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 100;

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = Math.random() * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    useFrame(({ clock }) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Dynamic Spotlight that moves
function DynamicSpotlight() {
    const lightRef = useRef<THREE.SpotLight>(null);

    useFrame(({ clock }) => {
        if (lightRef.current) {
            lightRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 5;
            lightRef.current.position.z = -5 + Math.cos(clock.getElapsedTime() * 0.3) * 3;
        }
    });

    return (
        <spotLight
            ref={lightRef}
            position={[0, 8, -5]}
            angle={0.4}
            penumbra={1}
            intensity={2}
            color="#00d4ff"
            castShadow
        />
    );
}

// Enhanced Museum Room with reflective floor and improved texture handling
function MuseumRoom({ projectImage }: { projectImage: string }) {
    // Load texture with proper error handling via Suspense
    const texture = useTexture(projectImage);

    // Configure texture for better quality
    useEffect(() => {
        if (texture) {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = 16;
        }
    }, [texture]);

    return (
        <group>
            {/* ENHANCED FLOOR with Premium Reflections */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <MeshReflectorMaterial
                    mirror={0.7}
                    blur={[400, 120]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={0.6}
                    roughness={0.8}
                    depthScale={1.4}
                    minDepthThreshold={0.3}
                    maxDepthThreshold={1.6}
                    color="#1a1a1a"
                    metalness={0.9}
                />
            </mesh>

            {/* Ceiling with enhanced material */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Back Wall with improved gradient */}
            <mesh position={[0, 2, -10]} receiveShadow>
                <planeGeometry args={[30, 10]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.7}
                    metalness={0.3}
                />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-15, 2, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[30, 10]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.7}
                    metalness={0.3}
                />
            </mesh>

            {/* Right Wall */}
            <mesh position={[15, 2, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[30, 10]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    roughness={0.7}
                    metalness={0.3}
                />
            </mesh>

            {/* Enhanced glowing accent strips on walls */}
            <mesh position={[-14.9, 4, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.3]} />
                <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.7}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[14.9, 4, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.3]} />
                <meshStandardMaterial
                    color="#ff00ff"
                    emissive="#ff00ff"
                    emissiveIntensity={0.7}
                    toneMapped={false}
                />
            </mesh>

            {/* ENHANCED HOLOGRAM-STYLE Project Display Frame */}
            <group position={[0, 1.5, -9.8]}>
                {/* Premium Frame Border with ultra-metallic finish */}
                <mesh position={[0, 0, 0.01]} castShadow>
                    <boxGeometry args={[8.4, 5.4, 0.2]} />
                    <meshStandardMaterial
                        color="#e0e0e0"
                        metalness={0.98}
                        roughness={0.02}
                        envMapIntensity={1.5}
                    />
                </mesh>

                {/* Hologram Frame Glow */}
                <mesh position={[0, 0, 0.05]}>
                    <boxGeometry args={[8.6, 5.6, 0.05]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={0.4}
                        transparent
                        opacity={0.3}
                        toneMapped={false}
                    />
                </mesh>

                {/* Enhanced Project Image with better clarity */}
                <mesh position={[0, 0, 0.11]}>
                    <planeGeometry args={[8, 5]} />
                    <meshStandardMaterial
                        map={texture}
                        emissive="#ffffff"
                        emissiveIntensity={0.4}
                        toneMapped={false}
                    />
                </mesh>

                {/* Enhanced spotlight array on frame */}
                <spotLight
                    position={[0, 4, 2]}
                    angle={0.5}
                    penumbra={0.7}
                    intensity={4}
                    color="#ffffff"
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />

                {/* Enhanced Rim lighting */}
                <pointLight position={[-4.5, 0, 0.5]} intensity={0.8} color="#00ffff" distance={8} />
                <pointLight position={[4.5, 0, 0.5]} intensity={0.8} color="#ff00ff" distance={8} />
                <pointLight position={[0, 2.5, 0.5]} intensity={0.5} color="#ffffff" distance={6} />
                <pointLight position={[0, -2.5, 0.5]} intensity={0.5} color="#ffffff" distance={6} />
            </group>

            {/* Enhanced Pedestal with hologram glow */}
            <group position={[0, -1, -7]}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.8, 1, 2, 32]} />
                    <meshStandardMaterial
                        color="#4a4a4a"
                        metalness={0.8}
                        roughness={0.2}
                        envMapIntensity={1.2}
                    />
                </mesh>
                {/* Enhanced Glowing top ring */}
                <mesh position={[0, 1.05, 0]}>
                    <torusGeometry args={[0.82, 0.06, 16, 100]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={1.5}
                        toneMapped={false}
                    />
                </mesh>
                {/* Pulsing center light */}
                <pointLight position={[0, 1.1, 0]} intensity={1} color="#00ffff" distance={5} />
            </group>

            {/* Enhanced ambient lighting spheres */}
            <group>
                <mesh position={[-8, 4, -8]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={2.5}
                        toneMapped={false}
                    />
                    <pointLight intensity={2} color="#00ffff" distance={12} />
                </mesh>

                <mesh position={[8, 4, -8]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial
                        color="#ff00ff"
                        emissive="#ff00ff"
                        emissiveIntensity={2.5}
                        toneMapped={false}
                    />
                    <pointLight intensity={2} color="#ff00ff" distance={12} />
                </mesh>

                {/* Additional premium ceiling lights */}
                <mesh position={[0, 5.8, 0]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={1.5}
                        toneMapped={false}
                    />
                    <pointLight intensity={2.5} color="#ffffff" distance={18} />
                </mesh>
            </group>
        </group>
    );
}

// Clickable Info Point in 3D Space
function ClickableInfoPoint({
    position,
    label,
    description,
    color = "#00ffff"
}: {
    position: [number, number, number];
    label: string;
    description: string;
    color?: string;
}) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1;
            meshRef.current.rotation.y += 0.02;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setClicked(!clicked)}
                scale={hovered ? 1.3 : 1}
            >
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 2 : 1}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Pulsing ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.25, 32]} />
                <meshBasicMaterial color={color} transparent opacity={hovered ? 0.8 : 0.4} />
            </mesh>

            {/* Info panel when clicked or hovered */}
            {(clicked || hovered) && (
                <Html distanceFactor={4} position={[0, 0.5, 0]}>
                    <div style={{
                        background: 'rgba(26, 26, 26, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${color}`,
                        borderRadius: '12px',
                        padding: '16px',
                        minWidth: '200px',
                        boxShadow: `0 0 20px ${color}`,
                        fontFamily: 'Orbitron, sans-serif',
                    }}>
                        <h4 style={{
                            color: color,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            {label}
                        </h4>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '13px',
                            lineHeight: '1.4'
                        }}>
                            {description}
                        </p>
                    </div>
                </Html>
            )}

            <pointLight color={color} intensity={hovered ? 2 : 1} distance={5} />
        </group>
    );
}

// Auto-Tour Camera Animation
function AutoTourCamera({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
    const { camera } = useThree();
    const startTime = useRef(0);
    const tourDuration = 15; // 15 seconds tour

    useEffect(() => {
        if (isActive) {
            startTime.current = Date.now();
        }
    }, [isActive]);

    useFrame(() => {
        if (!isActive) return;

        const elapsed = (Date.now() - startTime.current) / 1000;
        const progress = Math.min(elapsed / tourDuration, 1);

        if (progress >= 1) {
            onComplete();
            return;
        }

        // Cinematic camera path
        const angle = progress * Math.PI * 2;
        const radius = 8 - progress * 3; // Move closer

        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = 10 - progress * 15; // Move forward
        camera.position.y = 1 + Math.sin(progress * Math.PI) * 2; // Arc up and down

        // Look at the main display
        camera.lookAt(0, 1.5, -9.8);
    });

    return null;
}

// Loading Fallback Component with Premium Design
function LoadingFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center gap-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <div className="text-cyan-300 text-lg font-semibold">Loading 3D Gallery...</div>
                <div className="text-gray-400 text-sm">Preparing hologram display</div>
            </div>
        </Html>
    );
}


// Camera Controller for manual navigation
function CameraController({ enabled }: { enabled: boolean }) {
    const { camera } = useThree();
    const [keys, setKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(e.key.toLowerCase());
                return newSet;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (!enabled) return;

        const speed = 0.1;
        const direction = new THREE.Vector3();

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, direction).normalize();

        // WASD Controls
        if (keys.has('w') || keys.has('arrowup')) {
            camera.position.addScaledVector(direction, -speed);
        }
        if (keys.has('s') || keys.has('arrowdown')) {
            camera.position.addScaledVector(direction, speed);
        }
        if (keys.has('a') || keys.has('arrowleft')) {
            camera.position.addScaledVector(right, speed);
        }
        if (keys.has('d') || keys.has('arrowright')) {
            camera.position.addScaledVector(right, -speed);
        }

        // Keep camera at reasonable height
        camera.position.y = Math.max(0, Math.min(4, camera.position.y));

        // Boundary constraints
        camera.position.x = Math.max(-12, Math.min(12, camera.position.x));
        camera.position.z = Math.max(-5, Math.min(15, camera.position.z));
    });

    return null;
}

export const Museum3DGallery: React.FC<Museum3DGalleryProps> = ({
    isOpen,
    onClose,
    project
}) => {
    const [showInstructions, setShowInstructions] = useState(true);
    const [autoTourActive, setAutoTourActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShowInstructions(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const toggleAutoTour = () => {
        setAutoTourActive(!autoTourActive);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 bg-black"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 p-3 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 hover:bg-[rgba(192,192,192,0.2)] transition-all"
                    >
                        <X size={24} />
                    </button>

                    {/* Title Banner */}
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        className="absolute top-6 left-6 z-50 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-[rgba(192,192,192,0.3)] rounded-xl px-6 py-4"
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-3">
                            <Eye className="text-cyan-400" size={28} />
                            3D Museum Gallery
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{project.title}</p>
                    </motion.div>

                    {/* Auto-Tour Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleAutoTour}
                        className={`absolute top-32 left-6 z-50 px-6 py-3 backdrop-blur-md border rounded-xl font-semibold transition-all flex items-center gap-2 ${autoTourActive
                            ? 'bg-cyan-500/30 border-cyan-400/60 text-cyan-300'
                            : 'bg-[rgba(26,26,26,0.8)] border-[rgba(192,192,192,0.3)] text-gray-300'
                            }`}
                    >
                        {autoTourActive ? <Pause size={20} /> : <PlayCircle size={20} />}
                        {autoTourActive ? 'Stop Auto-Tour' : 'Start Auto-Tour'}
                    </motion.button>

                    {/* Instructions Panel */}
                    <AnimatePresence>
                        {showInstructions && !autoTourActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-[rgba(26,26,26,0.9)] border border-cyan-400/40 rounded-xl px-8 py-4 max-w-2xl"
                            >
                                <div className="flex items-start gap-4">
                                    <Info className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2">Navigation Controls</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Move size={16} className="text-cyan-400" />
                                                <span><strong>WASD</strong> or <strong>Arrow Keys</strong> - Move</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Eye size={16} className="text-cyan-400" />
                                                <span><strong>Mouse Drag</strong> - Look around</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-cyan-300 mt-3">
                                            💡 Click on glowing orbs for more info • Try Auto-Tour for a guided experience
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-3">
                        {project.projectUrl && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(project.projectUrl, '_blank')}
                                className="px-6 py-3 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-cyan-400/40 rounded-xl text-cyan-300 hover:bg-cyan-500/20 transition-all font-semibold"
                            >
                                Visit Live Project
                            </motion.button>
                        )}
                        {project.videoUrl && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.open(project.videoUrl, '_blank')}
                                className="px-6 py-3 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-purple-400/40 rounded-xl text-purple-300 hover:bg-purple-500/20 transition-all font-semibold"
                            >
                                Watch Demo Video
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="px-6 py-3 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 hover:bg-gray-500/20 transition-all font-semibold"
                        >
                            {showInstructions ? 'Hide' : 'Show'} Controls
                        </motion.button>
                    </div>

                    {/* 3D Canvas with Suspense for better loading */}
                    <Canvas shadows>
                        <Suspense fallback={<LoadingFallback />}>
                            <PerspectiveCamera makeDefault position={[0, 1, 10]} fov={75} />

                            {/* Premium Environment Map */}
                            <Environment preset="night" />

                            {/* Enhanced Lighting Setup */}
                            <ambientLight intensity={0.2} />
                            <directionalLight
                                position={[10, 10, 5]}
                                intensity={0.4}
                                castShadow
                                shadow-mapSize-width={2048}
                                shadow-mapSize-height={2048}
                            />

                            {/* Dynamic spotlight */}
                            <DynamicSpotlight />

                            {/* Key lights */}
                            <pointLight position={[0, 6, 0]} intensity={1.2} color="#ffffff" />
                            <pointLight position={[-8, 4, -8]} intensity={1} color="#00ffff" distance={15} />
                            <pointLight position={[8, 4, -8]} intensity={1} color="#ff00ff" distance={15} />
                            <pointLight position={[0, 2, 5]} intensity={0.5} color="#ffffff" />

                            {/* Museum Environment */}
                            <MuseumRoom projectImage={project.image} />

                            {/* Floating Particles */}
                            <FloatingParticles />

                            {/* Clickable Info Points */}
                            <ClickableInfoPoint
                                position={[-4, 2, -6]}
                                label="Tech Stack"
                                description={`Built with: ${project.tags.slice(0, 3).join(', ')}`}
                                color="#00ffff"
                            />
                            <ClickableInfoPoint
                                position={[4, 2, -6]}
                                label="Features"
                                description={project.description}
                                color="#ff00ff"
                            />
                            <ClickableInfoPoint
                                position={[0, 3.5, -4]}
                                label="Project Info"
                                description="Click the buttons on the right to explore more!"
                                color="#ffaa00"
                            />

                            {/* Camera Controls */}
                            {autoTourActive ? (
                                <AutoTourCamera
                                    isActive={autoTourActive}
                                    onComplete={() => setAutoTourActive(false)}
                                />
                            ) : (
                                <>
                                    <OrbitControls
                                        enablePan={false}
                                        enableZoom={true}
                                        minDistance={2}
                                        maxDistance={15}
                                        maxPolarAngle={Math.PI / 2}
                                        target={[0, 1, -5]}
                                    />
                                    <CameraController enabled={!autoTourActive} />
                                </>
                            )}

                            {/* Atmospheric fog */}
                            <fog attach="fog" args={['#0a0a0a', 15, 30]} />
                        </Suspense>
                    </Canvas>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
