import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, X } from 'lucide-react';

export const VoiceCommandHelper = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show helper after 30 seconds if user hasn't used voice commands
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const hideHelper = () => {
    setIsVisible(false);
  };

  const voiceCommands = [
    "Show me your projects",
    "Tell me about your skills",
    "Take me to achievements",
    "Show hackathons",
    "AI projects",
    "About section",
    "Contact information"
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="backdrop-blur-md bg-[rgba(26,26,26,0.9)] border border-[rgba(192,192,192,0.3)] rounded-xl p-4 max-w-xs">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-gray-200 flex items-center">
            <Mic className="w-4 h-4 mr-2 text-blue-400" />
            Voice Commands Available
          </h3>
          <button 
            onClick={hideHelper}
            className="text-gray-500 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mb-3">
          Click the microphone in the navigation bar and try commands like:
        </p>
        
        <ul className="space-y-2">
          {voiceCommands.map((command, index) => (
            <li key={index} className="text-xs text-gray-300 flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              "{command}"
            </li>
          ))}
        </ul>
        
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Works best in Chrome, Edge, and Safari
          </p>
        </div>
      </div>
    </motion.div>
  );
};