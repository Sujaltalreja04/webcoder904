import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HiddenQuantumCore } from './3d/HiddenQuantumCore';

export function HiddenWorldController() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl + V
            if (e.ctrlKey && e.key.toLowerCase() === 'v') {
                // Ignore if the user is typing in an input or textarea
                const activeObj = document.activeElement;
                if (activeObj && (activeObj.tagName === 'INPUT' || activeObj.tagName === 'TEXTAREA')) {
                    return;
                }

                // Toggle the hidden 3D world
                setIsOpen(prev => !prev);
            }

            // Allow closing via Escape key
            if (isOpen && e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && <HiddenQuantumCore onClose={() => setIsOpen(false)} />}
        </AnimatePresence>
    );
}
