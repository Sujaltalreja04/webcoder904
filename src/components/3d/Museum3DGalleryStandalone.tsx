import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, MeshReflectorMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Move, Eye, Info, PlayCircle, Pause, Loader2 } from 'lucide-react';

interface Museum3DGalleryStandaloneProps {
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
                color="#ff4500"
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
            color="#ff4500"
            castShadow
        />
    );
}

function MuseumRoom({ projectImage }: { projectImage: string }) {
    // Load texture with proper CORS handling
    const loader = new THREE.TextureLoader();
    const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        loader.setCrossOrigin('anonymous');
        loader.load(
            projectImage,
            (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.anisotropy = 16;
                texture.needsUpdate = true;
                texture.colorSpace = THREE.SRGBColorSpace;
                setLoadedTexture(texture);
                console.log('Texture loaded successfully:', projectImage);
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
            }
        );
    }, [projectImage]);

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

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Back Wall */}
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

            {/* Glowing accent strips on walls */}
            <mesh position={[-14.9, 4, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.3]} />
                <meshStandardMaterial
                    color="#ff4500"
                    emissive="#ff4500"
                    emissiveIntensity={0.8}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[14.9, 4, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.3]} />
                <meshStandardMaterial
                    color="#ff6b00"
                    emissive="#ff6b00"
                    emissiveIntensity={0.8}
                    toneMapped={false}
                />
            </mesh>

            {/* ENHANCED HOLOGRAM-STYLE Project Display Frame with GLOWING BACKGROUND */}
            <group position={[0, 1.5, -9.8]}>
                {/* GLOWING BACKGROUND LAYER */}
                <mesh position={[0, 0, -0.5]}>
                    <planeGeometry args={[10, 6.5]} />
                    <meshStandardMaterial
                        color="#ff4500"
                        emissive="#ff4500"
                        emissiveIntensity={0.6}
                        transparent
                        opacity={0.2}
                    />
                </mesh>

                {/* Additional glow layer */}
                <mesh position={[0, 0, -0.4]}>
                    <planeGeometry args={[9.5, 6]} />
                    <meshStandardMaterial
                        color="#ff6b00"
                        emissive="#ff6b00"
                        emissiveIntensity={0.4}
                        transparent
                        opacity={0.15}
                    />
                </mesh>

                {/* Premium Frame Border with 3D depth */}
                <mesh position={[0, 0, 0.01]} castShadow>
                    <boxGeometry args={[8.4, 5.4, 0.25]} />
                    <meshStandardMaterial
                        color="#c0c0c0"
                        metalness={0.9}
                        roughness={0.1}
                        envMapIntensity={1.2}
                    />
                </mesh>

                {/* Inner frame for depth */}
                <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[8.2, 5.2]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                    />
                </mesh>

                {/* Subtle frame glow */}
                <mesh position={[0, 0, 0.09]}>
                    <planeGeometry args={[8.3, 5.3]} />
                    <meshStandardMaterial
                        color="#ff4500"
                        emissive="#ff4500"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.2}
                    />
                </mesh>

                {/* MAIN PROJECT IMAGE */}
                {loadedTexture && (
                    <mesh position={[0, 0, 0.15]}>
                        <planeGeometry args={[8, 4.5]} />
                        <meshBasicMaterial
                            map={loadedTexture}
                            toneMapped={false}
                        />
                    </mesh>
                )}

                {/* Loading indicator */}
                {!loadedTexture && (
                    <Html position={[0, 0, 0.12]} center>
                        <div style={{
                            color: '#ff4500',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            Loading Image...
                        </div>
                    </Html>
                )}

                {/* Glass overlay for 3D effect */}
                <mesh position={[0, 0, 0.18]}>
                    <planeGeometry args={[8, 5]} />
                    <meshStandardMaterial
                        transparent
                        opacity={0.03}
                        metalness={0.5}
                        roughness={0.3}
                    />
                </mesh>

                {/* Main spotlight */}
                <spotLight
                    position={[0, 5, 3]}
                    angle={0.4}
                    penumbra={0.8}
                    intensity={2.5}
                    color="#ffffff"
                />

                {/* Rim lighting */}
                <pointLight position={[-4.5, 0, 0.5]} intensity={0.4} color="#ff4500" distance={6} />
                <pointLight position={[4.5, 0, 0.5]} intensity={0.4} color="#ff6b00" distance={6} />
            </group>

            {/* Enhanced Pedestal */}
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
                <mesh position={[0, 1.05, 0]}>
                    <torusGeometry args={[0.82, 0.06, 16, 100]} />
                    <meshStandardMaterial
                        color="#ff4500"
                        emissive="#ff4500"
                        emissiveIntensity={1.5}
                        toneMapped={false}
                    />
                </mesh>
                <pointLight position={[0, 1.1, 0]} intensity={1} color="#ff4500" distance={5} />
            </group>

            {/* ENHANCED CEILING LIGHTS WITH TORCH RAYS */}
            <group>
                {/* LEFT CEILING ORB with Torch Ray */}
                <group position={[-8, 4, -8]}>
                    <mesh>
                        <sphereGeometry args={[0.5, 32, 32]} />
                        <meshStandardMaterial
                            color="#ff4500"
                            emissive="#ff4500"
                            emissiveIntensity={3.5}
                            toneMapped={false}
                        />
                    </mesh>
                    <pointLight intensity={3} color="#ff4500" distance={15} />

                    {/* Volumetric Light Beam / Torch Ray */}
                    <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
                        <coneGeometry args={[1.5, 4, 32, 1, true]} />
                        <meshBasicMaterial
                            color="#ff4500"
                            transparent
                            opacity={0.15}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Spotlight for dramatic effect */}
                    <spotLight
                        position={[0, 0, 0]}
                        angle={0.6}
                        penumbra={0.8}
                        intensity={4}
                        color="#ff4500"
                        distance={20}
                        castShadow
                    />
                </group>

                {/* RIGHT CEILING ORB with Torch Ray */}
                <group position={[8, 4, -8]}>
                    <mesh>
                        <sphereGeometry args={[0.5, 32, 32]} />
                        <meshStandardMaterial
                            color="#ff6b00"
                            emissive="#ff6b00"
                            emissiveIntensity={3.5}
                            toneMapped={false}
                        />
                    </mesh>
                    <pointLight intensity={3} color="#ff6b00" distance={15} />

                    {/* Volumetric Light Beam / Torch Ray */}
                    <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
                        <coneGeometry args={[1.5, 4, 32, 1, true]} />
                        <meshBasicMaterial
                            color="#ff6b00"
                            transparent
                            opacity={0.15}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Spotlight for dramatic effect */}
                    <spotLight
                        position={[0, 0, 0]}
                        angle={0.6}
                        penumbra={0.8}
                        intensity={4}
                        color="#ff6b00"
                        distance={20}
                        castShadow
                    />
                </group>

                {/* CENTER CEILING LIGHT with Torch Ray */}
                <group position={[0, 5.8, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.4, 32, 32]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={2.5}
                            toneMapped={false}
                        />
                    </mesh>
                    <pointLight intensity={3.5} color="#ffffff" distance={20} />

                    {/* Volumetric Light Beam / Torch Ray */}
                    <mesh position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
                        <coneGeometry args={[2, 5, 32, 1, true]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.1}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Spotlight for dramatic effect */}
                    <spotLight
                        position={[0, 0, 0]}
                        angle={0.5}
                        penumbra={0.9}
                        intensity={5}
                        color="#ffffff"
                        distance={25}
                        castShadow
                    />
                </group>
            </group>
        </group >
    );
}

