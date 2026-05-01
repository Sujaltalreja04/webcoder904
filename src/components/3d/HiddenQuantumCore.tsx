import { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, MeshReflectorMaterial, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- COMPONENTS ---

// 1. Interactive Data Nodes (Orbs)
function DataNode({ position, label, content, color = "#a0a0a0", delay = 0 }: { position: [number, number, number], label: string, content: string, color?: string, delay?: number }) {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const nodeRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (nodeRef.current) {
            const t = clock.getElapsedTime();
            nodeRef.current.position.y = position[1] + Math.sin(t * 2 + delay) * 0.15;
            nodeRef.current.rotation.y = t * 0.5;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={nodeRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => setActive(!active)}
            >
                <octahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                    color={hovered || active ? "#ffffff" : color}
                    emissive={hovered || active ? "#ffffff" : color}
                    emissiveIntensity={hovered || active ? 2 : 0.5}
                    wireframe={!active}
                />
            </mesh>

            {/* Glowing Aura when hovered/active */}
            {(hovered || active) && (
                <pointLight distance={5} intensity={1} color="#ffffff" />
            )}

            {/* Html Popup */}
            {active && (
                <Html position={[0, 0.6, 0]} center zIndexRange={[100, 0]}>
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="bg-black/90 border border-gray-600 p-4 rounded-md backdrop-blur-md w-64 pointer-events-none"
                    >
                        <h4 className="text-white font-mono text-sm tracking-widest font-bold mb-2 uppercase border-b border-gray-700 pb-1 flex items-center justify-between">
                            <span>{label}</span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        </h4>
                        <p className="text-gray-400 text-xs font-mono leading-relaxed">{content}</p>
                    </motion.div>
                </Html>
            )}

            {/* Always visible tiny label */}
            {!active && (
                <Html position={[0, -0.5, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                    <span style={{
                        color: hovered ? '#ffffff' : '#888888',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                    }}>{label}</span>
                </Html>
            )}
        </group>
    );
}

// 2. Terminal Console Interface (Projected on a Monolith)
function TerminalDisplay({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
    const [terminalOutput, setTerminalOutput] = useState<string[]>([
        "> SYSTEM BOOT SEQUENCE INITIATED...",
        "> LOADING KERNEL MODULES... OK",
        "> ESTABLISHING NEURAL LINK... ESTABLISHED",
        "> ACCESSING PORTFOLIO DATABASE... CONNECTED",
        "> USER: SUJAL TALREJA",
        "> STATUS: HIGHLY OPTIMIZED",
        "> AWAITING COMMAND..."
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const logs = [
                "> TRAFFIC ANALYSIS: NOMINAL",
                "> SCANNING METRICS... 99.9% UPTIME",
                "> COMPILING LATEST AI MODELS...",
                "> DEPLOYING SERVERLESS FUNCTIONS...",
                "> SECURITY AUDIT: PASSED",
                "> EXECUTING CRON_JOB_0x8F..."
            ];
            const nextLog = logs[Math.floor(Math.random() * logs.length)];
            setTerminalOutput(prev => {
                const newLogs = [...prev, nextLog];
                if (newLogs.length > 8) newLogs.shift();
                return newLogs;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <group position={position} rotation={rotation}>
            {/* Screen backing */}
            <mesh position={[0, 0, 1.01]}>
                <planeGeometry args={[1.8, 2.5]} />
                <meshBasicMaterial color="#050505" />
            </mesh>

            <Html position={[-0.8, 1.1, 1.02]} transform distanceFactor={5} style={{ width: '380px', height: '530px' }}>
                <div className="w-full h-full bg-[#050505] border border-gray-700/50 p-4 font-mono text-xs overflow-hidden flex flex-col justify-end opacity-80 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        <span className="text-gray-500 ml-2">sys_console_v2.0.sh</span>
                    </div>
                    {terminalOutput.map((line, i) => (
                        <div key={i} className="text-gray-400 mb-1 leading-relaxed opacity-80">
                            <span className="text-gray-600 mr-2">{String(i).padStart(2, '0')}</span>
                            {line}
                        </div>
                    ))}
                    <div className="text-white mt-2 animate-pulse">_</div>
                </div>
            </Html>
        </group>
    );
}

// 4. Holographic Resume Projection (Appears above the core)
function HolographicResume({ active }: { active: boolean }) {
    if (!active) return null;

    return (
        <group position={[0, 8, 0]}>
            <mesh>
                <cylinderGeometry args={[4, 4, 6, 32, 1, true]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} wireframe />
            </mesh>

            <Html center transform distanceFactor={15} position={[0, 0, 0]}>
                <div className="bg-black/80 border border-white p-8 w-[800px] h-[500px] overflow-hidden backdrop-blur-xl flex flex-col
                    shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                    <div className="border-b border-white/30 pb-4 mb-6">
                        <h2 className="text-4xl text-white font-bold tracking-[0.2em] uppercase font-mono mb-2">Sujal Talreja</h2>
                        <h3 className="text-gray-400 text-xl tracking-widest font-mono">Specialist: AI / ML / Full-Stack</h3>
                    </div>

                    <div className="flex gap-8 h-full">
                        <div className="flex-1 space-y-6">
                            <div>
                                <h4 className="text-white text-sm tracking-widest uppercase mb-3 border-b border-white/20 pb-1">Core Directives</h4>
                                <ul className="text-gray-400 font-mono space-y-2 text-sm">
                                    <li>&gt; Neural Network Architecting</li>
                                    <li>&gt; Agentic RAG Systems</li>
                                    <li>&gt; Full-Stack Engineering (Next.js/React)</li>
                                    <li>&gt; Data Pipeline Optimization</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white text-sm tracking-widest uppercase mb-3 border-b border-white/20 pb-1">System Load</h4>
                                <div className="space-y-3 font-mono text-sm text-gray-400">
                                    <div className="flex justify-between items-center">
                                        <span>Python Focus</span>
                                        <div className="w-32 h-1 bg-gray-800"><div className="w-[95%] h-full bg-white"></div></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>TypeScript/React</span>
                                        <div className="w-32 h-1 bg-gray-800"><div className="w-[90%] h-full bg-white"></div></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>AI Architecture</span>
                                        <div className="w-32 h-1 bg-gray-800"><div className="w-[85%] h-full bg-white"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 border-l border-white/20 pl-8">
                            <div>
                                <h4 className="text-white text-sm tracking-widest uppercase mb-3 border-b border-white/20 pb-1">Recent Executions</h4>
                                <ul className="text-gray-400 font-mono space-y-3 text-sm">
                                    <li className="flex flex-col">
                                        <span className="text-white">PROJECT: CYBREON</span>
                                        <span className="text-xs opacity-70">AI-powered robotic brain software</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-white">PROJECT: INFRA_SENTINEL</span>
                                        <span className="text-xs opacity-70">Computer vision defect detection</span>
                                    </li>
                                    <li className="flex flex-col">
                                        <span className="text-white">SYS_UPDATE: HACKATHONS</span>
                                        <span className="text-xs opacity-70">Top 5 finish achieved globally</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    );
}

// 5. Cybernetic Laser Grid Scanner
function LaserScanner({ active }: { active: boolean }) {
    const laserRef = useRef<THREE.Group>(null);
    const planeRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!active) return;
        const t = clock.getElapsedTime();
        if (laserRef.current) {
            laserRef.current.rotation.y = t * 1.5;
        }
        if (planeRef.current) {
            // Pulse the material opacity
            (planeRef.current.material as THREE.MeshBasicMaterial).opacity = (Math.sin(t * 5) * 0.5 + 0.5) * 0.4;
        }
    });

    if (!active) return null;

    return (
        <group ref={laserRef} position={[0, 0.1, 0]}>
            <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[20, 64]} />
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
            {/* The Scanning Line */}
            <mesh position={[10, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 0.2]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
            </mesh>
            <pointLight intensity={3} color="#00ffff" distance={30} />
        </group>
    );
}

// 6. Flying Achievement Cards
function FlyingCard({ data, index, active, total }: { data: any, index: number, active: boolean, total: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Calculate final orbit positions
    const angle = (index / total) * Math.PI * 2;
    // Vary the orbital distance somewhat
    const finalRadius = 8 + (index % 2) * 3;
    // Vary heights
    const finalHeight = (index % 3 - 1) * 3.5 + 4;

    // Initial hidden positions (far away above and outward)
    const initRadius = finalRadius + 40;
    const initHeight = finalHeight + 40;

    useFrame(({ clock }) => {
        if (!groupRef.current) return;

        const targetRadius = active ? finalRadius : initRadius;
        const targetHeight = active ? finalHeight : initHeight;

        // Orbit speed when active
        const t = clock.getElapsedTime();
        const currentAngle = angle + (active ? t * 0.15 : 0);

        const targetX = Math.cos(currentAngle) * targetRadius;
        const targetZ = Math.sin(currentAngle) * targetRadius;

        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetHeight, 0.04);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.04);

        if (active && targetRadius < initRadius - 10) {
            groupRef.current.lookAt(0, 4, 0);
        }
    });

    // Determine opacity strictly based on radial distance from core
    // When far away, it should be 0. When close, it fades to 1.
    const isVisible = active;

    const renderCardContent = () => {
        if (data.type === 'CERTIFICATE') {
            return (
                <div className={`transition-all duration-500 ease-out 
                    w-[360px] bg-gradient-to-br from-[#111] to-[#0a0a0a] backdrop-blur-xl 
                    p-2 border-2 border-amber-500/30 rounded-lg group relative overflow-hidden`}
                    style={{
                        boxShadow: hovered ? `0 0 50px rgba(245, 158, 11, 0.5)` : `0 0 15px rgba(245, 158, 11, 0.1)`,
                        transform: hovered ? 'scale(1.08) translateY(-10px)' : 'scale(1)',
                    }}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none"></div>
                    <div className="border border-amber-500/20 p-5 rounded h-full relative z-10 flex flex-col items-center justify-center bg-[#050505]/50">
                        <div className="w-14 h-14 rounded-full border border-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] mb-4 bg-amber-500/10 transition-transform duration-500 group-hover:rotate-[360deg]">
                            <span className="text-amber-400 text-2xl">★</span>
                        </div>
                        <div className="text-center w-full">
                            <h4 className="text-amber-500/80 font-serif text-[10px] tracking-[0.4em] uppercase mb-2">Verified Credential</h4>
                            <h3 className="text-xl text-white font-bold font-serif tracking-wide mb-3">{data.title}</h3>
                            <div className="w-16 h-[1px] bg-amber-500/50 mx-auto mb-3"></div>
                            <p className="text-gray-400 text-xs font-mono leading-relaxed">{data.desc}</p>
                        </div>
                        <div className="mt-4 flex gap-1 items-center opacity-50 group-hover:opacity-100 transition-opacity">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span className="w-1 h-1 rounded-full bg-amber-600"></span>
                            <span className="w-1 h-1 rounded-full bg-amber-700"></span>
                        </div>
                    </div>
                </div>
            );
        } else if (data.type === 'ACHIEVEMENT') {
            return (
                <div className={`transition-all duration-500 ease-out 
                    w-[320px] bg-[#0f0b1a]/95 backdrop-blur-xl border border-purple-500/40 rounded-tr-[40px] rounded-bl-[40px]
                    p-6 flex flex-col gap-3 group relative overflow-hidden`}
                    style={{
                        boxShadow: hovered ? `0 0 40px rgba(168, 85, 247, 0.6)` : `0 0 15px rgba(168, 85, 247, 0.2)`,
                        transform: hovered ? 'scale(1.08) translateY(-10px)' : 'scale(1)',
                    }}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/40 transition-colors"></div>
                    <div className="flex justify-between items-center border-b border-purple-500/30 pb-3 relative z-10">
                        <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-purple-400 flex items-center gap-2">
                            <span className="text-base group-hover:animate-bounce">🏆</span> MILESTONE
                        </span>
                    </div>
                    <h3 className="text-2xl text-white font-bold font-mono tracking-wider mt-2 relative z-10 group-hover:text-purple-300 transition-colors">{data.title}</h3>
                    <p className="text-purple-200/60 text-sm font-mono leading-relaxed relative z-10">{data.desc}</p>
                </div>
            );
        } else {
            // PROJECT
            return (
                <div className={`transition-all duration-500 ease-out 
                    w-[340px] bg-[#001015]/95 backdrop-blur-xl border-l-[6px] border-[#00ffff]
                    p-6 flex flex-col gap-3 group relative overflow-hidden bg-gradient-to-r from-[#00ffff]/5 to-transparent`}
                    style={{
                        boxShadow: hovered ? `0 0 40px rgba(0, 255, 255, 0.5)` : `0 0 15px rgba(0, 255, 255, 0.1)`,
                        transform: hovered ? 'scale(1.08) translateY(-10px)' : 'scale(1)',
                    }}>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#00ffff]/10 rounded-full blur-2xl translate-y-10 translate-x-10 pointer-events-none group-hover:bg-[#00ffff]/20 transition-colors"></div>

                    <div className="flex justify-between items-center border-b border-[#00ffff]/30 pb-3 relative z-10">
                        <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#00ffff]">
                            [ SYSTEM_PROJECT ]
                        </span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded bg-[#00ffff] animate-ping"></span>
                        </div>
                    </div>

                    <h3 className="text-xl text-white font-bold font-mono uppercase tracking-widest mt-2 relative z-10 group-hover:drop-shadow-[0_0_8px_#00ffff] transition-all">{data.title}</h3>
                    <p className="text-[#00ffff]/60 text-sm font-mono leading-relaxed relative z-10">{data.desc}</p>
                    <div className="mt-2 w-1/2 group-hover:w-full transition-all duration-700 h-[2px] relative z-10 bg-gradient-to-r from-[#00ffff] to-transparent"></div>
                </div>
            );
        }
    };

    return (
        <group ref={groupRef} position={[Math.cos(angle) * initRadius, initHeight, Math.sin(angle) * initRadius]}>
            <Html transform center scale={isVisible ? 1.5 : 0.001} distanceFactor={15} zIndexRange={[100, 0]}>
                <div
                    className="p-4"
                    style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-out' }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {renderCardContent()}
                </div>
            </Html>
        </group>
    );
}

function FlyingCards({ active }: { active: boolean }) {
    // Generate some highly impressive mock items for the cards
    // The user requested: "certificates achivment and projects in differenet card"
    const cardsData = useMemo(() => [
        { id: 1, type: 'PROJECT', title: 'Infra Sentinel', desc: 'Computer Vision Defect Detection Model for Industrial QC environments.' },
        { id: 2, type: 'CERTIFICATE', title: 'AWS Solutions', desc: 'Certified Solutions Architect - Advanced Cloud Operations.' },
        { id: 3, type: 'ACHIEVEMENT', title: 'Global Hackathon', desc: 'Top 5 Finish Worldwide in AI & LLM Systems Challenge.' },
        { id: 4, type: 'PROJECT', title: 'Cybreon Core', desc: 'AI-Powered Agentic RAG Brain software for autonomous robotics.' },
        { id: 5, type: 'ACHIEVEMENT', title: 'Code Olympiad', desc: 'National Finalist and Medalist in Competitive Programming.' },
        { id: 6, type: 'CERTIFICATE', title: 'Neural Networks', desc: 'Specialization in Deep Learning and Generative AI Architectures.' },
        { id: 7, type: 'PROJECT', title: 'Nexus VR', desc: 'Immersive WebGL data visualization platform for high-density metrics.' },
        { id: 8, type: 'ACHIEVEMENT', title: 'Open Source', desc: '100+ Contributions to High-Impact OSS Repositories.' }
    ], []);

    return (
        <group>
            {cardsData.map((data, idx) => (
                <FlyingCard key={data.id} data={data} index={idx} active={active} total={cardsData.length} />
            ))}
        </group>
    );
}

// 3. Cinematic Auto-Tour Camera
function AutoTourCamera({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
    const { camera } = useThree();
    const startTime = useRef(0);
    const tourDuration = 25; // 25 seconds long

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

        const segment = Math.floor(progress * 5);
        const segmentProgress = (progress * 5) % 1;

        switch (segment) {
            case 0: // Approach
                camera.position.set(0, 6, 25 - segmentProgress * 10);
                camera.lookAt(0, 4, 0);
                break;
            case 1: // Arc around right server
                camera.position.x = Math.sin(segmentProgress * Math.PI) * 15;
                camera.position.z = 15 - Math.cos(segmentProgress * Math.PI) * 5;
                camera.lookAt(0, 4, 0);
                break;
            case 2: // Low sweep across the floor
                camera.position.set(15 - segmentProgress * 30, 2 + Math.sin(segmentProgress * Math.PI) * 2, -10 + segmentProgress * 5);
                camera.lookAt(0, 4, 0);
                break;
            case 3: // High angle overlook
                camera.position.set(-15 + segmentProgress * 15, 4 + segmentProgress * 10, -5 + segmentProgress * 15);
                camera.lookAt(0, 4, 0);
                break;
            case 4: // Return to base
                camera.position.set(0, 14 - segmentProgress * 8, 10 + segmentProgress * 15);
                camera.lookAt(0, 4, 0);
                break;
        }
    });

    return null;
}

// Core Component Updates
function SupercomputerCore() {
    const coreRef = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Group>(null);
    const dataLinesRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (coreRef.current) {
            coreRef.current.position.y = Math.sin(t * 0.5) * 0.2 + 4;
        }
        if (ringRef.current) {
            ringRef.current.rotation.y = t * 0.15;
            ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
        }
        if (dataLinesRef.current) {
            dataLinesRef.current.rotation.y = -t * 0.08;
        }
    });

    return (
        <group ref={coreRef}>
            <mesh castShadow>
                <boxGeometry args={[3, 5, 3]} />
                <meshStandardMaterial
                    color="#050505"
                    metalness={0.95}
                    roughness={0.05}
                    envMapIntensity={3}
                />
            </mesh>

            {/* Glowing inner core panels */}
            <mesh position={[0, 0, 1.51]}>
                <planeGeometry args={[0.3, 4.5]} />
                <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh position={[0, 0, -1.51]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[0.3, 4.5]} />
                <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh position={[1.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.3, 4.5]} />
                <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh position={[-1.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[0.3, 4.5]} />
                <meshBasicMaterial color="#00ffff" />
            </mesh>

            <group ref={ringRef} position={[0, 0, 0]}>
                {/* Double Ring Structure for enhanced visuals */}
                <mesh>
                    <torusGeometry args={[4.5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
                </mesh>
                <mesh rotation={[Math.PI / 4, 0, 0]}>
                    <torusGeometry args={[3.8, 0.01, 16, 100]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
                </mesh>
            </group>

            <group ref={dataLinesRef}>
                {[...Array(30)].map((_, i) => {
                    const angle = (i / 30) * Math.PI * 2;
                    const radius = 3.5 + Math.random() * 1.5;
                    const height = (Math.random() - 0.5) * 5;
                    return (
                        <mesh key={i} position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
                            <boxGeometry args={[0.06, 0.3, 0.06]} />
                            <meshBasicMaterial color={i % 3 === 0 ? "#00ffff" : "#a0a0a0"} transparent opacity={Math.random() * 0.6 + 0.3} />
                        </mesh>
                    );
                })}
            </group>

            <pointLight distance={20} intensity={2} color="#00ffff" />
        </group>
    );
}

function ServerRack({ position, rotation, delay, hasTerminal = false }: { position: [number, number, number], rotation: [number, number, number], delay: number, hasTerminal?: boolean }) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const t = clock.getElapsedTime();
            meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + delay) * 0.1;
        }
    });

    return (
        <group ref={meshRef} position={position} rotation={rotation}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2, 10, 2]} />
                <meshStandardMaterial
                    color="#050505"
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>

            {[...Array(8)].map((_, i) => (
                <LightStatus key={i} position={[(i % 2 === 0 ? -0.5 : 0.5), 3 - i * 0.8, 1.01]} delay={delay + i * 0.3} />
            ))}

            {hasTerminal && (
                <TerminalDisplay position={[0, -1, 0]} rotation={[0, 0, 0]} />
            )}
        </group>
    );
}

