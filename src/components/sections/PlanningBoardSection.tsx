import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  GraduationCap,
  Calendar,
  TrendingUp,
  Code,
  Brain,
  Zap,
  Clock,
  Award,
  ExternalLink
} from 'lucide-react';

// Project card interface
interface ProjectCard {
  id: string;
  title: string;
  description: string;
  category: 'project' | 'learning' | 'career';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  techStack: string[];
  deadline?: string;
  status: 'in-progress' | 'learning';
  icon?: any;
  link?: string;
}

// Initial project data based on user's input
const initialProjects: ProjectCard[] = [
  // In Progress - Active Projects
  {
    id: '1',
    title: 'InfraSentinel',
    description: 'AI-Based Infrastructure, Roads & Dams Monitoring System with drone vision, crack detection, and predictive maintenance using YOLOv10 and advanced computer vision',
    category: 'project',
    progress: 25,
    priority: 'high',
    techStack: ['YOLOv10', 'PyTorch', 'FastAPI', 'Next.js', 'PostgreSQL', 'AWS'],
    deadline: '2025-06-30',
    status: 'in-progress',
    icon: Brain,
  },
  {
    id: '2',
    title: 'Evolvex AI',
    description: 'Scaling AI-based career suggestion platform from prototype to production with enhanced features and improved user experience',
    category: 'project',
    progress: 60,
    priority: 'high',
    techStack: ['Streamlit', 'Llama', 'Gemini', 'XGBoost', 'MongoDB'],
    deadline: '2025-04-15',
    status: 'in-progress',
    icon: Rocket,
    link: 'https://github.com/Sujaltalreja04/Evolvex-AI-',
  },
  // Learning Goals - Current Focus
  {
    id: '3',
    title: 'Cutting-Edge Generative AI',
    description: 'Mastering latest GenAI technologies including advanced LLMs, multimodal AI, prompt engineering, RAG systems, and AI agents',
    category: 'learning',
    progress: 45,
    priority: 'high',
    techStack: ['GPT-4', 'Claude', 'Gemini', 'LangChain', 'Vector DBs', 'RAG'],
    status: 'learning',
    icon: GraduationCap,
  },
];

const columnConfig = [
  {
    id: 'in-progress',
    title: 'In Progress',
    subtitle: 'Active Development',
    icon: Rocket,
    gradient: 'from-orange-600/20 to-orange-800/20',
    borderColor: 'border-orange-500/30',
  },
  {
    id: 'learning',
    title: 'Learning',
    subtitle: 'Skills & Education',
    icon: GraduationCap,
    gradient: 'from-purple-600/20 to-purple-800/20',
    borderColor: 'border-purple-500/30',
  },
];

const priorityColors = {
  high: 'bg-red-500/20 border-red-500/50 text-red-400',
  medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  low: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
};

const categoryIcons = {
  project: Code,
  learning: GraduationCap,
  career: Award,
};