// Clickable Info Point in 3D Space
function ClickableInfoPoint({
    position,
    label,
    description,
    color = "#ff4500"
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

            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.25, 32]} />
                <meshBasicMaterial color={color} transparent opacity={hovered ? 0.8 : 0.4} />
            </mesh>

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

// Auto-Tour Camera Animation - ENHANCED for complete museum coverage
function AutoTourCamera({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
    const { camera } = useThree();
    const startTime = useRef(0);
    const tourDuration = 30; // Increased to 30 seconds for comprehensive tour

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

        // Divide tour into segments for different viewpoints
        const segment = Math.floor(progress * 6); // 6 segments
        const segmentProgress = (progress * 6) % 1;

        switch (segment) {
            case 0: // Start: Entrance view
                camera.position.x = 0 + Math.sin(segmentProgress * Math.PI) * 2;
                camera.position.y = 1.5;
                camera.position.z = 12 - segmentProgress * 5;
                camera.lookAt(0, 1.5, -9.8);
                break;

            case 1: // Circle around the image frame (right side)
                const angle1 = segmentProgress * Math.PI;
                camera.position.x = Math.sin(angle1) * 6;
                camera.position.y = 1.5 + Math.sin(segmentProgress * Math.PI) * 1;
                camera.position.z = -9.8 + Math.cos(angle1) * 6;
                camera.lookAt(0, 1.5, -9.8);
                break;

            case 2: // Look at left info point and ceiling light
                camera.position.x = -3 + segmentProgress * 1.5;
                camera.position.y = 2 + segmentProgress * 1;
                camera.position.z = -3;
                camera.lookAt(-4, 2, -6); // Look at left info point
                break;

            case 3: // Look at right info point and ceiling
                camera.position.x = 3 - segmentProgress * 1.5;
                camera.position.y = 3;
                camera.position.z = -3;
                const lookX = segmentProgress < 0.5 ? 4 : 0;
                const lookY = segmentProgress < 0.5 ? 2 : 5.8;
                const lookZ = segmentProgress < 0.5 ? -6 : 0;
                camera.lookAt(lookX, lookY, lookZ);
                break;

            case 4: // Top-down view showing torch rays
                camera.position.x = Math.sin(segmentProgress * Math.PI * 2) * 4;
                camera.position.y = 5 - segmentProgress * 1;
                camera.position.z = -5 + Math.cos(segmentProgress * Math.PI * 2) * 4;
                camera.lookAt(0, 1.5, -9.8);
                break;

            case 5: // Final: Dramatic angle and zoom to image
                const finalAngle = segmentProgress * Math.PI / 2;
                camera.position.x = Math.sin(finalAngle) * 8;
                camera.position.y = 2 - segmentProgress * 0.5;
                camera.position.z = -2 - segmentProgress * 5;
                camera.lookAt(0, 1.5, -9.8);
                break;
        }
    });

    return null;
}

