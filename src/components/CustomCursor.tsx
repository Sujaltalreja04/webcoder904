import { useEffect, useState } from 'react';
import './CustomCursor.css';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Instant position update - no delay
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('button') !== null ||
                target.closest('a') !== null ||
                target.onclick !== null ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(isInteractive);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* Main Cursor Arrow */}
            <div
                className="cursor-arrow"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(0, 0) scale(${isClicking ? 0.85 : 1})`,
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Arrow pointer shape */}
                    <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill="url(#cursorGradient)"
                        stroke="url(#cursorStroke)"
                        strokeWidth="1"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="cursorGradient" x1="3" y1="3" x2="20" y2="20">
                            <stop offset="0%" stopColor="#e0e0e0" />
                            <stop offset="50%" stopColor="#c0c0c0" />
                            <stop offset="100%" stopColor="#a0a0a0" />
                        </linearGradient>
                        <linearGradient id="cursorStroke" x1="3" y1="3" x2="20" y2="20">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#808080" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Follower Ring - only when hovering */}
            {isHovering && (
                <div
                    className="cursor-follower"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                    }}
                />
            )}

            {/* Click ripple effect */}
            {isClicking && (
                <div
                    className="cursor-ripple"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                    }}
                />
            )}
        </>
    );
};
