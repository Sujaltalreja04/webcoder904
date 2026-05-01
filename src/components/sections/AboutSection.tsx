import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { useResponsive } from '../../hooks/useResponsive';
import { Code, Database, Brain, BarChart3, Server, Globe, Award, TrendingUp, Users, Zap, Workflow, Cpu, BookOpen, Sparkles, Plane, Mic, PenTool } from 'lucide-react';

export const AboutSection = () => {
  const [ref, isInView] = useInView();
  const { isSmallScreen } = useResponsive();



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const skills = [
    { name: 'Fullstack Development', icon: Code, level: 90 },
    { name: 'Data Science', icon: Database, level: 85 },
    { name: 'Story Telling', icon: BookOpen, level: 88 },
    { name: 'Data Visualization', icon: BarChart3, level: 80 },
    { name: 'Databases', icon: Server, level: 85 },
    { name: 'Business Analytics', icon: TrendingUp, level: 82 },
    { name: 'Prompt Engineering', icon: Brain, level: 92 },
    { name: 'Fast and Curious Learner', icon: Sparkles, level: 95 },
  ];

  const experienceItems = [
    {
      role: 'Founder',
      company: 'Zyntral AI',
      period: 'Oct 2024 - Present',
      description: 'Founded Zyntral AI to build next-generation AI solutions and drive innovation in artificial intelligence. Leading the vision, strategy, and execution of cutting-edge AI products.',
      achievements: [
        'Established AI-first company from the ground up',
        'Developed strategic roadmap for AI product suite',
        'Built high-performing team focused on AI innovation',
        'Created scalable architecture for AI-driven solutions'
      ],
      skillsGained: ['Entrepreneurship', 'Leadership', 'Strategic Planning', 'AI Product Development', 'Business Development'],
      icon: Zap,
      techStack: [
        { name: 'AI/ML', icon: Brain, level: 'Expert' },
        { name: 'Product Strategy', icon: Cpu, level: 'Expert' },
        { name: 'Cloud Architecture', icon: Server, level: 'Advanced' },
        { name: 'Team Leadership', icon: Users, level: 'Expert' }
      ]
    },
    {
      role: 'Data Scientist Intern',
      company: 'Prasunet',
      period: 'Mar 2025 - May 2025',
      description: 'Contributed to predictive analytics and data-driven solutions for business intelligence.',
      achievements: [
        'Built predictive models with 87% accuracy',
        'Created dashboards used by 50+ stakeholders',
        'Identified cost-saving opportunities worth $50K'
      ],
      skillsGained: ['Data Science', 'Data Visualization', 'Business Analytics'],
      icon: TrendingUp,
      techStack: [
        { name: 'Python', icon: Code, level: 'Advanced' },
        { name: 'Pandas', icon: Database, level: 'Expert' },
        { name: 'Tableau', icon: BarChart3, level: 'Intermediate' },
        { name: 'SQL', icon: Server, level: 'Advanced' }
      ]
    },
    {
      role: 'AI Engineer',
      company: 'Zeex AI',
      period: 'Sep 2025 - Present',
      description: 'Developing and deploying machine learning models, integrating AI systems, and optimizing end-to-end data pipelines.',
      achievements: [
        'Deployed 5+ ML models with 92% accuracy',
        'Reduced processing time by 40%',
        'Led a team of 3 junior engineers'
      ],
      skillsGained: ['AI & Machine Learning', 'Leadership', 'Backend Systems'],
      icon: Zap,
      techStack: [
        { name: 'Python', icon: Code, level: 'Expert' },
        { name: 'TensorFlow', icon: Brain, level: 'Advanced' },
        { name: 'Docker', icon: Server, level: 'Intermediate' },
        { name: 'Cloud', icon: Globe, level: 'Advanced' }
      ]
    }
  ];

  // Hobbies data
  const hobbies = [
    { name: 'Writing', icon: PenTool, level: 85 },
    { name: 'Travelling', icon: Plane, level: 80 },
    { name: 'Singing', icon: Mic, level: 95, achievement: '2nd Rank State Level (2012)' },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center justify-center py-16 md:py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)' }}
    >
      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              border: `1px solid rgba(192, 192, 192, 0.3)`,
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left Column - Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                ABOUT ME
              </h2>

              <motion.div
                className="backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-xl p-6 mb-6"
                whileHover={{
                  boxShadow: '0 0 30px rgba(192, 192, 192, 0.2)',
                }}
              >
                <p className="text-gray-300 text-base md:text-lg mb-4 leading-relaxed">
                  Hi, I'm Sujal Talreja — a passionate AI Engineer, Full-Stack Developer, and Entrepreneur dedicated to building intelligent, data-driven solutions that bridge technology and business impact.
                </p>

                <p className="text-gray-300 text-base md:text-lg mb-4 leading-relaxed">
                  I've completed my B.Sc. in Information Technology and am currently pursuing an M.Sc. in Artificial Intelligence & Machine Learning at Ganpat University. I'm also the Founder of Zyntral AI, building next-generation AI solutions and driving innovation in artificial intelligence.
                </p>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  I'm working as an AI Engineer at Zeex AI, where I focus on developing and deploying machine learning models, integrating AI systems, and optimizing end-to-end data pipelines.
                </p>
              </motion.div>
            </div>

            {/* Enhanced Experience Section with Timeline */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-200 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Workflow className="text-gray-400" />
                Experience Journey & Tech Evolution
              </h3>

              {/* Timeline Visualization */}
              <div className="relative pl-8 pb-4 before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-700">
                {experienceItems.map((exp, index) => {
                  const Icon = exp.icon;
                  return (
                    <motion.div
                      key={index}
                      className="relative mb-8 last:mb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Timeline Node */}
                      <div className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-gray-600 border-4 border-[#0a0a0a] flex items-center justify-center">
                        <Icon className="w-3 h-3 text-gray-300" />
                      </div>

                      <motion.div
                        className="backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-xl p-5"
                        whileHover={{
                          scale: isSmallScreen ? 1 : 1.02,
                          boxShadow: '0 0 25px rgba(192, 192, 192, 0.3)',
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex flex-wrap justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-200">{exp.role}</h4>
                          <span className="text-sm bg-[rgba(192,192,192,0.1)] px-2 py-1 rounded text-gray-400 whitespace-nowrap">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{exp.company}</p>
                        <p className="text-gray-300 text-sm mb-4">{exp.description}</p>

                        {/* Achievements */}
                        <div className="mb-4">
                          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Key Achievements
                          </h5>
                          <ul className="space-y-1">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="text-xs text-gray-300 flex items-start">
                                <span className="text-gray-500 mr-2">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tech Stack for this role */}
                        <div className="mb-4">
                          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Tech Stack
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {exp.techStack.map((tech, i) => {
                              const TechIcon = tech.icon;
                              return (
                                <motion.div
                                  key={i}
                                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.2)] text-gray-300"
                                  whileHover={{ scale: 1.05 }}
                                  title={`${tech.name} - ${tech.level}`}
                                >
                                  <TechIcon className="w-3 h-3" />
                                  <span className="text-xs">{tech.name}</span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Skills Gained */}
                        <div>
                          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Skills Enhanced
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {exp.skillsGained.map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-[rgba(192,192,192,0.1)] text-gray-300 border border-[rgba(192,192,192,0.2)]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Skills and Additional Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Skills Section */}
            <div className="mt-0">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-200 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Brain className="text-gray-400" />
                Core Skills
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {skills.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={index}
                      className="backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4"
                      whileHover={{
                        scale: isSmallScreen ? 1 : 1.02,
                        boxShadow: '0 0 25px rgba(192, 192, 192, 0.3)',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="text-gray-400" size={20} />
                        <span className="text-gray-200 font-medium">{skill.name}</span>
                        {skill.level >= 90 && (
                          <motion.span
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 text-yellow-400 ml-auto"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Expert
                          </motion.span>
                        )}
                      </div>
                      <div className="relative w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                        {/* Animated shimmer background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent"
                          animate={{ x: [-200, 200] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Main progress bar with dynamic gradient */}
                        <motion.div
                          className="relative h-2 rounded-full"
                          style={{
                            background: skill.level >= 90
                              ? 'linear-gradient(90deg, #6b7280, #9ca3af, #d1d5db)'
                              : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                          }}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{
                            duration: 1.5,
                            delay: 0.5 + index * 0.1,
                            ease: "easeOut"
                          }}
                          whileHover={{
                            boxShadow: skill.level >= 90
                              ? '0 0 15px rgba(209, 213, 219, 0.6)'
                              : '0 0 10px rgba(156, 163, 175, 0.4)',
                          }}
                        >
                          {/* Pulsing glow for high-level skills */}
                          {skill.level >= 90 && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              animate={{
                                boxShadow: [
                                  '0 0 5px rgba(209, 213, 219, 0.3)',
                                  '0 0 15px rgba(209, 213, 219, 0.6)',
                                  '0 0 5px rgba(209, 213, 219, 0.3)',
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      </div>
                      <div className="text-right text-xs text-gray-400 mt-1">{skill.level}%</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Hobbies Section */}
            <div className="mt-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-200 flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="text-gray-400" />
                Hobbies & Interests
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {hobbies.map((hobby, hobbyIndex) => {
                  const HobbyIcon = hobby.icon;

                  return (
                    <motion.div
                      key={hobbyIndex}
                      className="backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4"
                      whileHover={{
                        scale: isSmallScreen ? 1 : 1.02,
                        boxShadow: '0 0 25px rgba(192, 192, 192, 0.3)',
                      }}
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <HobbyIcon className="text-gray-400" size={20} />
                        <span className="text-gray-200 font-medium">{hobby.name}</span>
                        {hobby.level >= 85 && (
                          <motion.span
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-400 ml-auto"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Passionate
                          </motion.span>
                        )}
                      </div>
                      <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-gray-500 to-gray-300 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${hobby.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: 0.5 + hobbyIndex * 0.1 }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-right text-xs text-gray-400">{hobby.level}%</div>
                        {(hobby as any).achievement && (
                          <motion.div
                            className="flex items-center gap-1 text-[10px] text-yellow-400"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ delay: 1 + hobbyIndex * 0.1 }}
                          >
                            <Award className="w-3 h-3" />
                            <span>{(hobby as any).achievement}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};