// Loading Fallback Component
function LoadingFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center gap-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
                <div className="text-red-400 text-lg font-semibold">Loading 3D Gallery...</div>
                <div className="text-gray-400 text-sm">Preparing holographic display</div>
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

        camera.position.y = Math.max(0, Math.min(4, camera.position.y));
        camera.position.x = Math.max(-12, Math.min(12, camera.position.x));
        camera.position.z = Math.max(-5, Math.min(15, camera.position.z));
    });

    return null;
}

export const Museum3DGalleryStandalone: React.FC<Museum3DGalleryStandaloneProps> = ({ project }) => {
    const [showInstructions, setShowInstructions] = useState(true);
    const [autoTourActive, setAutoTourActive] = useState(false);
    const audioRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowInstructions(false), 6000);
        return () => clearTimeout(timer);
    }, []);

    // Handle background music for QuickCourt project
    useEffect(() => {
        if (autoTourActive && project.title === 'QuickCourt') {
            // Music will start via iframe when auto-tour begins
            if (audioRef.current) {
                audioRef.current.style.display = 'block';
            }
        } else {
            // Hide iframe when tour stops
            if (audioRef.current) {
                audioRef.current.style.display = 'none';
            }
        }
    }, [autoTourActive, project.title]);

    const toggleAutoTour = () => {
        setAutoTourActive(!autoTourActive);
    };

    return (
        <div className="fixed inset-0 bg-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {/* Title Banner */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="absolute top-6 left-6 z-50 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-[rgba(192,192,192,0.3)] rounded-xl px-6 py-4"
            >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-300 to-red-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Eye className="text-red-500" size={28} />
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
                    ? 'bg-red-500/30 border-red-400/60 text-red-300'
                    : 'bg-[rgba(26,26,26,0.8)] border-[rgba(192,192,192,0.3)] text-gray-300'
                    }`}
            >
                {autoTourActive ? <Pause size={20} /> : <PlayCircle size={20} />}
                {autoTourActive ? 'Stop Auto-Tour' : 'Start Auto-Tour'}
            </motion.button>

            {/* Instructions Panel */}
            {showInstructions && !autoTourActive && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-[rgba(26,26,26,0.9)] border border-red-500/40 rounded-xl px-8 py-4 max-w-2xl"
                >
                    <div className="flex items-start gap-4">
                        <Info className="text-red-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Navigation Controls</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Move size={16} className="text-red-500" />
                                    <span><strong>WASD</strong> or <strong>Arrow Keys</strong> - Move</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-red-500" />
                                    <span><strong>Mouse Drag</strong> - Look around</span>
                                </div>
                            </div>
                            <p className="text-xs text-red-300 mt-3">
                                💡 Click on glowing orbs for more info • Try Auto-Tour for a guided experience
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-3">
                {project.projectUrl && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(project.projectUrl, '_blank')}
                        className="px-6 py-3 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-red-500/40 rounded-xl text-red-300 hover:bg-red-500/20 transition-all font-semibold"
                    >
                        Visit Live Project
                    </motion.button>
                )}
                {project.videoUrl && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(project.videoUrl, '_blank')}
                        className="px-6 py-3 backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-orange-400/40 rounded-xl text-orange-300 hover:bg-orange-500/20 transition-all font-semibold"
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

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [3, 2, 12], fov: 60 }}>
                <Suspense fallback={<LoadingFallback />}>
                    <Environment preset="night" />

                    <ambientLight intensity={0.2} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={0.4}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />

                    <DynamicSpotlight />

                    <pointLight position={[0, 6, 0]} intensity={1.2} color="#ffffff" />
                    <pointLight position={[-8, 4, -8]} intensity={1} color="#ff4500" distance={15} />
                    <pointLight position={[8, 4, -8]} intensity={1} color="#ff6b00" distance={15} />
                    <pointLight position={[0, 2, 5]} intensity={0.5} color="#ffffff" />

                    <MuseumRoom projectImage={project.image} />

                    <FloatingParticles />

                    <ClickableInfoPoint
                        position={[-4, 2, -6]}
                        label="Tech Stack"
                        description={`Built with: ${project.tags.slice(0, 3).join(', ')}`}
                        color="#ff4500"
                    />
                    <ClickableInfoPoint
                        position={[4, 2, -6]}
                        label="Features"
                        description={project.description}
                        color="#ff6b00"
                    />
                    <ClickableInfoPoint
                        position={[0, 3.5, -4]}
                        label="Project Info"
                        description="Click the buttons on the right to explore more!"
                        color="#ffaa00"
                    />

                    {autoTourActive ? (
                        <AutoTourCamera
                            isActive={autoTourActive}
                            onComplete={() => setAutoTourActive(false)}
                        />
                    ) : (
                        <>
                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                minDistance={3}
                                maxDistance={20}
                                maxPolarAngle={Math.PI / 1.8}
                                minPolarAngle={Math.PI / 6}
                                target={[0, 1.5, -5]}
                                enableDamping={true}
                                dampingFactor={0.05}
                            />
                            <CameraController enabled={!autoTourActive} />
                        </>
                    )}

                    <fog attach="fog" args={['#0a0a0a', 15, 30]} />
                </Suspense>
            </Canvas>

            {/* Hidden YouTube Audio Player for QuickCourt Auto-Tour */}
            {project.title === 'QuickCourt' && (
                <iframe
                    ref={audioRef}
                    style={{
                        display: 'none',
                        position: 'fixed',
                        bottom: '-100px',
                        left: '-100px',
                        width: '1px',
                        height: '1px',
                        border: 'none',
                        pointerEvents: 'none'
                    }}
                    src={`https://www.youtube.com/embed/MMi-tS-k358?autoplay=${autoTourActive ? '1' : '0'}&loop=1&playlist=MMi-tS-k358&controls=0&showinfo=0&modestbranding=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    title="Background Music"
                />
            )}
        </div>
    );
};
