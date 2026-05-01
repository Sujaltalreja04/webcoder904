import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { RotatingLogo } from '../3d/RotatingLogo';
import { ChevronDown, Mic, MicOff } from 'lucide-react';

export const HeroSection = () => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

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
      'skills': '#skills',
      'achievements': '#achievements',
      'certifications': '#achievements',
      'contact': '#contact',
      'hackathons': '#achievements',
      'ai projects': '#projects',
      'machine learning': '#projects',
      'full stack': '#projects',
      'experience': '#about',
      'journey': '#story',
      'background': '#about',
      'download resume': 'download-resume',
    };

    // Try to find a matching command
    let targetAction = '';

    for (const [key, value] of Object.entries(commandMap)) {
      if (command.includes(key)) {
        targetAction = value;
        break;
      }
    }

    // If no specific command matched, try to find section names
    if (!targetAction) {
      const sectionNames = ['hero', 'about', 'story', 'projects', 'skills', 'achievements', 'contact'];
      for (const section of sectionNames) {
        if (command.includes(section)) {
          targetAction = `#${section}`;
          break;
        }
      }
    }

    // Execute the target action
    if (targetAction) {
      if (targetAction === 'download-resume') {
        // Handle resume download
        const link = document.createElement('a');
        link.href = 'https://drive.google.com/uc?export=download&id=1vLYprjUtDPkr64ynt7bl3xSL2k0r-wEg';
        link.download = 'Sujal_Talreja_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Scroll to the target section
        const element = document.querySelector(targetAction);
        if (element) {
          const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
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

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <RotatingLogo />
        </Canvas>
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Profile photo added here */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-gray-400"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-gray-500"
                animate={{
                  scale: [1.1, 1.3, 1.1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <img
                src="/profile.jpg"
                alt="Sujal Talreja"
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300 shadow-2xl z-10"
              />
            </div>
          </div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-3 md:mb-4 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SUJAL
          </motion.h1>

          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-400 mb-4 md:mb-6 leading-tight"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            KISHORE KUMAR TALREJA
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Crafting digital experiences where innovation meets elegance
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  const targetPosition = projectsSection.getBoundingClientRect().top + window.pageYOffset;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 font-semibold transition-all text-sm sm:text-base"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(192, 192, 192, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW WORK
            </motion.button>

            <motion.button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset;
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 font-semibold transition-all text-sm sm:text-base"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(192, 192, 192, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              CONTACT ME
            </motion.button>

            <motion.button
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://drive.google.com/uc?export=download&id=1vLYprjUtDPkr64ynt7bl3xSL2k0r-wEg';
                link.download = 'Sujal_Talreja_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 font-semibold transition-all text-sm sm:text-base"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(192, 192, 192, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              DOWNLOAD RESUME
            </motion.button>

            {/* Voice Control Button */}
            {speechSupported && (
              <motion.button
                onClick={toggleVoiceRecognition}
                className={`px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md border rounded-xl font-semibold transition-all text-sm sm:text-base flex items-center justify-center gap-2 ${isListening
                  ? 'bg-red-500/20 border-red-500/50 text-red-300'
                  : 'bg-[rgba(26,26,26,0.7)] border-[rgba(192,192,192,0.3)] text-gray-300'
                  }`}
                style={{ fontFamily: 'Orbitron, sans-serif' }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(192, 192, 192, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                <span>VOICE MODE</span>
              </motion.button>
            )}

            {/* PWA Install Button */}
            <motion.button
              onClick={async () => {
                if (deferredPrompt) {
                  // Show the install prompt
                  deferredPrompt.prompt();
                  // Wait for the user to respond to the prompt
                  await deferredPrompt.userChoice;
                  // We've used the prompt, and can't use it again, throw it away
                  setDeferredPrompt(null);
                } else {
                  // Fallback: Show instructions for manual installation
                  alert('To install this app, use the browser menu:\n\n1. Open browser menu (⋮ or ⋯)\n2. Look for "Install App" or "Add to Home Screen"\n3. Follow the prompts to install');
                }
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.3)] rounded-xl text-gray-300 font-semibold transition-all text-sm sm:text-base flex items-center justify-center gap-2"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(192, 192, 192, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m8 11 4 4 4-4" />
                <path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
              <span>INSTALL APP</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={scrollToNext}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-gray-400"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.2 }}
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.button>
      </div>
    </section>
  );
};