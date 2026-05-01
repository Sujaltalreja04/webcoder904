import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';

interface GestureData {
    rotation: { x: number; y: number };
    zoom: number;
    pan: { x: number; y: number };
    gesture: 'palm' | 'pinch' | 'fist' | 'peace' | 'point' | 'none';
}

interface HandGestureControllerProps {
    onGestureChange: (data: GestureData) => void;
    enabled: boolean;
}

export const HandGestureController: React.FC<HandGestureControllerProps> = ({
    onGestureChange,
    enabled
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handsRef = useRef<Hands | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [detectedGesture, setDetectedGesture] = useState<string>('None');
    const lastHandPosition = useRef({ x: 0, y: 0, z: 0 });
    const gestureData = useRef<GestureData>({
        rotation: { x: 0, y: 0 },
        zoom: 0,
        pan: { x: 0, y: 0 },
        gesture: 'none'
    });

    // Calculate distance between two landmarks
    const getDistance = (p1: any, p2: any): number => {
        return Math.sqrt(
            Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.y - p2.y, 2) +
            Math.pow(p1.z - p2.z, 2)
        );
    };

    // Detect which gesture is being made
    const detectGesture = useCallback((landmarks: any[]) => {
        if (!landmarks || landmarks.length === 0) return 'none';

        const hand = landmarks[0];

        // Key landmarks
        const thumb_tip = hand[4];
        const index_tip = hand[8];
        const middle_tip = hand[12];
        const ring_tip = hand[16];
        const pinky_tip = hand[20];
        const index_mcp = hand[5];
        const middle_mcp = hand[9];
        const ring_mcp = hand[13];
        const pinky_mcp = hand[17];

        // Calculate distances
        const thumbIndexDist = getDistance(thumb_tip, index_tip);

        // Check if fingers are extended (tip is above MCP joint)
        const indexExtended = index_tip.y < index_mcp.y;
        const middleExtended = middle_tip.y < middle_mcp.y;
        const ringExtended = ring_tip.y < ring_mcp.y;
        const pinkyExtended = pinky_tip.y < pinky_mcp.y;

        // PINCH: Thumb and index very close
        if (thumbIndexDist < 0.05) {
            return 'pinch';
        }

        // PEACE: Only index and middle extended
        if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
            return 'peace';
        }

        // POINT: Only index extended
        if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'point';
        }

        // FIST: All fingers closed
        if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            return 'fist';
        }

        // PALM: All fingers extended
        if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
            return 'palm';
        }

        return 'none';
    }, []);

    // Process hand detection results
    const onResults = useCallback((results: Results) => {
        if (!canvasRef.current || !enabled) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        if (!canvasCtx) return;

        // Clear canvas
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw video feed
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Draw hand skeleton
            drawHandSkeleton(canvasCtx, landmarks);

            // Detect gesture
            const gesture = detectGesture(results.multiHandLandmarks);
            setDetectedGesture(gesture);

            // Get palm center (landmark 9 - middle finger MCP)
            const palmCenter = landmarks[9];
            const currentPos = {
                x: palmCenter.x,
                y: palmCenter.y,
                z: palmCenter.z
            };

            // Calculate movement deltas
            const deltaX = (currentPos.x - lastHandPosition.current.x) * 5;
            const deltaY = (currentPos.y - lastHandPosition.current.y) * 5;
            const deltaZ = (currentPos.z - lastHandPosition.current.z) * 10;

            // Update gesture data based on detected gesture
            switch (gesture) {
                case 'palm':
                    // Rotate model
                    gestureData.current = {
                        ...gestureData.current,
                        rotation: {
                            x: gestureData.current.rotation.x + deltaY,
                            y: gestureData.current.rotation.y + deltaX
                        },
                        gesture: 'palm'
                    };
                    break;

                case 'pinch':
                    // Zoom
                    gestureData.current = {
                        ...gestureData.current,
                        zoom: gestureData.current.zoom + deltaZ,
                        gesture: 'pinch'
                    };
                    break;

                case 'point':
                    // Pan camera
                    gestureData.current = {
                        ...gestureData.current,
                        pan: {
                            x: gestureData.current.pan.x + deltaX,
                            y: gestureData.current.pan.y + deltaY
                        },
                        gesture: 'point'
                    };
                    break;

                case 'fist':
                case 'peace':
                    gestureData.current = {
                        ...gestureData.current,
                        gesture: gesture as any
                    };
                    break;

                default:
                    gestureData.current = {
                        ...gestureData.current,
                        gesture: 'none'
                    };
            }

            // Update last position
            lastHandPosition.current = currentPos;

            // Send gesture data to parent
            onGestureChange(gestureData.current);
        } else {
            setDetectedGesture('None');
        }

        canvasCtx.restore();
    }, [enabled, detectGesture, onGestureChange]);

    // Draw hand skeleton
    const drawHandSkeleton = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
        // Draw connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        ctx.strokeStyle = '#ff4500';
        ctx.lineWidth = 2;

        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            ctx.beginPath();
            ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
            ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
            ctx.stroke();
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * ctx.canvas.width;
            const y = landmark.y * ctx.canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, index === 0 || index === 4 || index === 8 || index === 12 || index === 16 || index === 20 ? 6 : 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#ff6b00';
            ctx.fill();
            ctx.strokeStyle = '#ff4500';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    };

    // Initialize MediaPipe Hands
    useEffect(() => {
        if (!enabled) return;

        let animationFrameId: number;
        let lastFrameTime = 0;
        const frameInterval = 1000 / 30; // 30 FPS cap

        const initHands = async () => {
            setIsRequesting(true);
            setPermissionError(null);

            try {
                // Check if mediaDevices is available (requires HTTPS in production)
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error('Camera access requires HTTPS. Please use a secure connection.');
                }

                const hands = new Hands({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                    }
                });

                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 0,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                hands.onResults(onResults);
                handsRef.current = hands;

                // Setup Camera
                if (videoRef.current) {
                    const video = videoRef.current;

                    try {
                        // Request camera access with explicit constraints
                        const stream = await navigator.mediaDevices.getUserMedia({
                            video: {
                                width: { ideal: 320 },
                                height: { ideal: 240 },
                                facingMode: 'user'
                            },
                            audio: false
                        });

                        streamRef.current = stream;
                        video.srcObject = stream;

                        // Wait for video to be ready
                        await new Promise<void>((resolve, reject) => {
                            video.onloadedmetadata = () => {
                                video.play()
                                    .then(() => resolve())
                                    .catch(reject);
                            };
                            video.onerror = () => reject(new Error('Video failed to load'));
                        });

                        setIsReady(true);
                        setIsRequesting(false);

                        // Custom animation loop
                        const processFrame = async () => {
                            if (!enabled || !video || !handsRef.current) return;

                            const now = Date.now();
                            if (now - lastFrameTime >= frameInterval) {
                                lastFrameTime = now;
                                try {
                                    await handsRef.current.send({ image: video });
                                } catch (e) {
                                    console.warn('Frame processing error:', e);
                                }
                            }

                            animationFrameId = requestAnimationFrame(processFrame);
                        };

                        processFrame();
                    } catch (err: any) {
                        console.error('Camera permission error:', err);
                        let errorMessage = 'Camera access denied';

                        if (err.name === 'NotAllowedError') {
                            errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
                        } else if (err.name === 'NotFoundError') {
                            errorMessage = 'No camera found. Please connect a camera.';
                        } else if (err.name === 'NotReadableError') {
                            errorMessage = 'Camera is in use by another application.';
                        } else if (err.name === 'OverconstrainedError') {
                            errorMessage = 'Camera does not meet requirements.';
                        } else if (err.message) {
                            errorMessage = err.message;
                        }

                        setPermissionError(errorMessage);
                        setIsRequesting(false);
                    }
                }
            } catch (error: any) {
                console.error('Error initializing hand tracking:', error);
                setPermissionError(error.message || 'Failed to initialize AI model');
                setIsRequesting(false);
            }
        };

        initHands();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (handsRef.current) {
                handsRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            setIsReady(false);
        };
    }, [enabled, onResults]);

    if (!enabled) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 items-end">
            {/* Permission Error / Request UI */}
            {!isReady && (
                <div className="bg-black/90 backdrop-blur-md border border-red-500/50 rounded-xl p-6 text-center shadow-2xl max-w-xs">
                    {permissionError ? (
                        <>
                            <div className="text-red-500 font-bold mb-2">⚠️ Camera Access Failed</div>
                            <p className="text-gray-400 text-xs mb-4">{permissionError}</p>
                            <p className="text-gray-500 text-xs mb-4">
                                Note: Camera requires HTTPS in production environments.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-4 py-2 rounded-lg text-sm transition-all border border-red-500/50"
                            >
                                Retry
                            </button>
                        </>
                    ) : isRequesting ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-orange-400 text-sm font-bold">Initializing AI...</p>
                            <p className="text-gray-500 text-xs">Please allow camera access when prompted</p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Gesture Instructions Overlay - Only show when ready */}
            {isReady && (
                <div className="bg-black/80 backdrop-blur-md border border-orange-500/30 rounded-xl p-4 text-white text-xs font-mono w-64 shadow-xl">
                    <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        GESTURE COMMANDS
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span>🖐️ Open Palm</span>
                            <span className="text-gray-400">Rotate Model</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>🤏 Pinch</span>
                            <span className="text-gray-400">Zoom In/Out</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>👉 Point</span>
                            <span className="text-gray-400">Pan Camera</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>✌️ Peace Sign</span>
                            <span className="text-gray-400">Auto-Tour</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>✊ Fist</span>
                            <span className="text-gray-400">Reset View</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera preview with hand tracking overlay */}
            <div className={`relative group ${!isReady ? 'hidden' : ''}`}>
                <video
                    ref={videoRef}
                    className="hidden"
                    playsInline
                    muted
                />
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={240}
                    className="rounded-lg border-2 border-orange-500 shadow-2xl w-48 transition-all group-hover:w-80"
                    style={{
                        transform: 'scaleX(-1)', // Mirror the video
                        boxShadow: '0 0 20px rgba(255, 69, 0, 0.5)'
                    }}
                />

                {/* Gesture status indicator */}
                <div
                    className="absolute top-2 left-2 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-all"
                    style={{
                        background: 'rgba(10, 10, 10, 0.8)',
                        border: '1px solid #ff4500',
                        fontFamily: 'Orbitron, sans-serif',
                        color: detectedGesture !== 'None' ? '#ff6b00' : '#666'
                    }}
                >
                    {detectedGesture === 'palm' && '🖐️ ROTATING'}
                    {detectedGesture === 'pinch' && '🤏 ZOOMING'}
                    {detectedGesture === 'fist' && '✊ RESETTING'}
                    {detectedGesture === 'peace' && '✌️ AUTO-TOUR'}
                    {detectedGesture === 'point' && '👉 PANNING'}
                    {detectedGesture === 'None' && '👋 WAITING...'}
                </div>

                {/* Status indicator */}
                <div className="absolute bottom-2 right-2">
                    <div
                        className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{
                            boxShadow: isReady ? '0 0 10px #10b981' : '0 0 10px #ef4444'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