function LightStatus({ position, delay }: { position: [number, number, number], delay: number }) {
    const lightRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (lightRef.current) {
            const time = clock.getElapsedTime() + delay;
            const isOn = Math.sin(time * 5) > 0 || Math.sin(time * 1.5) > 0.8;
            (lightRef.current.material as THREE.MeshBasicMaterial).opacity = isOn ? 0.8 : 0.1;
        }
    });

    return (
        <mesh ref={lightRef} position={position}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
    );
}

function Scene({ showResume, showScanner, showCards, autoTour, onTourComplete }: { showResume: boolean, showScanner: boolean, showCards: boolean, autoTour: boolean, onTourComplete: () => void }) {
    return (
        <>
            <Environment preset="city" environmentIntensity={0.6} />

            <ambientLight intensity={0.3} color="#ffffff" />
            <directionalLight position={[15, 30, 15]} intensity={1} color="#e0f2fe" castShadow />
            <spotLight position={[-15, 25, -15]} intensity={2.5} angle={0.8} penumbra={1} color="#00ffff" castShadow />

            <Stars radius={150} depth={60} count={3000} factor={3} saturation={1} fade speed={1.5} />

            <fog attach="fog" args={['#030508', 20, 100]} />

            <SupercomputerCore />
            <HolographicResume active={showResume} />
            <LaserScanner active={showScanner} />
            <FlyingCards active={showCards} />

            {/* Interactive Data Nodes */}
            <DataNode
                position={[-4, 3, 4]}
                label="LOG_01"
                content="Personal Log: System architecture optimized. Main sequence stable. Waiting for new inputs..."
                delay={0}
            />
            <DataNode
                position={[4, 5, 2]}
                label="SECRETS"
                content="Easter Egg Discovered. You have successfully navigated to the core."
                delay={1}
            />
            <DataNode
                position={[5, 4, -4]}
                label="SYS_WARN"
                content="Warning: Coffee levels low. Developer functionality may be impacted."
                delay={2}
            />

            <ServerRack position={[-10, 5, -10]} rotation={[0, Math.PI / 6, 0]} delay={0} />
            <ServerRack position={[12, 5, -8]} rotation={[0, -Math.PI / 4, 0]} delay={1} hasTerminal={true} />
            <ServerRack position={[-8, 5, 12]} rotation={[0, Math.PI / 3, 0]} delay={2} />
            <ServerRack position={[10, 5, 10]} rotation={[0, -Math.PI / 6, 0]} delay={3} />
            <ServerRack position={[0, 5, -15]} rotation={[0, 0, 0]} delay={4} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[200, 200]} />
                <MeshReflectorMaterial
                    blur={[400, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={100}
                    roughness={0.05}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#0a0a0a"
                    metalness={0.8}
                    mirror={0.8}
                />
            </mesh>

            <gridHelper args={[200, 200, '#333333', '#111111']} position={[0, 0.01, 0]} />

            {autoTour ? (
                <AutoTourCamera isActive={autoTour} onComplete={onTourComplete} />
            ) : (
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={0.3}
                    enablePan={false}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.02}
                    minDistance={8}
                    maxDistance={35}
                    target={[0, 3, 0]}
                    dampingFactor={0.05}
                />
            )}
        </>
    );
}

