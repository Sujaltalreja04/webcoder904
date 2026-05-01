import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, MeshReflectorMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Move, Eye, Info, Loader2 } from 'lucide-react';

interface Tech3DGalleryStandaloneProps {
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

// Floating Data Cubes for tech atmosphere
function FloatingDataCubes() {
    const cubesRef = useRef<THREE.Group>(null);
    const cubeCount = 15;
    const cubes: { position: THREE.Vector3; speed: number }[] = [];

    for (let i = 0; i < cubeCount; i++) {
        cubes.push({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                Math.random() * 8 + 1,
                (Math.random() - 0.5) * 20
            ),
            speed: Math.random() * 0.5 + 0.2,
        });
    }

    useFrame(({ clock }) => {
        if (cubesRef.current) {
            cubesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
            cubesRef.current.children.forEach((cube, i) => {
                cube.rotation.x = clock.getElapsedTime() * cubes[i].speed;
                cube.rotation.y = clock.getElapsedTime() * cubes[i].speed * 0.7;
                cube.position.y = cubes[i].position.y + Math.sin(clock.getElapsedTime() * cubes[i].speed) * 0.3;
            });
        }
    });

    return (
        <group ref={cubesRef}>
            {cubes.map((cube, i) => (
                <mesh key={i} position={cube.position}>
                    <boxGeometry args={[0.3, 0.3, 0.3]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? "#ff4500" : "#ff6b00"}
                        emissive={i % 2 === 0 ? "#ff4500" : "#ff6b00"}
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.6}
                        wireframe
                    />
                </mesh>
            ))}
        </group>
    );
}

// Rotating Holographic Rings
function HolographicRings() {
    const ringsRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (ringsRef.current) {
            ringsRef.current.rotation.y = clock.getElapsedTime() * 0.3;
            ringsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
        }
    });

    return (
        <group ref={ringsRef} position={[0, 1.5, -9.5]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[4, 0.02, 16, 100]} />
                <meshBasicMaterial color="#ff4500" transparent opacity={0.4} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} position={[0, 0, 0]}>
                <torusGeometry args={[4.5, 0.015, 16, 100]} />
                <meshBasicMaterial color="#ff6b00" transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, 0]}>
                <torusGeometry args={[5, 0.01, 16, 100]} />
                <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

