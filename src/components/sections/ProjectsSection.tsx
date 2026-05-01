import { useState } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useResponsive } from '../../hooks/useResponsive';
import { Code, Globe, BarChart3, ExternalLink, Video, Box } from 'lucide-react';
import { VideoModal } from '../VideoModal';
import { FeaturedBadge } from '../FeaturedBadge';
import { ProjectActions } from '../ProjectActions';
import { useSafeMutation } from '../../hooks/useConvexSafe';
import { api } from '../../../convex/_generated/api';

const projects = [
  {
    title: 'Weblancer Tech',
    description: 'Full stack freelance platform with modern UI, 3D visualizations and seamless user experience',
    icon: Globe,
    tags: ['React.js', 'Next.js', 'Three.js'],
    gradient: 'from-gray-700 to-gray-900',
    image: 'https://i.ibb.co/PGbNfkCH/Screenshot-2025-11-02-150357.png',
    projectUrl: 'https://weblancer-ai.vercel.app/',
    githubUrl: 'https://github.com/Sujaltalreja04/Weblacer_AI?tab=readme-ov-file',
    netflixStyle: true,
    featured: { type: 'best', variant: 'ribbon', position: 'top-right' },
  },
  {
    title: 'QuickCourt',
    description: 'An AI Based Sports ground booking platform made in Odoo Hackathon 2025',
    icon: Globe,
    tags: ['React', 'TypeScript', 'Firebase', 'Llama',],
    gradient: 'from-gray-600 to-gray-800',
    image: 'https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/refs/heads/main/Quick%20Courts%20SPorts.png',
    projectUrl: 'https://quick-court-a-local-sports-booking.vercel.app',
    githubUrl: 'https://github.com/Sujaltalreja04/QuickCourt---A-Local-Sports-Booking-team-217-odoo-hackathon-2025',
    netflixStyle: true,
    featured: { type: 'award-winning', variant: 'corner', position: 'top-right' },
  },
  {
    title: 'Evolvex AI',
    description: 'An AI Based Career Suggestion Platform',
    icon: BarChart3,
    tags: ['Streamlit', 'Llama', 'Gemini', 'XGBoost', 'NumPy', 'MongoDB'],
    gradient: 'from-gray-700 to-gray-900',
    image: 'https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/refs/heads/main/Screenshot%202025-12-07%20190718.png',
    projectUrl: 'https://sujaltalreja04-google-cloud-hackathon-2025-appmain-pnutz6.streamlit.app/',
    githubUrl: 'https://github.com/Sujaltalreja04/Evolvex-AI-',
    videoUrl: 'https://www.youtube.com/watch?v=GjT53JZFldg&pp=0gcJCQwKAYcqIYzv',
    netflixStyle: true,
    featured: { type: 'featured', variant: 'floating', position: 'top-right' },
  },
  {
    title: 'Macro Mind AI',
    description: 'An AI Based Economy Prediction system',
    icon: Code,
    tags: ['Python', 'AI', 'Machine Learning'],
    gradient: 'from-gray-600 to-gray-800',
    image: 'https://i.ibb.co/MxzTYxwb/Screenshot-2025-11-02-163404.png',
    githubUrl: 'https://github.com/Sujaltalreja04/Country-Prediction-System',
    imageHeight: 'h-44 sm:h-52',
  },
  {
    title: 'Cybreon',
    description: 'AI Powered Robotic Brain Software',
    icon: Globe,
    tags: ['Python', 'AI', 'Robotics', 'Machine Learning'],
    gradient: 'from-gray-700 to-gray-900',
    image: 'https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/refs/heads/main/Cybreon.png',
    githubUrl: 'https://github.com/Sujaltalreja04/Cybreon_AI_Powered_Robotic_Brain_Software',
    imageHeight: 'h-48 sm:h-56',
    netflixStyle: true,
    featured: { type: 'startup', variant: 'glow', position: 'top-left' },
  },
  {
    title: 'Ai Based Deepfake Detection System',
    description: 'An AI-powered system to detect deepfake videos and images using advanced machine learning techniques',
    icon: BarChart3,
    tags: ['Python', 'TensorFlow', 'EfficientNet', 'OpenCV', 'Streamlit', 'PIL', 'Ollama', 'LLaMA3.2', 'NumPy', 'Requests'],
    gradient: 'from-gray-600 to-gray-800',
    image: 'https://i.ibb.co/ccMn3fM0/Screenshot-2025-11-02-164051.png',
    projectUrl: 'https://www.linkedin.com/posts/sujal-kishore-kumar-talreja-65975b216_ai-deepfake-computervision-ugcPost-7325085611252412416-zeLd?utm_source=share&utm_medium=member_desktop&rcm=ACoAADaSluUBOuckqBc1BiJG90rMyKi4JZ5s5vU',
    githubUrl: 'https://github.com/Sujaltalreja04/Ai-Based-Deepfake-Detection-System',
    videoUrl: 'https://www.youtube.com/watch?v=GZ38WHOjBWQ',
    cardHeight: 'h-[28rem]',
    specialTagLayout: true,
  },
];