export interface HiddenQuantumCoreProps {
    onClose: () => void;
}

export function HiddenQuantumCore({ onClose }: HiddenQuantumCoreProps) {
    const audioRef = useRef<HTMLIFrameElement>(null);
    const [showResume, setShowResume] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [autoTour, setAutoTour] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[999999] bg-[#030508]"
            style={{ fontFamily: 'Inter, Orbitron, sans-serif' }}
        >
            {/* Headers and Exits */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none flex justify-between items-start w-[calc(100%-4rem)]">
                <div>
                    <h1 className="text-xl md:text-2xl font-light text-white tracking-[0.3em] uppercase opacity-90 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                        Neural <span className="font-bold text-[#00ffff]">Archive</span>
                    </h1>
                    <div className="mt-4 flex flex-col gap-1 text-[10px] md:text-xs text-[#00ffff] font-mono tracking-widest uppercase">
                        <p className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#00ffff] rounded-full animate-pulse opacity-80 shadow-[0_0_8px_#00ffff]"></span>
                            Status: Online / Synced
                        </p>
                        <p className="ml-4 opacity-60">System Core: MK-V Protocol Max</p>
                        <p className="ml-4 opacity-60">Uplink: ESTABLISHED</p>
                    </div>
                </div>
            </div>

            {/* UI Command Panel */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-4 pointer-events-auto">
                <button
                    onClick={() => setAutoTour(!autoTour)}
                    className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border backdrop-blur-md transition-all 
                        ${autoTour ? 'border-white text-white bg-white/10' : 'border-[#00ffff]/30 text-[#00ffff]/70 hover:text-[#00ffff] hover:border-[#00ffff]/80 hover:bg-[#00ffff]/10'}`}
                    style={{ textShadow: autoTour ? '0 0 8px rgba(255,255,255,0.5)' : 'none' }}
                >
                    {autoTour ? '[ STOP TOUR ]' : '[ RUN TOUR ]'}
                </button>
                <button
                    onClick={() => setShowCards(!showCards)}
                    className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border backdrop-blur-md transition-all 
                        ${showCards ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_15px_rgba(255,0,255,0.3)]' : 'border-[#ff00ff]/30 text-[#ff00ff]/70 hover:text-[#ff00ff] hover:border-[#ff00ff]/80 hover:bg-[#ff00ff]/10'}`}
                >
                    [ ANALYZE ]
                </button>
                <button
                    onClick={() => setShowResume(!showResume)}
                    className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border backdrop-blur-md transition-all 
                        ${showResume ? 'border-white text-white bg-white/10' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-white/5'}`}
                >
                    [ INTEL ]
                </button>
                <button
                    onClick={() => setShowScanner(!showScanner)}
                    className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border backdrop-blur-md transition-all 
                        ${showScanner ? 'border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10 shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'border-gray-700 text-gray-400 hover:text-[#00ffff] hover:border-[#00ffff]/50 hover:bg-[#00ffff]/5'}`}
                >
                    [ SCAN ]
                </button>
            </div>

            <button
                onClick={onClose}
                className="absolute top-8 right-8 z-10 px-6 py-2 bg-transparent text-[#ff4444]/70 hover:text-[#ff4444] border border-[#ff4444]/30 hover:border-[#ff4444] rounded-sm transition-all text-xs tracking-[0.2em] uppercase backdrop-blur-sm pointer-events-auto hover:bg-[#ff4444]/10 shadow-[0_0_10px_rgba(255,68,68,0)] hover:shadow-[0_0_15px_rgba(255,68,68,0.4)]"
            >
                Disconnect
            </button>

            <Canvas shadows camera={{ position: [0, 8, 30], fov: 45 }}>
                <Suspense fallback={
                    <Html center>
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent animate-pulse shadow-[0_0_10px_#00ffff]"></div>
                            <div className="text-[#00ffff] text-xs font-mono tracking-[0.3em] uppercase drop-shadow-[0_0_5px_#00ffff]">
                                Initializing Simulation
                            </div>
                        </div>
                    </Html>
                }>
                    <Scene
                        showResume={showResume}
                        showScanner={showScanner}
                        showCards={showCards}
                        autoTour={autoTour}
                        onTourComplete={() => setAutoTour(false)}
                    />
                </Suspense>
            </Canvas>

            {/* Hidden Audio Player */}
            <iframe
                ref={audioRef}
                style={{
                    display: 'none',
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    border: 'none',
                }}
                src={`https://www.youtube.com/embed/N76txbrkDhE?autoplay=1&loop=1&playlist=N76txbrkDhE&controls=0&showinfo=0&modestbranding=1&rel=0`}
                allow="autoplay; encrypted-media"
                title="Sujal Portfolio Dark Theme Music"
            />

            <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
            }}></div>
        </motion.div>
    );
}