// Circuit Board Pattern on Floor
function CircuitPattern() {
    return (
        <group position={[0, -1.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Horizontal Lines */}
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={`h-${i}`} position={[(i - 4.5) * 2, 0, 0]}>
                    <planeGeometry args={[0.05, 20]} />
                    <meshBasicMaterial
                        color="#ff4500"
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}
            {/* Vertical Lines */}
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={`v-${i}`} position={[0, (i - 4.5) * 2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <planeGeometry args={[0.05, 20]} />
                    <meshBasicMaterial
                        color="#ff6b00"
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Pulsing Tech Spotlight
function PulsingSpotlight() {
    const lightRef = useRef<THREE.SpotLight>(null);

    useFrame(({ clock }) => {
        if (lightRef.current) {
            lightRef.current.intensity = 3 + Math.sin(clock.getElapsedTime() * 2) * 1;
            lightRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 3;
        }
    });

    return (
        <spotLight
            ref={lightRef}
            position={[0, 8, -5]}
            angle={0.5}
            penumbra={1}
            intensity={3}
            color="#ff4500"
            castShadow
        />
    );
}

function TechRoom({ projectImage }: { projectImage: string }) {
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
            {/* TECH FLOOR with Circuit Pattern */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <MeshReflectorMaterial
                    mirror={0.6}
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={0.5}
                    roughness={0.7}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#0a0a0a"
                    metalness={0.8}
                />
            </mesh>

            {/* Circuit Pattern Overlay */}
            <CircuitPattern />

            {/* Ceiling - Dark Tech */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color="#000000"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Back Wall - Hexagonal Tech Pattern */}
            <mesh position={[0, 2, -10]} receiveShadow>
                <planeGeometry args={[30, 10]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.6}
                    metalness={0.4}
                />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-15, 2, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[30, 10]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.6}
                    metalness={0.4}
                />
            </mesh>

            {/* Right Wall */}
            <mesh position={[15, 2, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[30, 10]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.6}
                    metalness={0.4}
                />
            </mesh>

            {/* Neon Tech Strips on Walls */}
            {/* Left Wall Neon */}
            <mesh position={[-14.9, 4.5, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.2]} />
                <meshStandardMaterial
                    color="#ff4500"
                    emissive="#ff4500"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
            <mesh position={[-14.9, 1, 5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.2]} />
                <meshStandardMaterial
                    color="#ff6b00"
                    emissive="#ff6b00"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Right Wall Neon */}
            <mesh position={[14.9, 4.5, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.2]} />
                <meshStandardMaterial
                    color="#ff4500"
                    emissive="#ff4500"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
            <mesh position={[14.9, 1, 5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[30, 0.2]} />
                <meshStandardMaterial
                    color="#ff6b00"
                    emissive="#ff6b00"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* HOLOGRAPHIC PROJECT DISPLAY with Floating Frame */}
            <group position={[0, 1.5, -9.8]}>
                {/* Outer Glow Layers */}
                <mesh position={[0, 0, -0.6]}>
                    <planeGeometry args={[10.5, 7]} />
                    <meshStandardMaterial
                        color="#ff4500"
                        emissive="#ff4500"
                        emissiveIntensity={0.8}
                        transparent
                        opacity={0.15}
                    />
                </mesh>

                <mesh position={[0, 0, -0.5]}>
                    <planeGeometry args={[10, 6.5]} />
                    <meshStandardMaterial
                        color="#ff6b00"
                        emissive="#ff6b00"
                        emissiveIntensity={0.6}
                        transparent
                        opacity={0.2}
                    />
                </mesh>

                {/* Tech Frame - Angular Design */}
                <mesh position={[0, 0, 0.01]} castShadow>
                    <boxGeometry args={[8.6, 5.6, 0.15]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        metalness={0.95}
                        roughness={0.05}
                        envMapIntensity={1.5}
                    />
                </mesh>

                {/* Inner Frame Accent */}
                <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[8.4, 5.4]} />
                    <meshStandardMaterial
                        color="#0a0a0a"
                    />
                </mesh>

                {/* Glowing Frame Border */}
                <mesh position={[0, 0, 0.09]}>
                    <planeGeometry args={[8.5, 5.5]} />
                    <meshStandardMaterial
                        color="#ff4500"
                        emissive="#ff4500"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.25}
                    />
                </mesh>

                {/* Corner Tech Details */}
                {[[-4.2, 2.7], [4.2, 2.7], [-4.2, -2.7], [4.2, -2.7]].map((pos, i) => (
                    <group key={i} position={[pos[0], pos[1], 0.12]}>
                        <mesh>
                            <boxGeometry args={[0.3, 0.3, 0.05]} />
                            <meshStandardMaterial
                                color="#ff4500"
                                emissive="#ff4500"
                                emissiveIntensity={2}
                                toneMapped={false}
                            />
                        </mesh>
                    </group>
                ))}

                {/* PROJECT IMAGE */}
                {loadedTexture && (
                    <mesh position={[0, 0, 0.15]}>
                        <planeGeometry args={[8.2, 5.2]} />
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

                {/* Holographic Glass Overlay */}
                <mesh position={[0, 0, 0.18]}>
                    <planeGeometry args={[8.2, 5.2]} />
                    <meshStandardMaterial
                        transparent
                        opacity={0.05}
                        metalness={0.7}
                        roughness={0.2}
                    />
                </mesh>

                {/* Rim Spotlights */}
                <pointLight position={[-4.5, 0, 0.5]} intensity={0.6} color="#ff4500" distance={7} />
                <pointLight position={[4.5, 0, 0.5]} intensity={0.6} color="#ff6b00" distance={7} />
                <pointLight position={[0, 3, 0.5]} intensity={0.5} color="#ffaa00" distance={6} />
            </group>

            {/* Floating Tech Platform/Pedestal */}
            <group position={[0, -1, -7]}>
                <mesh castShadow>
                    <cylinderGeometry args={[1, 1.2, 0.3, 6]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        metalness={0.9}
                        roughness={0.1}
                        envMapIntensity={1.3}
                    />
                </mesh>
                <mesh position={[0, 0.16, 0]}>
                    <torusGeometry args={[1.05, 0.08, 16, 6]} />
                    <meshStandardMaterial
                        color="#ff4500"
                        emissive="#ff4500"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                <pointLight position={[0, 0.2, 0]} intensity={1.5} color="#ff4500" distance={6} />
            </group>

            {/* Floating Holographic Rings */}
            <HolographicRings />

            {/* NEON CEILING LIGHTS - Tech Style */}
            <group>
                {/* LEFT NEON LIGHT */}
                <group position={[-8, 5, -8]}>
                    <mesh>
                        <boxGeometry args={[0.6, 0.1, 0.6]} />
                        <meshStandardMaterial
                            color="#ff4500"
                            emissive="#ff4500"
                            emissiveIntensity={4}
                            toneMapped={false}
                        />
                    </mesh>
                    <pointLight intensity={4} color="#ff4500" distance={18} />

                    {/* Light Beam */}
                    <mesh position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
                        <coneGeometry args={[2, 5, 4, 1, true]} />
                        <meshBasicMaterial
                            color="#ff4500"
                            transparent
                            opacity={0.12}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    <spotLight
                        position={[0, 0, 0]}
                        angle={0.7}
                        penumbra={0.9}
                        intensity={5}
                        color="#ff4500"
                        distance={25}
                        castShadow
                    />
                </group>

                {/* RIGHT NEON LIGHT */}
                <group position={[8, 5, -8]}>
                    <mesh>
                        <boxGeometry args={[0.6, 0.1, 0.6]} />
                        <meshStandardMaterial
                            color="#ff6b00"
                            emissive="#ff6b00"
                            emissiveIntensity={4}
                            toneMapped={false}
                        />
                    </mesh>
                    <pointLight intensity={4} color="#ff6b00" distance={18} />

                    {/* Light Beam */}
                    <mesh position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
                        <coneGeometry args={[2, 5, 4, 1, true]} />
                        <meshBasicMaterial
                            color="#ff6b00"
                            transparent
                            opacity={0.12}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    <spotLight
                        position={[0, 0, 0]}
                        angle={0.7}
                        penumbra={0.9}
                        intensity={5}
                        color="#ff6b00"
                        distance={25}
                        castShadow
                    />
                </group>

                {/* CENTER TECH LIGHT */}
                <group position={[0, 5.8, 0]}>
                    <mesh>
                        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={3}
                            toneMapped={false}
                        />
                    </mesh>
                    <pointLight intensity={5} color="#ffffff" distance={22} />

                    {/* Light Beam */}
                    <mesh position={[0, -3, 0]} rotation={[0, 0, 0]}>
                        <coneGeometry args={[2.5, 6, 32, 1, true]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.08}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    <spotLight
                        position={[0, 0, 0]}
                        angle={0.6}
                        penumbra={1}
                        intensity={6}
                        color="#ffffff"
                        distance={28}
                        castShadow
                    />
                </group>
            </group>
        </group>
    );
}

// Animated Info Points - Tech Style
function TechInfoPoint({
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
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.15;
            meshRef.current.rotation.y += 0.03;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z = clock.getElapsedTime();
        }
    });

    return (
        <group position={position}>
            {/* Rotating Outer Ring */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.3, 0.02, 16, 32]} />
                <meshBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.5} />
            </mesh>

            {/* Core Sphere */}
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setClicked(!clicked)}
                scale={hovered ? 1.4 : 1}
            >
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 3 : 1.5}
                    transparent
                    opacity={0.95}
                    wireframe
                />
            </mesh>

            {/* Inner Glow */}
            <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.3} />
            </mesh>

            {(clicked || hovered) && (
                <Html distanceFactor={4} position={[0, 0.6, 0]}>
                    <div style={{
                        background: 'rgba(10, 10, 10, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${color}`,
                        borderRadius: '12px',
                        padding: '16px',
                        minWidth: '220px',
                        boxShadow: `0 0 25px ${color}`,
                        fontFamily: 'Orbitron, sans-serif',
                    }}>
                        <h4 style={{
                            color: color,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {label}
                        </h4>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: '13px',
                            lineHeight: '1.5'
                        }}>
                            {description}
                        </p>
                    </div>
                </Html>
            )}

            <pointLight color={color} intensity={hovered ? 3 : 1.5} distance={6} />
        </group>
    );
}