export const ProjectsSection = () => {
  const [ref, isInView] = useInView();
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { scrollY } = useScroll();
  const { isSmallScreen, isMediumScreen } = useResponsive();

  // Parallax effect for the section
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 50]);

  // Handle image load
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  // Adjust grid columns based on screen size
  const gridCols = isSmallScreen ? 'grid-cols-1' : isMediumScreen ? 'sm:grid-cols-2' : 'lg:grid-cols-3';

  const viewProject = useSafeMutation(api.projects.viewProject);

  const toggleFlip = (index: number) => {
    const isFlippingToBack = !flippedCards.includes(index);
    setFlippedCards(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );

    if (isFlippingToBack) {
      viewProject({ projectId: projects[index].title }).catch(console.error);
    }
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300); // Clear after animation
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.section
      id="projects"
      ref={ref}
      className="min-h-screen flex items-center justify-center py-16 md:py-20 relative"
      style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        y: parallaxY
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-16 text-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
        >
          PROJECTS
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={`grid ${gridCols} gap-4 md:gap-6 lg:gap-8`}
        >
          {projects.map((project, index) => {
            const Icon = project.icon;
            const isFlipped = flippedCards.includes(index);

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative ${project.cardHeight || 'h-80 sm:h-96'}`}
                style={{ perspective: '1000px' }}
              >
                {/* Featured Badge */}
                {(project as any).featured && (
                  <FeaturedBadge
                    type={(project as any).featured.type}
                    variant={(project as any).featured.variant}
                    position={(project as any).featured.position}
                  />
                )}

                <motion.div
                  className="relative w-full h-full transition-transform duration-700 preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  whileHover={{ scale: isSmallScreen ? 1 : 1.02 }}
                >
                  <div
                    className="absolute inset-0 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-lg md:rounded-xl p-4 md:p-6 backface-hidden cursor-pointer"
                    style={{
                      backfaceVisibility: 'hidden',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                    }}
                    onClick={() => toggleFlip(index)}
                  >
                    {/* Netflix-style card */}
                    {(project as any).netflixStyle ? (
                      <div className="relative w-full h-full group">
                        {/* Image container with hover blur */}
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          {project.image ? (
                            <>
                              {/* Skeleton loader - shows while image is loading */}
                              {!loadedImages.has(index) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50">
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent"
                                    animate={{
                                      x: ['-100%', '100%'],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: 'linear',
                                    }}
                                  />
                                </div>
                              )}

                              {/* Actual image - fades in when loaded */}
                              <motion.img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: loadedImages.has(index) ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                onLoad={() => handleImageLoad(index)}
                              />
                              {/* Dark overlay on hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
                            </>
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                              <Icon className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content overlay - appears on hover */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3
                            className="text-xl md:text-2xl font-bold mb-2 text-white drop-shadow-lg"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                          >
                            {project.title}
                          </h3>

                          <p className="text-gray-200 text-sm md:text-base mb-3 line-clamp-2 drop-shadow-md">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs backdrop-blur-md bg-white/20 border border-white/30 px-3 py-1 rounded-full text-white font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Click to flip instruction with animation */}
                          <motion.div
                            className="flex items-center gap-2 text-white/90 text-xs md:text-sm font-semibold"
                            animate={{
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <motion.svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={{
                                rotate: [0, 180, 360],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </motion.svg>
                            <span className="drop-shadow-md">Click to flip for more details</span>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      /* Regular card style for other projects */
                      <>
                        <div
                          className={`mb-2 md:mb-3 ${project.imageHeight || 'h-32 sm:h-40'} bg-gradient-to-br ${project.gradient} rounded-lg flex items-center justify-center relative overflow-hidden`}
                        >
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 opacity-10">
                                <div className="grid grid-cols-6 gap-1 p-4">
                                  {[...Array(24)].map((_, i) => (
                                    <div key={i} className="w-full aspect-square bg-gray-400 rounded" />
                                  ))}
                                </div>
                              </div>
                              <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 z-10" />
                            </>
                          )}
                        </div>

                        <h3
                          className="text-lg md:text-xl font-bold mb-1.5 md:mb-2 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent"
                          style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                          {project.title}
                        </h3>

                        <p className="text-gray-400 text-xs sm:text-sm mb-2 md:mb-3 line-clamp-2">{project.description}</p>

                        <div className={`flex flex-wrap gap-1 ${project.specialTagLayout ? 'max-h-32 overflow-y-auto' : ''}`}>
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs sm:text-sm backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-gray-300 whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className="absolute inset-0 backdrop-blur-md bg-[rgba(26,26,26,0.9)] border border-[rgba(192,192,192,0.3)] rounded-lg md:rounded-xl p-4 md:p-6 backface-hidden cursor-pointer"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      boxShadow: '0 0 40px rgba(192, 192, 192, 0.3)',
                    }}
                    onClick={() => toggleFlip(index)}
                  >
                    <h3
                      className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {project.title}
                    </h3>

                    <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6">{project.description}</p>

                    <div className="space-y-2 md:space-y-3">
                      {project.projectUrl && (
                        <motion.button
                          className="w-full backdrop-blur-md bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 md:px-4 md:py-3 text-gray-300 font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: '0 0 20px rgba(192, 192, 192, 0.4)',
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (project.projectUrl) {
                              window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          VIEW PROJECT
                        </motion.button>
                      )}

                      <motion.button
                        className="w-full backdrop-blur-md bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 md:px-4 md:py-3 text-gray-300 font-semibold flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: '0 0 20px rgba(192, 192, 192, 0.4)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.githubUrl) {
                            window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        disabled={!project.githubUrl}
                      >
                        <Code className="w-4 h-4" />
                        VIEW CODE
                      </motion.button>

                      {(project as any).videoUrl && (
                        <motion.button
                          className="w-full backdrop-blur-md bg-gradient-to-r from-gray-700/20 to-gray-900/20 border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 md:px-4 md:py-3 text-gray-300 font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: '0 0 25px rgba(192, 192, 192, 0.5)',
                            background: 'linear-gradient(to right, rgba(75, 85, 99, 0.3), rgba(31, 41, 55, 0.3))',
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openVideoModal((project as any).videoUrl, project.title);
                          }}
                        >
                          <Video className="w-4 h-4" />
                          VIEW VIDEO
                        </motion.button>
                      )}

                      {/* 3D Gallery Button - Opens in New Tab for Performance */}
                      {(index === 0 || index === 1 || index === 2) && (
                        <motion.button
                          className={`w-full backdrop-blur-md bg-gradient-to-r ${index === 0
                            ? 'from-orange-500/20 to-red-500/20 border border-orange-400/40 text-orange-300'
                            : 'from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300'
                            } rounded-lg px-3 py-2 md:px-4 md:py-3 font-semibold flex items-center justify-center gap-2 text-sm md:text-base`}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: index === 0
                              ? '0 0 30px rgba(255, 69, 0, 0.6)'
                              : '0 0 30px rgba(0, 255, 255, 0.6)',
                            background: index === 0
                              ? 'linear-gradient(to right, rgba(255, 69, 0, 0.3), rgba(239, 68, 68, 0.3))'
                              : 'linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(168, 85, 247, 0.3))',
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = index === 0
                              ? '/tech3d.html'
                              : index === 1
                                ? '/museum3d.html?project=quickcourt'
                                : '/museum3d.html?project=evolvex';
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <Box className="w-4 h-4" />
                          VIEW IN 3D {index === 0 ? 'TECH GALLERY' : 'GALLERY'}
                        </motion.button>
                      )}

                      <ProjectActions projectId={project.title} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={videoModalOpen}
          onClose={closeVideoModal}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}


    </motion.section>
  );
};