import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import {
  Code,
  Layers,
  Cpu,
  Wind,
  Database,
  Grid,
  Box,
  GitBranch,
} from 'lucide-react';

const skills = [
  { name: 'Full Stack Development', level: 100, icon: Code, color: '#808080' },
  { name: 'Business Analytics', level: 90, icon: Layers, color: '#909090' },
  { name: 'Story Telling', level: 88, icon: Cpu, color: '#a0a0a0' },
  { name: 'Leadership', level: 92, icon: Wind, color: '#888888' },
  { name: 'Data Science', level: 60, icon: Database, color: '#989898' },
  { name: 'Prompt Engineering', level: 87, icon: Grid, color: '#787878' },
  { name: 'English Communication', level: 100, icon: Box, color: '#b0b0b0' },
  { name: 'Entrepreneurship', level: 90, icon: GitBranch, color: '#888888' },
];


export const SkillsSection = () => {
  const [ref, isInView] = useInView();
  const [isFlipped, setIsFlipped] = useState(false);

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen flex items-center justify-center py-16 md:py-20 relative"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)' }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-16 text-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
        >
          TECHNICAL SKILLS
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Sujal.K.T Logo - Premium 3D Flippable Badge */}
          <div className="flex justify-center lg:justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96" style={{ perspective: '2000px' }}>
              {/* Outer rotating rings with enhanced glow */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2"
                  style={{
                    borderColor: `rgba(${192 - i * 25}, ${192 - i * 15}, ${220 - i * 35}, ${0.5 + i * 0.15})`,
                    inset: `${i * 28}px`,
                    boxShadow: `
                      0 0 ${18 + i * 10}px rgba(${192 - i * 25}, ${192 - i * 15}, ${220 - i * 35}, 0.6),
                      inset 0 0 ${12 + i * 6}px rgba(${192 - i * 25}, ${192 - i * 15}, ${220 - i * 35}, 0.3)
                    `,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 25 - i * 6,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    scale: {
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  }}
                />
              ))}

              {/* Enhanced particle effects with trails */}
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-5 h-5 rounded-full"
                  style={{
                    top: `${50 + Math.sin(i * 22.5 * Math.PI / 180) * 42}%`,
                    left: `${50 + Math.cos(i * 22.5 * Math.PI / 180) * 42}%`,
                    background: `radial-gradient(circle, rgba(192, 192, 192, 1) 0%, rgba(192, 192, 192, 0.3) 100%)`,
                    boxShadow: '0 0 18px rgba(192, 192, 192, 0.8)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.9, 1.8, 0.9],
                  }}
                  transition={{
                    duration: 3 + (i % 4),
                    repeat: Infinity,
                    delay: i * 0.12,
                  }}
                />
              ))}

              {/* Flippable 3D Badge Container */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{
                  duration: 0.9,
                  type: 'spring',
                  stiffness: 80,
                  damping: 15,
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                whileHover={{
                  scale: 1.08,
                }}
              >
                {/* FRONT SIDE - Sujal.K.T Badge */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Outer metallic ring */}
                  <div
                    className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #5a6c7d 0%, #3d4f5e 50%, #2a3a47 100%)',
                      boxShadow: `
                        0 30px 100px rgba(0, 0, 0, 0.95),
                        0 20px 50px rgba(0, 0, 0, 0.8),
                        inset 0 4px 8px rgba(255, 255, 255, 0.2),
                        inset 0 -4px 8px rgba(0, 0, 0, 0.7)
                      `,
                      transform: 'translateZ(20px)',
                    }}
                  />

                  {/* Middle depth layer */}
                  <div
                    className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #3d4f5e 0%, #2a3a47 100%)',
                      boxShadow: `
                        0 18px 50px rgba(0, 0, 0, 0.8),
                        inset 0 4px 12px rgba(255, 255, 255, 0.1)
                      `,
                      transform: 'translateZ(25px)',
                    }}
                  />

                  {/* Main badge surface */}
                  <div
                    className="w-52 h-52 sm:w-64 sm:h-64 rounded-full flex items-center justify-center relative"
                    style={{
                      background: `
                        radial-gradient(circle at 38% 38%, #5a6c7d 0%, #3d4f5e 35%, #2a3a47 100%)
                      `,
                      boxShadow: `
                        0 25px 60px rgba(0, 0, 0, 0.9),
                        0 10px 25px rgba(0, 0, 0, 0.7),
                        inset 0 5px 10px rgba(255, 255, 255, 0.25),
                        inset 0 -5px 10px rgba(0, 0, 0, 0.8),
                        0 0 50px rgba(192, 192, 192, 0.5)
                      `,
                      border: '5px solid rgba(192, 192, 192, 0.6)',
                      transform: 'translateZ(30px)',
                    }}
                  >
                    {/* Rotating light reflection */}
                    <motion.div
                      className="absolute inset-0 rounded-full overflow-hidden"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <div
                        className="absolute w-full h-1/2"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)',
                          top: '0',
                          left: '0',
                        }}
                      />
                    </motion.div>

                    {/* Inner glow effect */}
                    <div
                      className="absolute inset-5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 48% 48%, rgba(192,192,192,0.5) 0%, rgba(192,192,192,0.1) 50%, transparent 100%)',
                      }}
                    />

                    {/* Glassmorphism overlay */}
                    <div
                      className="absolute inset-8 rounded-full backdrop-blur-sm"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />

                    {/* 3D Embossed Text - Sujal.K.T */}
                    <span
                      className="text-3xl sm:text-4xl font-bold z-10 relative"
                      style={{
                        fontFamily: 'Orbitron, sans-serif',
                        color: '#000000',
                        letterSpacing: '0.05em',
                        filter: 'drop-shadow(0 5px 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 35px rgba(255, 255, 255, 0.7))',
                        textShadow: `
                          0 4px 0 rgba(255, 255, 255, 0.7),
                          0 -2px 0 rgba(0, 0, 0, 0.4),
                          3px 0 0 rgba(255, 255, 255, 0.5),
                          -3px 0 0 rgba(0, 0, 0, 0.3),
                          0 0 25px rgba(255, 255, 255, 0.6)
                        `,
                        transform: 'translateZ(35px)',
                      }}
                    >
                      Sujal.K.T
                    </span>

                    {/* Animated highlight */}
                    <motion.div
                      className="absolute top-6 left-1/4 w-14 h-14 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.4, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </div>
                </div>

                {/* BACK SIDE - Profile Photo */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Outer metallic ring */}
                  <div
                    className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #5a6c7d 0%, #3d4f5e 50%, #2a3a47 100%)',
                      boxShadow: `
                        0 30px 100px rgba(0, 0, 0, 0.95),
                        0 20px 50px rgba(0, 0, 0, 0.8),
                        inset 0 4px 8px rgba(255, 255, 255, 0.2),
                        inset 0 -4px 8px rgba(0, 0, 0, 0.7)
                      `,
                      transform: 'translateZ(20px)',
                    }}
                  />

                  {/* Middle depth layer */}
                  <div
                    className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #3d4f5e 0%, #2a3a47 100%)',
                      boxShadow: `
                        0 18px 50px rgba(0, 0, 0, 0.8),
                        inset 0 4px 12px rgba(255, 255, 255, 0.1)
                      `,
                      transform: 'translateZ(25px)',
                    }}
                  />

                  {/* Photo frame */}
                  <div
                    className="w-52 h-52 sm:w-64 sm:h-64 rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `
                        radial-gradient(circle at 38% 38%, #5a6c7d 0%, #3d4f5e 35%, #2a3a47 100%)
                      `,
                      boxShadow: `
                        0 25px 60px rgba(0, 0, 0, 0.9),
                        0 10px 25px rgba(0, 0, 0, 0.7),
                        inset 0 5px 10px rgba(255, 255, 255, 0.25),
                        inset 0 -5px 10px rgba(0, 0, 0, 0.8),
                        0 0 50px rgba(192, 192, 192, 0.5)
                      `,
                      border: '5px solid rgba(192, 192, 192, 0.6)',
                      transform: 'translateZ(30px)',
                    }}
                  >
                    {/* Profile Image */}
                    <div className="absolute inset-4 rounded-full overflow-hidden">
                      <img
                        src="https://github.com/Sujaltalreja04/Sujaltalreja04/blob/main/1765193026732.png?raw=true"
                        alt="Sujal Kishore Talreja"
                        className="w-full h-full object-cover"
                        style={{
                          filter: 'brightness(1.15) contrast(1.08) saturate(1.1)',
                        }}
                      />
                      {/* Subtle overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'radial-gradient(circle at 45% 45%, transparent 0%, rgba(0,0,0,0.15) 100%)',
                        }}
                      />
                    </div>

                    {/* Glassmorphism border */}
                    <div
                      className="absolute inset-4 rounded-full pointer-events-none"
                      style={{
                        border: '3px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: 'inset 0 0 25px rgba(255, 255, 255, 0.15)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
          >
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-lg md:rounded-xl p-4 md:p-6"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(192, 192, 192, 0.3)',
                  }}
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${skill.color} 0%, #606060 100%)`,
                      }}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3
                      className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {skill.name}
                    </h3>
                  </div>

                  <div className="relative h-2 md:h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color} 0%, #a0a0a0 100%)`,
                      }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Proficiency</span>
                    <motion.span
                      className="text-xs font-bold text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};