export const PlanningBoardSection = () => {
  const [projects, setProjects] = useState<ProjectCard[]>(initialProjects);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline'>('kanban');

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  const handleDrop = (newStatus: ProjectCard['status']) => {
    if (!draggedCard) return;

    setProjects(prev =>
      prev.map(project =>
        project.id === draggedCard
          ? { ...project, status: newStatus }
          : project
      )
    );
    setDraggedCard(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getProjectsByStatus = (status: ProjectCard['status']) => {
    return projects.filter(p => p.status === status);
  };

  const calculateOverallProgress = () => {
    const inProgressProjects = projects.filter(p => p.status === 'in-progress' || p.status === 'learning');
    if (inProgressProjects.length === 0) return 0;
    const totalProgress = inProgressProjects.reduce((sum, p) => sum + p.progress, 0);
    return Math.round(totalProgress / inProgressProjects.length);
  };

  return (
    <section id="planning" className="py-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            DEVELOPMENT ROADMAP
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Interactive project tracker showcasing current work, learning goals, and future vision
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-orange-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-center mb-2">
                <Rocket className="w-5 h-5 text-orange-400 mr-2" />
                <span className="text-2xl font-bold text-orange-400">
                  {getProjectsByStatus('in-progress').length}
                </span>
              </div>
              <p className="text-xs text-gray-400">Active Projects</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-purple-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-center mb-2">
                <GraduationCap className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-purple-400">
                  {getProjectsByStatus('learning').length}
                </span>
              </div>
              <p className="text-xs text-gray-400">Learning Goals</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-pink-500/30 rounded-xl p-4"
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-pink-400 mr-2" />
                <span className="text-2xl font-bold text-pink-400">{calculateOverallProgress()}%</span>
              </div>
              <p className="text-xs text-gray-400">Overall Progress</p>
            </motion.div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'kanban'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white border border-gray-500'
                  : 'bg-[rgba(26,26,26,0.5)] text-gray-400 border border-gray-700'
                }`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              KANBAN VIEW
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === 'timeline'
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white border border-gray-500'
                  : 'bg-[rgba(26,26,26,0.5)] text-gray-400 border border-gray-700'
                }`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              TIMELINE VIEW
            </button>
          </div>
        </motion.div>

        {/* Kanban Board */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {columnConfig.map((column, columnIndex) => {
              const ColumnIcon = column.icon;
              const columnProjects = getProjectsByStatus(column.id as ProjectCard['status']);

              return (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
                  className="flex flex-col"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.id as ProjectCard['status'])}
                >
                  {/* Column Header */}
                  <div className={`backdrop-blur-md bg-gradient-to-br ${column.gradient} border ${column.borderColor} rounded-xl p-4 mb-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ColumnIcon className="w-5 h-5 mr-2" />
                        <h3 className="font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          {column.title}
                        </h3>
                      </div>
                      <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-full">
                        {columnProjects.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{column.subtitle}</p>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 space-y-3 min-h-[400px]">
                    <AnimatePresence>
                      {columnProjects.map((project) => {
                        const CardIcon = project.icon || categoryIcons[project.category];
                        const CategoryIcon = categoryIcons[project.category];

                        return (
                          <motion.div
                            key={project.id}
                            layoutId={project.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            draggable
                            onDragStart={() => handleDragStart(project.id)}
                            onDragEnd={handleDragEnd}
                            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(192, 192, 192, 0.2)' }}
                            className={`backdrop-blur-md bg-[rgba(26,26,26,0.8)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4 cursor-move transition-all ${draggedCard === project.id ? 'opacity-50' : ''
                              }`}
                          >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mr-2">
                                  <CardIcon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-sm leading-tight">
                                    {project.title}
                                  </h4>
                                </div>
                              </div>
                              <CategoryIcon className="w-4 h-4 text-gray-400" />
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-400 mb-3 line-clamp-3">
                              {project.description}
                            </p>

                            {/* Progress Bar */}
                            {project.progress > 0 && (
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-400">Progress</span>
                                  <span className="text-xs font-bold text-gray-300">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.techStack.slice(0, 4).map((tech, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-[rgba(192,192,192,0.1)] text-gray-300 px-2 py-0.5 rounded border border-[rgba(192,192,192,0.2)]"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 4 && (
                                <span className="text-xs text-gray-500">
                                  +{project.techStack.length - 4}
                                </span>
                              )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className={`text-xs px-2 py-1 rounded border ${priorityColors[project.priority]}`}>
                                {project.priority.toUpperCase()}
                              </div>
                              {project.deadline && (
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                              )}
                              {project.link && (
                                <motion.a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.2 }}
                                  className="text-gray-400 hover:text-white"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </motion.a>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-xl p-6"
          >
            <div className="space-y-8">
              {['in-progress', 'learning'].map((status, index) => {
                const statusProjects = getProjectsByStatus(status as ProjectCard['status']);
                const column = columnConfig.find(c => c.id === status);
                if (!column || statusProjects.length === 0) return null;

                const ColumnIcon = column.icon;

                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${column.gradient} border ${column.borderColor} flex items-center justify-center mr-3`}>
                        <ColumnIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          {column.title}
                        </h3>
                        <p className="text-xs text-gray-400">{statusProjects.length} items</p>
                      </div>
                    </div>

                    <div className="pl-8 border-l-2 border-gray-700 space-y-4">
                      {statusProjects.map((project) => (
                        <motion.div
                          key={project.id}
                          whileHover={{ x: 5 }}
                          className="backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-lg p-4 ml-6 relative"
                        >
                          <div className="absolute -left-10 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-700" />

                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-white">{project.title}</h4>
                            {project.deadline && (
                              <div className="flex items-center text-xs text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(project.deadline).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-400 mb-3">{project.description}</p>

                          {project.progress > 0 && (
                            <div className="mb-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs font-bold text-gray-300">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs bg-[rgba(192,192,192,0.1)] text-gray-300 px-2 py-1 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-full px-6 py-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-sm text-gray-400">
              <span className="text-white font-semibold">Drag & Drop</span> cards between columns to update status
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};