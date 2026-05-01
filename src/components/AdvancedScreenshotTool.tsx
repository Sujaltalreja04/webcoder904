import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    Download,
    Share2,
    X,
    Brush,
    Square,
    Maximize2,
    Monitor,
    Scissors,
    Copy,
    Twitter,
    Linkedin,
    Facebook,
    Sparkles,
    Undo,
    Redo,
    Trash2,
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface Screenshot {
    id: string;
    dataUrl: string;
    timestamp: number;
    name: string;
}

type CaptureMode = 'fullpage' | 'visible' | 'selection' | 'section';
type Filter = 'none' | 'cyberpunk' | 'neon' | 'professional' | 'vintage' | 'monochrome';

export const AdvancedScreenshotTool = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [captureMode, setCaptureMode] = useState<CaptureMode>('visible');
    const [isCapturing, setIsCapturing] = useState(false);
    const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
    const [currentScreenshot, setCurrentScreenshot] = useState<string | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<Filter>('none');
    const [showGallery, setShowGallery] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const editorCanvasRef = useRef<HTMLCanvasElement>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl/Cmd + Shift + S = Open Screenshot Tool
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                setIsOpen(true);
            }
            // Ctrl/Cmd + Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && showEditor) {
                e.preventDefault();
                handleUndo();
            }
            // Ctrl/Cmd + Y = Redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'y' && showEditor) {
                e.preventDefault();
                handleRedo();
            }
            // Escape = Close
            if (e.key === 'Escape') {
                setIsOpen(false);
                setShowEditor(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showEditor, historyStep]);

    // Capture screenshot based on mode
    const captureScreenshot = async () => {
        setIsCapturing(true);
        try {
            let element: HTMLElement | null = null;

            switch (captureMode) {
                case 'fullpage':
                    element = document.documentElement;
                    break;
                case 'visible':
                    element = document.body;
                    break;
                case 'section':
                    // Capture currently visible section
                    const sections = document.querySelectorAll('section');
                    const viewportCenter = window.innerHeight / 2;
                    for (const section of sections) {
                        const rect = section.getBoundingClientRect();
                        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                            element = section as HTMLElement;
                            break;
                        }
                    }
                    break;
                default:
                    element = document.body;
            }

            if (element) {
                const canvas = await html2canvas(element, {
                    backgroundColor: '#0a0a0a',
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                });

                const dataUrl = canvas.toDataURL('image/png');
                setCurrentScreenshot(dataUrl);
                setShowEditor(true);

                // Initialize history
                setHistory([dataUrl]);
                setHistoryStep(0);

                // Save to gallery
                const newScreenshot: Screenshot = {
                    id: Date.now().toString(),
                    dataUrl,
                    timestamp: Date.now(),
                    name: `Screenshot ${new Date().toLocaleString()}`,
                };
                setScreenshots((prev) => [newScreenshot, ...prev]);
            }
        } catch (error) {
            console.error('Screenshot capture failed:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    // Apply filter to screenshot
    const applyFilter = (filter: Filter) => {
        if (!currentScreenshot || !editorCanvasRef.current) return;

        const canvas = editorCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            switch (filter) {
                case 'cyberpunk':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = Math.min(255, data[i] * 1.2); // Boost red
                        data[i + 1] = Math.min(255, data[i + 1] * 0.8); // Reduce green
                        data[i + 2] = Math.min(255, data[i + 2] * 1.4); // Boost blue
                    }
                    break;
                case 'neon':
                    for (let i = 0; i < data.length; i += 4) {
                        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        if (brightness > 128) {
                            data[i] = Math.min(255, data[i] * 1.5);
                            data[i + 1] = Math.min(255, data[i + 1] * 1.3);
                            data[i + 2] = Math.min(255, data[i + 2] * 1.5);
                        }
                    }
                    break;
                case 'professional':
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = Math.min(255, data[i] * 0.95);
                        data[i + 1] = Math.min(255, data[i + 1] * 0.95);
                        data[i + 2] = Math.min(255, data[i + 2] * 1.05);
                    }
                    break;
                case 'vintage':
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = Math.min(255, avg * 1.1);
                        data[i + 1] = Math.min(255, avg * 0.9);
                        data[i + 2] = Math.min(255, avg * 0.7);
                    }
                    break;
                case 'monochrome':
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = data[i + 1] = data[i + 2] = avg;
                    }
                    break;
            }

            ctx.putImageData(imageData, 0, 0);
            const filteredDataUrl = canvas.toDataURL('image/png');
            setCurrentScreenshot(filteredDataUrl);
            addToHistory(filteredDataUrl);
        };
        img.src = currentScreenshot;
    };

    // History management
    const addToHistory = (dataUrl: string) => {
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(dataUrl);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyStep > 0) {
            setHistoryStep(historyStep - 1);
            setCurrentScreenshot(history[historyStep - 1]);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            setHistoryStep(historyStep + 1);
            setCurrentScreenshot(history[historyStep + 1]);
        }
    };

    // Download screenshot
    const downloadScreenshot = (format: 'png' | 'jpg' | 'webp' = 'png') => {
        if (!currentScreenshot) return;

        const link = document.createElement('a');
        link.download = `sujal-portfolio-${Date.now()}.${format}`;

        if (format !== 'png') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                link.href = canvas.toDataURL(`image/${format}`);
                link.click();
            };
            img.src = currentScreenshot;
        } else {
            link.href = currentScreenshot;
            link.click();
        }
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        if (!currentScreenshot) return;

        try {
            const blob = await (await fetch(currentScreenshot)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ]);
            alert('✅ Screenshot copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    // Share on social media
    const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
        const text = 'Check out this amazing portfolio by Sujal Talreja! 🚀';
        const url = window.location.href;

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        };

        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    // AI-powered caption generation
    const generateAICaption = () => {
        const captions = [
            '🚀 Exploring the future of web development on Sujal Talreja\'s portfolio!',
            '💻 Mind-blowing projects and skills showcased here! Check it out!',
            '✨ This portfolio is next-level! AI-powered, beautifully designed.',
            '🎯 Innovation meets design. This is what modern portfolios should look like!',
            '🌟 Impressed by this developer\'s work! #WebDev #React #AI',
        ];
        return captions[Math.floor(Math.random() * captions.length)];
    };

    const captureModes = [
        { id: 'visible' as CaptureMode, label: 'Visible Area', icon: Monitor },
        { id: 'fullpage' as CaptureMode, label: 'Full Page', icon: Maximize2 },
        { id: 'section' as CaptureMode, label: 'Current Section', icon: Square },
        { id: 'selection' as CaptureMode, label: 'Custom Selection', icon: Scissors },
    ];

    const filters = [
        { id: 'none' as Filter, label: 'Original' },
        { id: 'cyberpunk' as Filter, label: 'Cyberpunk' },
        { id: 'neon' as Filter, label: 'Neon' },
        { id: 'professional' as Filter, label: 'Professional' },
        { id: 'vintage' as Filter, label: 'Vintage' },
        { id: 'monochrome' as Filter, label: 'Monochrome' },
    ];

    return (
        <>
            {/* Floating Screenshot Button */}
            <motion.button
                className="fixed bottom-24 right-4 md:right-8 z-40 backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/40 rounded-full p-3 md:p-4 shadow-lg"
                whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                title="Take Screenshot (Ctrl+Shift+S)"
            >
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
            </motion.button>

            {/* Main Screenshot Tool Panel */}
            <AnimatePresence>
                {isOpen && !showEditor && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-2xl p-6 md:p-8 max-w-md w-full"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <Camera className="w-6 h-6 text-purple-400" />
                                    Screenshot Tool
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                Capture, edit, and share your favorite parts of this portfolio!
                            </p>

                            {/* Capture Mode Selection */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">
                                    Capture Mode
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {captureModes.map((mode) => {
                                        const Icon = mode.icon;
                                        return (
                                            <motion.button
                                                key={mode.id}
                                                className={`p-4 rounded-lg border-2 transition-all ${captureMode === mode.id
                                                        ? 'border-purple-400 bg-purple-500/20'
                                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setCaptureMode(mode.id)}
                                            >
                                                <Icon className={`w-6 h-6 mb-2 ${captureMode === mode.id ? 'text-purple-400' : 'text-gray-400'}`} />
                                                <p className={`text-xs font-medium ${captureMode === mode.id ? 'text-purple-300' : 'text-gray-400'}`}>
                                                    {mode.label}
                                                </p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <motion.button
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={captureScreenshot}
                                    disabled={isCapturing}
                                >
                                    {isCapturing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Capturing...
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-5 h-5" />
                                            Capture Screenshot
                                        </>
                                    )}
                                </motion.button>

                                <motion.button
                                    className="w-full backdrop-blur-md bg-gray-800/50 border border-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02, borderColor: '#9333ea' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowGallery(true)}
                                >
                                    <Maximize2 className="w-5 h-5" />
                                    View Gallery ({screenshots.length})
                                </motion.button>
                            </div>

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                💡 Tip: Press <kbd className="px-2 py-1 bg-gray-800 rounded">Ctrl+Shift+S</kbd> anywhere
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screenshot Editor */}
            <AnimatePresence>
                {showEditor && currentScreenshot && (
                    <motion.div
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="min-h-screen p-4">
                            {/* Editor Header */}
                            <div className="max-w-7xl mx-auto mb-4">
                                <div className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Edit Screenshot
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        {/* Undo/Redo */}
                                        <button
                                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={handleUndo}
                                            disabled={historyStep <= 0}
                                            title="Undo (Ctrl+Z)"
                                        >
                                            <Undo className="w-5 h-5 text-gray-300" />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            onClick={handleRedo}
                                            disabled={historyStep >= history.length - 1}
                                            title="Redo (Ctrl+Y)"
                                        >
                                            <Redo className="w-5 h-5 text-gray-300" />
                                        </button>

                                        <button
                                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                                            onClick={() => {
                                                setShowEditor(false);
                                                setCurrentScreenshot(null);
                                            }}
                                            title="Close Editor"
                                        >
                                            <X className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Editor Area */}
                            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr,300px] gap-4">
                                {/* Canvas Area */}
                                <div className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-xl p-4 overflow-auto">
                                    <div className="relative inline-block min-w-full">
                                        <img
                                            src={currentScreenshot}
                                            alt="Screenshot"
                                            className="w-full h-auto rounded-lg shadow-2xl"
                                        />
                                        <canvas
                                            ref={editorCanvasRef}
                                            className="absolute top-0 left-0 w-full h-full"
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Tools Panel */}
                                <div className="space-y-4">
                                    {/* Filters */}
                                    <div className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-xl p-4">
                                        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            Filters
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {filters.map((filter) => (
                                                <motion.button
                                                    key={filter.id}
                                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedFilter === filter.id
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                        }`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        setSelectedFilter(filter.id);
                                                        applyFilter(filter.id);
                                                    }}
                                                >
                                                    {filter.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Download Options */}
                                    <div className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-xl p-4">
                                        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </h4>
                                        <div className="space-y-2">
                                            <button
                                                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-shadow"
                                                onClick={() => downloadScreenshot('png')}
                                            >
                                                PNG (High Quality)
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                                onClick={() => downloadScreenshot('jpg')}
                                            >
                                                JPG (Compressed)
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                                onClick={() => downloadScreenshot('webp')}
                                            >
                                                WebP (Modern)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Share Options */}
                                    <div className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-xl p-4">
                                        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </h4>

                                        {/* AI Caption */}
                                        <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                            <p className="text-xs text-purple-300 mb-1 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                AI-Generated Caption
                                            </p>
                                            <p className="text-xs text-gray-300">{generateAICaption()}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <button
                                                className="w-full px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                                onClick={copyToClipboard}
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copy to Clipboard
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                                                onClick={() => shareToSocial('twitter')}
                                            >
                                                <Twitter className="w-4 h-4" />
                                                Share on Twitter
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 bg-blue-700/20 text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-700/30 transition-colors flex items-center justify-center gap-2"
                                                onClick={() => shareToSocial('linkedin')}
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                Share on LinkedIn
                                            </button>
                                            <button
                                                className="w-full px-4 py-2 bg-blue-600/20 text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2"
                                                onClick={() => shareToSocial('facebook')}
                                            >
                                                <Facebook className="w-4 h-4" />
                                                Share on Facebook
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screenshot Gallery */}
            <AnimatePresence>
                {showGallery && (
                    <motion.div
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowGallery(false)}
                    >
                        <div className="min-h-screen p-4 md:p-8">
                            <div className="max-w-6xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        Screenshot Gallery
                                    </h3>
                                    <button
                                        onClick={() => setShowGallery(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {screenshots.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">No screenshots yet. Take your first one!</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {screenshots.map((screenshot) => (
                                            <motion.div
                                                key={screenshot.id}
                                                className="backdrop-blur-md bg-[rgba(26,26,26,0.95)] border border-purple-400/30 rounded-xl p-4 group"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="relative overflow-hidden rounded-lg mb-3">
                                                    <img
                                                        src={screenshot.dataUrl}
                                                        alt={screenshot.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            className="p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
                                                            onClick={() => {
                                                                setCurrentScreenshot(screenshot.dataUrl);
                                                                setShowGallery(false);
                                                                setShowEditor(true);
                                                            }}
                                                            title="Edit"
                                                        >
                                                            <Brush className="w-5 h-5 text-white" />
                                                        </button>
                                                        <button
                                                            className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                                            onClick={() => {
                                                                setScreenshots((prev) =>
                                                                    prev.filter((s) => s.id !== screenshot.id)
                                                                );
                                                            }}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5 text-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 truncate">{screenshot.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(screenshot.timestamp).toLocaleString()}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
    );
};
