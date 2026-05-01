import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Mic, MicOff } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

const navLinks = [
  { name: 'HOME', href: '#hero' },
  { name: 'ABOUT', href: '#about' },
  { name: 'STORY', href: '#story' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'ONGOING', href: '#ongoing-projects' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'ACHIEVEMENTS', href: '#achievements' },
  { name: 'ROADMAP', href: '#planning' },
  { name: 'BLOG', href: '#blogs' },
  { name: 'CONTACT', href: '#contact' },

];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const scrollProgress = useScrollProgress();
  const navRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Use Framer Motion for enhanced scroll effects
  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(26, 26, 26, 0.7)', 'rgba(26, 26, 26, 0.95)']
  );
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(192, 192, 192, 0.2)', 'rgba(192, 192, 192, 0.4)']
  );

  // Initialize speech recognition
  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(transcript);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    // Define command mappings
    const commandMap: Record<string, string> = {
      'home': '#hero',
      'about': '#about',
      'story': '#story',
      'projects': '#projects',
      'ongoing': '#ongoing-projects',
      'ongoing projects': '#ongoing-projects',
      'infrasentinel': '#ongoing-projects',
      'research': '#ongoing-projects',
      'skills': '#skills',
      'achievements': '#achievements',
      'certifications': '#achievements',
      'planning': '#planning',
      'roadmap': '#planning',
      'kanban': '#planning',
      'current projects': '#planning',
      'blog': '#blogs',
      'blogs': '#blogs',
      'articles': '#blogs',
      'medium': '#blogs',
      'contact': '#contact',
      'hackathons': '#achievements',
      'ai projects': '#projects',
      'machine learning': '#projects',
      'full stack': '#projects',
      'experience': '#about',
      'journey': '#story',
      'background': '#about',
    };

    // Try to find a matching command
    let targetSection = '';

    for (const [key, value] of Object.entries(commandMap)) {
      if (command.includes(key)) {
        targetSection = value;
        break;
      }
    }

    // If no specific command matched, try to find section names
    if (!targetSection) {
      const sectionNames = navLinks.map(link => link.href.substring(1));
      for (const section of sectionNames) {
        if (command.includes(section)) {
          targetSection = `#${section}`;
          break;
        }
      }
    }

    // Scroll to the target section if found
    if (targetSection) {
      scrollToSection(targetSection);
    }
  };

  const toggleVoiceRecognition = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      // Use Framer Motion enhanced scroll
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 z-50"
        style={{ scaleX: scrollProgress / 100, transformOrigin: 'left' }}
      />

      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-2 sm:top-4 left-0 right-0 z-40 flex justify-center"
      >
        <motion.div
          className="backdrop-blur-md border rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 w-[95%] sm:w-[96%] max-w-6xl"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backgroundColor: navBackground,
            borderColor: navBorder
          }}
        >
          <div className="flex justify-between items-center">
            <motion.div
              className="text-base md:text-lg xl:text-2xl font-bold bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent flex-shrink-0"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              whileHover={{ scale: 1.05 }}
            >
              SUJAL.T
            </motion.div>

            <div className="hidden xl:flex items-center gap-3">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative text-xs font-semibold transition-colors px-2.5 py-1 whitespace-nowrap ${activeSection === link.href.substring(1)
                    ? 'text-gray-300'
                    : 'text-gray-500 hover:text-gray-300'
                    }`}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600"
                      style={{ boxShadow: '0 0 10px rgba(192, 192, 192, 0.5)' }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Voice Control Button - desktop only */}
            {speechSupported && (
              <motion.button
                className={`hidden xl:flex items-center justify-center ml-2 w-8 h-8 rounded-full flex-shrink-0 ${isListening
                  ? 'bg-red-500/20 border border-red-500/50'
                  : 'bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.2)]'
                  }`}
                onClick={toggleVoiceRecognition}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isListening ? "Listening... Say a command like 'Show me projects'" : "Voice Control"}
              >
                {isListening ? <MicOff size={16} className="text-red-400" /> : <Mic size={16} className="text-gray-400" />}
              </motion.button>
            )}

            {/* Hamburger — hidden on xl+ where full nav is visible */}
            <motion.button
              className="xl:hidden text-gray-300 ml-2"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-30 xl:hidden"

        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={() => setIsOpen(false)} />
          <motion.div className="absolute right-0 top-0 h-full w-64 sm:w-72 bg-[#1a1a1a] border-l border-gray-700 p-6 sm:p-8">
            <div className="flex flex-col space-y-5 sm:space-y-6 mt-16 sm:mt-20">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left text-lg font-semibold text-gray-300 hover:text-white transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {link.name}
                </motion.button>
              ))}

              {/* Mobile Voice Control Button */}
              {speechSupported && (
                <motion.button
                  className={`flex items-center justify-center mt-4 w-full py-3 rounded-lg ${isListening
                    ? 'bg-red-500/20 border border-red-500/50'
                    : 'bg-[rgba(192,192,192,0.1)] border border-[rgba(192,192,192,0.2)]'
                    }`}
                  onClick={toggleVoiceRecognition}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center">
                    {isListening ? <MicOff size={20} className="text-red-400 mr-2" /> : <Mic size={20} className="text-gray-400 mr-2" />}
                    <span className="text-gray-300">
                      {isListening ? "Listening..." : "Voice Control"}
                    </span>
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};