// Auto-Tour Camera
function AutoTourCamera({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
    const { camera } = useThree();
    const startTime = useRef(0);
    const tourDuration = 30;

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

        const segment = Math.floor(progress * 6);
        const segmentProgress = (progress * 6) % 1;

        switch (segment) {
            case 0: // Entrance view
                camera.position.x = 0 + Math.sin(segmentProgress * Math.PI) * 3;
                camera.position.y = 1.8;
                camera.position.z = 12 - segmentProgress * 6;
                camera.lookAt(0, 1.5, -9.8);
                break;

            case 1: // Circle around display
                const angle1 = segmentProgress * Math.PI;
                camera.position.x = Math.sin(angle1) * 7;
                camera.position.y = 1.5 + Math.sin(segmentProgress * Math.PI) * 1.5;
                camera.position.z = -9.8 + Math.cos(angle1) * 7;
                camera.lookAt(0, 1.5, -9.8);
                break;

            case 2: // Left info point
                camera.position.x = -3 + segmentProgress * 2;
                camera.position.y = 2.5;
                camera.position.z = -3;
                camera.lookAt(-4, 2, -6);
                break;

            case 3: // Right info point
                camera.position.x = 3 - segmentProgress * 2;
                camera.position.y = 2.5;
                camera.position.z = -3;
                camera.lookAt(4, 2, -6);
                break;

            case 4: // Top view
                camera.position.x = Math.sin(segmentProgress * Math.PI * 2) * 5;
                camera.position.y = 5.5 - segmentProgress * 1;
                camera.position.z = -5 + Math.cos(segmentProgress * Math.PI * 2) * 5;
                camera.lookAt(0, 1.5, -9.8);
                break;

            case 5: // Final dramatic angle
                const finalAngle = segmentProgress * Math.PI / 2;
                camera.position.x = Math.sin(finalAngle) * 9;
                camera.position.y = 2.5 - segmentProgress * 0.7;
                camera.position.z = -2 - segmentProgress * 6;
                camera.lookAt(0, 1.5, -9.8);
                break;
        }
    });

    return null;
}

