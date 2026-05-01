import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { Code, Cpu, Brain, Users, Zap, Award, ChevronRight } from 'lucide-react';

export const StorySection = () => {
  const [ref, isInView] = useInView();
  const [currentStep, setCurrentStep] = useState(0);

  const storySteps = [
    {
      id: 0,
      title: "The Beginning",
      subtitle: "My First Lines of Code",
      content: "My journey into technology began when I wrote my first lines of code. What started as curiosity quickly turned into passion as I discovered the power of creating something from nothing.",
      icon: Code,
      choices: [
        { text: "Explore my early projects", nextStep: 1 },
        { text: "Learn about my education", nextStep: 2 }
      ],
      image: "https://i.ibb.co/r27s32Hg/1760248288377-3.png"
    },
    {
      id: 1,
      title: "Full-Stack Foundations",
      subtitle: "Building My First Applications",
      content: "I dove deep into full-stack development, mastering both frontend and backend technologies. I built several web applications that helped me understand the complete development lifecycle.",
      icon: Code,
      choices: [
        { text: "See my early projects", nextStep: 3 },
        { text: "Discover my interest in AI", nextStep: 4 }
      ],
      image: "https://i.ibb.co/PGbNfkCH/Screenshot-2025-11-02-150357.png"
    },
    {
      id: 2,
      title: "Educational Journey",
      subtitle: "B.Sc. in Information Technology",
      content: "I completed my Bachelor's degree in Information Technology, which provided me with a solid foundation in computer science principles and introduced me to various domains of technology.",
      icon: Award,
      choices: [
        { text: "See how I applied my learning", nextStep: 1 },
        { text: "Jump to my AI exploration", nextStep: 4 }
      ],
      image: "https://i.ibb.co/r27s32Hg/1760248288377-3.png"
    },
    {
      id: 3,
      title: "Early Projects",
      subtitle: "Freelance Developer Experience",
      content: "As a freelance developer, I worked on 12+ projects, gaining experience in Python development, data analysis, and full-stack applications. This period taught me client management and project delivery.",
      icon: Users,
      choices: [
        { text: "Discover what sparked my AI interest", nextStep: 4 },
        { text: "Learn about my achievements", nextStep: 5 }
      ],
      image: "https://i.ibb.co/PGbNfkCH/Screenshot-2025-11-02-150357.png"
    },
    {
      id: 4,
      title: "The AI Awakening",
      subtitle: "Falling in Love with Artificial Intelligence",
      content: "While working on data analysis projects, I became fascinated with machine learning and AI. The ability to create systems that could learn and make decisions captivated me.",
      icon: Brain,
      choices: [
        { text: "See my first AI project - Cybreon", nextStep: 6 },
        { text: "Learn about my decision to pursue MS", nextStep: 7 }
      ],
      image: "https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/refs/heads/main/Cybreon.png"
    },
    {
      id: 5,
      title: "Early Recognition",
      subtitle: "Hackathons and Achievements",
      content: "My work started gaining recognition. I secured 2nd rank in a university blog competition on deepfake detection and placed in the top 15 at Krmu 4.0 Hackathon.",
      icon: Award,
      choices: [
        { text: "See my breakthrough AI project", nextStep: 6 },
        { text: "Continue to my academic decision", nextStep: 7 }
      ],
      image: "https://i.ibb.co/r27s32Hg/1760248288377-3.png"
    },
    {
      id: 6,
      title: "Cybreon - My Breakthrough",
      subtitle: "AI-Powered Robotic Brain Software",
      content: "Cybreon was my first major AI project - an AI-powered robotic brain software. This project solidified my passion for AI and demonstrated my ability to create complex intelligent systems.",
      icon: Zap,
      choices: [
        { text: "Learn about my MS decision", nextStep: 7 },
        { text: "See other AI projects", nextStep: 8 }
      ],
      image: "https://raw.githubusercontent.com/Sujaltalreja04/Sujaltalreja04/refs/heads/main/Cybreon.png"
    },
    {
      id: 7,
      title: "The Decision",
      subtitle: "Pursuing M.Sc. in AI & ML",
      content: "After my success with Cybreon and other AI projects, I decided to formalize my education by pursuing a Master's degree in Artificial Intelligence & Machine Learning at Ganpat University.",
      icon: Cpu,
      choices: [
        { text: "See my current work", nextStep: 8 },
        { text: "Explore my latest projects", nextStep: 9 }
      ],
      image: "https://i.ibb.co/r27s32Hg/1760248288377-3.png"
    },
    {
      id: 8,
      title: "Current Journey",
      subtitle: "AI Engineer at Zeex AI",
      content: "Today, I work as an AI Engineer at Zeex AI, developing and deploying machine learning models. I've deployed 5+ ML models with 92% accuracy and reduced processing time by 40%.",
      icon: Brain,
      choices: [
        { text: "See my latest achievements", nextStep: 9 },
        { text: "Restart my journey", nextStep: 0 }
      ],
      image: "https://i.ibb.co/r27s32Hg/1760248288377-3.png"
    },
    {
      id: 9,
      title: "Recent Success",
      subtitle: "Hackathons and Recognition",
      content: "My journey continues with success in hackathons - ranking in the top 5 at the 24-hour Odoo Hackathon 2025 with QuickCourt, an AI-based sports booking platform.",
      icon: Award,
      choices: [
        { text: "Restart my journey", nextStep: 0 },
        { text: "Connect with me", nextStep: 10 }
      ],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 10,
      title: "Let's Connect",
      subtitle: "Ready to Build Something Amazing?",
      content: "My journey from my first line of code to becoming an AI Engineer has been incredible. I'm always excited to connect with like-minded individuals and explore new opportunities.",
      icon: Users,
      choices: [
        { text: "View my projects", action: "scrollToProjects" },
        { text: "Contact me", action: "scrollToContact" },
        { text: "Restart my journey", nextStep: 0 }
      ],
      image: "https://i.ibb.co/r27s32Hg/1760248288377-3.png"
    }
  ];

  const currentStory = storySteps[currentStep];

  const handleChoice = (choice: any) => {
    if (choice.action === "scrollToProjects") {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const targetPosition = projectsSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    } else if (choice.action === "scrollToContact") {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    } else if (choice.nextStep !== undefined) {
      setCurrentStep(choice.nextStep);
    }
  };

  const IconComponent = currentStory.icon;

  return (
    <section
      id="story"
      ref={ref}
      className="min-h-screen flex items-center justify-center py-16 md:py-20 relative"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)' }}
    >
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
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            MY JOURNEY
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the story of how I evolved from a curious beginner to an AI Engineer
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-2xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="md:w-2/5 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl border-2 border-cyan-400 opacity-50 animate-pulse"></div>
                  <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-xl overflow-hidden border-2 border-gray-700">
                    {currentStory.image ? (
                      <img
                        src={currentStory.image}
                        alt={currentStory.title}
                        className="w-full h-full object-contain bg-gray-900"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <IconComponent className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:w-3/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-200">{currentStory.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base">{currentStory.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
                  {currentStory.content}
                </p>

                <div className="space-y-3">
                  {currentStory.choices.map((choice, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left backdrop-blur-md bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.2)] rounded-lg px-4 py-3 text-gray-300 hover:bg-[rgba(192,192,192,0.2)] transition-all flex items-center justify-between group"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 20px rgba(192, 192, 192, 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{choice.text}</span>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Story Progress: {currentStep + 1} of {storySteps.length}
                </div>
                <div className="flex gap-1">
                  {storySteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === currentStep
                        ? 'bg-gray-300'
                        : index < currentStep
                          ? 'bg-gray-600'
                          : 'bg-gray-800'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
