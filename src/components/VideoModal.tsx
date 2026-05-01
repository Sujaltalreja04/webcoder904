import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const VideoModal = ({ isOpen, onClose, videoUrl, title }: VideoModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  // Extract YouTube video ID and thumbnail from URL
  const getYouTubeData = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    return {
      videoId,
      // Optimized embed URL with quality settings
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1` : null,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null,
    };
  };

  const { embedUrl, thumbnailUrl } = getYouTubeData(videoUrl);

  // Prevent body scroll when modal is open and reset states
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setShouldLoadVideo(false);
      setVideoStarted(false);
    } else {
      document.body.style.overflow = 'unset';
      setIsLoading(true);
      setShouldLoadVideo(false);
      setVideoStarted(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with glassmorphism */}
          <motion.div
            className="absolute inset-0 backdrop-blur-xl bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-5xl mx-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Modal Content with matching site UI/UX */}
            <div className="relative backdrop-blur-2xl bg-[rgba(26,26,26,0.95)] border-2 border-[rgba(192,192,192,0.3)] rounded-2xl overflow-hidden shadow-2xl">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 via-transparent to-gray-700/20 pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 md:p-6 border-b border-[rgba(192,192,192,0.2)]">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"
                    animate={{ rotate: videoStarted ? 360 : 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Play className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3
                    className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {title}
                  </h3>
                </div>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full backdrop-blur-md bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.3)] flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                    boxShadow: '0 0 20px rgba(192, 192, 192, 0.4)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Video Container */}
              <div className="relative p-4 md:p-6">
                <motion.div
                  className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-[rgba(192,192,192,0.2)] shadow-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {!shouldLoadVideo && thumbnailUrl ? (
                    // Thumbnail with Play Button Overlay - Click to load video
                    <div className="absolute inset-0 group cursor-pointer" onClick={() => setShouldLoadVideo(true)}>
                      <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                          setIsLoading(false);
                          setShouldLoadVideo(true); // Fallback to iframe if thumbnail fails
                        }}
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                      {/* Play Button */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-2xl border-4 border-white/20 group-hover:border-white/40 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300">
                          <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
                        </div>
                      </motion.div>

                      {/* Click to Play Text */}
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <motion.p
                          className="text-white text-sm md:text-base font-semibold backdrop-blur-sm bg-black/30 px-4 py-2 rounded-full inline-block"
                          style={{ fontFamily: 'Orbitron, sans-serif' }}
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Click to Play Video
                        </motion.p>
                      </div>

                      {/* Quality badge */}
                      <div className="absolute top-4 right-4">
                        <div className="backdrop-blur-md bg-black/50 px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/20">
                          HD
                        </div>
                      </div>
                    </div>
                  ) : shouldLoadVideo && embedUrl ? (
                    // YouTube Iframe with optimizations
                    <>
                      {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                          <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                          <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            Initializing Player...
                          </p>
                          <p className="text-gray-500 text-xs">
                            This may take a few moments on slow connections
                          </p>
                        </div>
                      )}
                      <iframe
                        src={`${embedUrl}&autoplay=1`}
                        title={title}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => {
                          setIsLoading(false);
                          setVideoStarted(true);
                        }}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <p>Invalid video URL</p>
                    </div>
                  )}
                </motion.div>

                {/* Performance Tip */}
                {!shouldLoadVideo && (
                  <motion.div
                    className="mt-3 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-xs text-gray-500">
                      💡 Tip: Video loads only when you click play for optimal performance
                    </p>
                  </motion.div>
                )}

                {/* Decorative elements matching site theme */}
                <div className="absolute top-8 left-8 w-20 h-20 bg-gradient-to-br from-gray-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-8 right-8 w-32 h-32 bg-gradient-to-tl from-gray-700/20 to-transparent rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Footer with subtle branding and YouTube link */}
              <div className="relative px-4 md:px-6 pb-4 md:pb-6 space-y-3">
                {/* Watch on YouTube Button - Better performance */}
                <motion.button
                  onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
                  className="w-full backdrop-blur-md bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30 rounded-lg px-4 py-3 text-white font-semibold flex items-center justify-center gap-2 text-sm hover:from-red-600/30 hover:to-red-800/30 transition-all"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    WATCH ON YOUTUBE (Faster)
                  </span>
                </motion.button>

                {/* Branding */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-red-800 animate-pulse" />
                  <span style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    EVOLVEX AI PROJECT DEMO
                  </span>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-red-800 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Glow effect around modal */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600/10 via-red-500/10 to-red-700/10 blur-3xl rounded-2xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
