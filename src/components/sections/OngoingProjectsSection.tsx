import { useState } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useResponsive } from '../../hooks/useResponsive';
import { Code, ExternalLink, Rocket, BarChart3, Award, Truck } from 'lucide-react';
import { FeaturedBadge } from '../FeaturedBadge';
import { ProjectActions } from '../ProjectActions';
import { useSafeMutation } from '../../hooks/useConvexSafe';
import { api } from '../../../convex/_generated/api';

interface Project {
    title: string;
    description: string;
    icon: any;
    tags: string[];
    gradient: string;
    netflixStyle?: boolean;
    featured?: {
        type: 'featured' | 'top-rated' | 'award-winning' | 'best' | 'new' | 'startup';
        variant: 'ribbon' | 'corner' | 'floating' | 'glow';
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    };
    status: string;
    achievement?: {
        title: string;
        subtitle: string;
        description: string;
    };
    image?: string;
    projectUrl?: string;
    githubUrl?: string;
    teamProject?: boolean;
    targetDate?: string;
}

const ongoingProjects: Project[] = [
    {
        title: 'InfraSentinel',
        description: 'Revolutionary AI-based system for real-time infrastructure monitoring, predictive maintenance, and anomaly detection using advanced machine learning algorithms and IoT sensors',
        icon: Rocket,
        tags: ['AI/ML', 'IoT', 'Predictive Analytics', 'Computer Vision', 'Cloud Computing'],
        gradient: 'from-gray-700 to-gray-900',
        netflixStyle: true,
        featured: { type: 'startup', variant: 'glow', position: 'top-left' },
        status: 'Research Phase',
        achievement: {
            title: 'Selected at IIT Gandhinagar',
            subtitle: 'Venture Spark Module 2',
            description: 'Selected for training and mentoring at IIT Gandhinagar Venture Spark Module 2 - A prestigious startup incubation program',
        },
    },
    {
        title: 'EvolveX AI',
        description: 'An intelligent career suggestion platform leveraging AI/ML to provide personalized career recommendations, skill gap analysis, and learning pathways',
        icon: BarChart3,
        tags: ['Streamlit', 'Llama', 'Gemini', 'XGBoost', 'NumPy', 'MongoDB'],
        gradient: 'from-gray-700 to-gray-900',
        image: 'https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/refs/heads/main/Screenshot%202025-12-07%20190718.png',
        projectUrl: 'https://sujaltalreja04-google-cloud-hackathon-2025-appmain-pnutz6.streamlit.app/',
        githubUrl: 'https://github.com/Sujaltalreja04/Evolvex-AI-',
        netflixStyle: true,
        featured: { type: 'featured', variant: 'floating', position: 'top-right' },
        status: 'Active Development',
    },
    {
        title: 'Zyntral AI',
        description: 'Next-generation intelligence platform for supply chain & logistics. An advanced research project focused on building AI-driven operational intelligence systems capable of understanding real-time fleet data, predicting disruptions, optimizing routes, and enabling smarter logistics decisions at scale. Currently in deep research phase exploring real-time mobility patterns, multimodal AI decision models, predictive logistics algorithms, fleet behavior modeling, operational bottleneck detection, and high-reliability system architecture. Target launch: Mid-2026 with team collaboration.',
        icon: Truck,
        tags: ['AI/ML', 'Logistics', 'Supply Chain', 'Predictive Analytics', 'Fleet Optimization', 'Research'],
        gradient: 'from-gray-700 to-gray-900',
        image: 'https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/main/6799a6f6-37f5-46a5-ade2-b2094d969921.png',
        netflixStyle: true,
        featured: { type: 'award-winning', variant: 'corner', position: 'top-right' },
        status: 'Upcoming - 2026',
        teamProject: true,
        targetDate: 'Mid-2026',
    },
];

export const OngoingProjectsSection = () => {
    const [ref, isInView] = useInView();
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
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
            viewProject({ projectId: ongoingProjects[index].title }).catch(console.error);
        }
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
            id="ongoing-projects"
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
                    ONGOING PROJECTS
                </motion.h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className={`grid ${gridCols} gap-4 md:gap-6 lg:gap-8`}
                >
                    {ongoingProjects.map((project, index) => {
                        const Icon = project.icon;
                        const isFlipped = flippedCards.includes(index);

                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="relative h-80 sm:h-96"
                                style={{ perspective: '1000px' }}
                            >
                                {/* Featured Badge */}
                                {project.featured && (
                                    <FeaturedBadge
                                        type={project.featured.type}
                                        variant={project.featured.variant}
                                        position={project.featured.position}
                                    />
                                )}

                                <motion.div
                                    className="relative w-full h-full transition-transform duration-700 preserve-3d"
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    whileHover={{ scale: isSmallScreen ? 1 : 1.02 }}
                                >
                                    {/* FRONT SIDE */}
                                    <div
                                        className="absolute inset-0 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-lg md:rounded-xl p-4 md:p-6 backface-hidden cursor-pointer"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                                        }}
                                        onClick={() => toggleFlip(index)}
                                    >
                                        {/* Netflix-style card */}
                                        {project.netflixStyle ? (
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
                                                                className="w-full h-full object-contain transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
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

                                                    {/* Status Badge */}
                                                    {project.status && (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 mb-3 w-fit">
                                                            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                                            <span className="text-xs font-bold text-orange-300">
                                                                {project.status}
                                                            </span>
                                                        </div>
                                                    )}

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
                                        ) : null}
                                    </div>

                                    {/* BACK SIDE */}
                                    <div
                                        className="absolute inset-0 backdrop-blur-md bg-[rgba(26,26,26,0.9)] border border-[rgba(192,192,192,0.3)] rounded-lg md:rounded-xl p-4 md:p-6 backface-hidden cursor-pointer overflow-y-auto"
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

                                        {/* Achievement Highlight - Only for InfraSentinel */}
                                        {project.achievement && (
                                            <div className="mb-4 p-3 md:p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/40">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                                        <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm md:text-base font-bold text-yellow-400 mb-1">
                                                            {project.achievement.title}
                                                        </h4>
                                                        <p className="text-orange-300 text-xs md:text-sm font-semibold mb-1">
                                                            {project.achievement.subtitle}
                                                        </p>
                                                        <p className="text-gray-300 text-xs leading-relaxed">
                                                            {project.achievement.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Team Project & Target Date - For Zyntral AI */}
                                        {(project as any).teamProject && (project as any).targetDate && (
                                            <div className="mb-4 p-3 md:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-cyan-500/40">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex -space-x-2 flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center border-2 border-gray-900">
                                                            <span className="text-white text-xs font-bold">S</span>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center border-2 border-gray-900">
                                                            <span className="text-white text-xs font-bold">T</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm md:text-base font-bold text-cyan-400 mb-1">
                                                            Team Collaboration Project
                                                        </h4>
                                                        <p className="text-teal-300 text-xs md:text-sm font-semibold mb-1">
                                                            Target Launch: {(project as any).targetDate}
                                                        </p>
                                                        <p className="text-gray-300 text-xs leading-relaxed">
                                                            Building the future of logistics intelligence with a dedicated research team
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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

                                            {project.githubUrl && (
                                                <motion.button
                                                    className="w-full backdrop-blur-md bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.3)] rounded-lg px-3 py-2 md:px-4 md:py-3 text-gray-300 font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
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
                                                >
                                                    <Code className="w-4 h-4" />
                                                    VIEW CODE
                                                </motion.button>
                                            )}
                                        </div>

                                        <ProjectActions projectId={project.title} />
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.section>
    );
};