// Loading Fallback
function LoadingFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center gap-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <div className="text-orange-400 text-lg font-semibold">Loading Tech Gallery...</div>
                <div className="text-gray-400 text-sm">Initializing holographic display</div>
            </div>
        </Html>
    );
}

// Camera Controller
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

        camera.position.y = Math.max(0, Math.min(5, camera.position.y));
        camera.position.x = Math.max(-12, Math.min(12, camera.position.x));
        camera.position.z = Math.max(-5, Math.min(15, camera.position.z));
    });

    return null;
}

export const Tech3DGalleryStandalone: React.FC<Tech3DGalleryStandaloneProps> = ({ project }) => {
    const [showInstructions, setShowInstructions] = useState(true);
    const [autoTourActive, setAutoTourActive] = useState(false);
    const orbitControlsRef = useRef<any>(null);
    const audioRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setShowInstructions(false), 6000);
        return () => clearTimeout(timer);
    }, []);

    // Handle background music for Weblancer Tech Gallery
    useEffect(() => {
        if (autoTourActive && project.title === 'Weblancer Tech') {
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
                className="absolute top-6 left-6 z-50 backdrop-blur-md bg-[rgba(10,10,10,0.8)] border border-[rgba(255,69,0,0.4)] rounded-xl px-6 py-4"
            >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-300 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Eye className="text-orange-500" size={28} />
                    3D Tech Gallery
                </h2>
                <p className="text-gray-400 text-sm mt-1">{project.title}</p>
            </motion.div>

            {/* Instructions Panel */}
            {showInstructions && !autoTourActive && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-[rgba(10,10,10,0.9)] border border-orange-500/40 rounded-xl px-8 py-4 max-w-2xl"
                >
                    <div className="flex items-start gap-4">
                        <Info className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Navigation Controls</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Move size={16} className="text-orange-500" />
                                    <span><strong>WASD</strong> or <strong>Arrow Keys</strong> - Move</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-orange-500" />
                                    <span><strong>Mouse Drag</strong> - Look around</span>
                                </div>
                            </div>
                            <p className="text-xs text-orange-300 mt-3">
                                💡 Click on floating tech nodes for more info • Try Auto-Tour for a guided experience
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
                        className="px-6 py-3 backdrop-blur-md bg-[rgba(10,10,10,0.8)] border border-orange-500/40 rounded-xl text-orange-300 hover:bg-orange-500/20 transition-all font-semibold"
                    >
                        Visit Live Project
                    </motion.button>
                )}
                {project.videoUrl && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(project.videoUrl, '_blank')}
                        className="px-6 py-3 backdrop-blur-md bg-[rgba(10,10,10,0.8)] border border-red-400/40 rounded-xl text-red-300 hover:bg-red-500/20 transition-all font-semibold"
                    >
                        Watch Demo Video
                    </motion.button>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="px-6 py-3 backdrop-blur-md bg-[rgba(10,10,10,0.8)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 hover:bg-gray-500/20 transition-all font-semibold"
                >
                    {showInstructions ? 'Hide' : 'Show'} Controls
                </motion.button>
                {/* Hand Control Button - Temporarily Disabled
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleGestureControl}
                    className={`px-6 py-3 backdrop-blur-md border rounded-xl font-semibold transition-all flex items-center gap-2 ${gestureControlEnabled
                        ? 'bg-purple-500/30 border-purple-400/60 text-purple-300'
                        : 'bg-[rgba(10,10,10,0.8)] border-[rgba(192,69,192,0.4)] text-gray-300'
                        }`}
                >
                    <Hand size={20} />
                    {gestureControlEnabled ? 'Hand Control ON' : 'Hand Control'}
                </motion.button>
                */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleAutoTour}
                    className={`px-6 py-3 backdrop-blur-md border rounded-xl font-semibold transition-all flex items-center gap-2 ${autoTourActive
                        ? 'bg-green-500/30 border-green-400/60 text-green-300'
                        : 'bg-[rgba(10,10,10,0.8)] border-[rgba(0,192,100,0.4)] text-gray-300'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {autoTourActive ? (
                            <>
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </>
                        ) : (
                            <polygon points="5 3 19 12 5 21 5 3" />
                        )}
                    </svg>
                    {autoTourActive ? 'Stop Tour' : 'Auto Tour'}
                </motion.button>
            </div>

            {/* 3D Canvas */}
            <Canvas shadows camera={{ position: [4, 2.5, 12], fov: 60 }}>
                <Suspense fallback={<LoadingFallback />}>
                    <Environment preset="night" />

                    <ambientLight intensity={0.15} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={0.3}
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />

                    <PulsingSpotlight />

                    <pointLight position={[0, 6, 0]} intensity={1} color="#ffffff" />
                    <pointLight position={[-8, 5, -8]} intensity={1.2} color="#ff4500" distance={18} />
                    <pointLight position={[8, 5, -8]} intensity={1.2} color="#ff6b00" distance={18} />

                    <TechRoom projectImage={project.image} />

                    <FloatingDataCubes />

                    <TechInfoPoint
                        position={[-4, 2, -6]}
                        label="Tech Stack"
                        description={`Built with: ${project.tags.slice(0, 3).join(', ')}`}
                        color="#ff4500"
                    />
                    <TechInfoPoint
                        position={[4, 2, -6]}
                        label="Features"
                        description={project.description}
                        color="#ff6b00"
                    />
                    <TechInfoPoint
                        position={[0, 3.5, -4]}
                        label="Project Info"
                        description="Explore this futuristic tech showcase!"
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
                                ref={orbitControlsRef}
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
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

            {/* Hidden YouTube Audio Player for Weblancer Tech Auto-Tour */}
            {
                project.title === 'Weblancer Tech' && (
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
                        src={`https://www.youtube.com/embed/N76txbrkDhE?autoplay=${autoTourActive ? '1' : '0'}&loop=1&playlist=N76txbrkDhE&controls=0&showinfo=0&modestbranding=1&rel=0`}
                        allow="autoplay; encrypted-media"
                        title="Background Music"
                    />
                )
            }
        </div >
    );
};
