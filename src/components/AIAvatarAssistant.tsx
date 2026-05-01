import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, AlertTriangle } from 'lucide-react';
import { useMutation, useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ConstellationNavigator } from './ConstellationNavigator';

// Safe hook: returns a no-op mutation if Convex is not available
function useSafeMutation(mutationFn: Parameters<typeof useMutation>[0]) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation(mutationFn);
  } catch {
    return async (..._args: unknown[]) => undefined;
  }
}

// Safe hook: returns null if Convex client is not available
function useSafeConvex() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useConvex();
  } catch {
    return null;
  }
}

// Rate limiting configuration
const MAX_REQUESTS_PER_HOUR = 10; // Limit to prevent API bill explosion
const RATE_LIMIT_KEY = 'chatbot_rate_limit';

interface RateLimitData {
  count: number;
  resetTime: number;
}

// Suggested questions for users
const SUGGESTED_QUESTIONS = [
  "What are Sujal's main AI projects?",
  "Tell me about InfraSentinel",
  "What skills does Sujal have?",
  "Show me Sujal's achievements",
  "How can I contact Sujal?",
  "What is Evolvex AI?",
];

const AIAvatarAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConstellationOpen, setIsConstellationOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showConstellationHint, setShowConstellationHint] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m Eranix AI, your guide to Sujal\'s portfolio. Ask me anything about his projects, skills, or achievements!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(MAX_REQUESTS_PER_HOUR);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const convexClient = useSafeConvex();
  const isConvexAvailable = !!convexClient;
  // These hooks are always called, but mutations become no-ops if Convex isn't configured
  const createSession = useSafeMutation(api.chatHistory.createSession);
  const logMessageMutation = useSafeMutation(api.chatHistory.logMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Check and update rate limit
  useEffect(() => {
    updateRateLimit();
    // Initialize Convex session only if available
    const setupSession = async () => {
      const id = crypto.randomUUID();
      setSessionId(id);
      if (!isConvexAvailable) return;
      try {
        await createSession({
          sessionId: id,
          userAgent: navigator.userAgent,
          referer: document.referrer || '',
        });
      } catch (err) {
        console.error('Convex session init failed:', err);
      }
    };
    setupSession();
  }, []);

  const updateRateLimit = () => {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);

    if (stored) {
      const data: RateLimitData = JSON.parse(stored);

      // Reset if hour has passed
      if (now >= data.resetTime) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
          count: 0,
          resetTime: now + 3600000 // 1 hour from now
        }));
        setRemainingRequests(MAX_REQUESTS_PER_HOUR);
        setRateLimitReached(false);
      } else {
        const remaining = MAX_REQUESTS_PER_HOUR - data.count;
        setRemainingRequests(remaining);
        setRateLimitReached(remaining <= 0);
      }
    } else {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
        count: 0,
        resetTime: now + 3600000
      }));
    }
  };

  const incrementRateLimit = (): boolean => {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return false;

    const data: RateLimitData = JSON.parse(stored);
    if (data.count >= MAX_REQUESTS_PER_HOUR) {
      setRateLimitReached(true);
      return false;
    }

    data.count++;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    setRemainingRequests(MAX_REQUESTS_PER_HOUR - data.count);

    if (data.count >= MAX_REQUESTS_PER_HOUR) {
      setRateLimitReached(true);
    }

    return true;
  };

  // Simulate streaming effect for AI responses
  const simulateStreaming = async (text: string) => {
    setIsTyping(true);
    setStreamingMessage('');

    const words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setStreamingMessage(currentText);

      // Random delay between 30-80ms for realistic typing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
    }

    setIsTyping(false);
    return currentText;
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    // Check rate limit
    if (rateLimitReached) {
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ You\'ve reached the hourly limit (10 requests). Please try again later to prevent excessive API costs.'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    if (!incrementRateLimit()) {
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Rate limit reached. Please wait before sending more messages.'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = { role: 'user', content: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Log user message to Convex
    if (sessionId && isConvexAvailable) {
      logMessageMutation({ sessionId, role: 'user', content: textToSend });
    }

    // Mark question as used
    if (messageText) {
      setUsedQuestions(prev => [...prev, messageText]);
    }

    try {
      // Create enhanced context about the portfolio with strict boundaries
      const portfolioContext = `You are Eranix AI, an intelligent assistant for Sujal Talreja's portfolio website.

CRITICAL RULES:
1. ONLY answer questions about Sujal Talreja, his projects, skills, achievements, and career
2. Keep responses SHORT and CONCISE (2-3 sentences maximum)
3. If asked ANYTHING outside the portfolio scope, politely redirect: "I can only answer questions about Sujal's portfolio. Ask me about his projects, skills, or achievements!"
4. DO NOT answer: general knowledge, coding help, other people, current events, math, science, or any non-portfolio topics
5. Be friendly but brief

Portfolio Information:
- AI & LLM Engineer at Zeex AI
- Skills: Python, AI/ML, Deep Learning, Computer Vision, NLP, React, TypeScript, Next.js, Three.js, Node.js, MongoDB, PostgreSQL, AWS

ACTIVE PROJECTS:
- InfraSentinel: AI Infrastructure monitoring (YOLOv10, PyTorch, OpenCV, FastAPI, Next.js)
- Evolvex AI: Career suggestion platform (Streamlit, Llama, Gemini, XGBoost)

COMPLETED PROJECTS:
- Deepfake Detection System (TensorFlow, EfficientNet)
- QuickCourt: Sports booking platform (React, Firebase, Llama)
- Cybreon: AI robotics software
- Weblancer Tech: Freelance platform (React, Next.js, Three.js)

ACHIEVEMENTS:
- Top 5 in Odoo Hackathon 2025
- Top 15 at Hack KRMU 4.0
- AI+ Prompt Engineer Level 1™ certified
- Google Analytics & PowerBI certified

Contact: LinkedIn, GitHub (check portfolio)

Keep answers brief and portfolio-focused!`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: portfolioContext },
            ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
          ],
          temperature: 0.5, // Lower temperature for more focused responses
          max_tokens: 150, // Reduced from 512 for shorter responses
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Log AI response to Convex (before streaming finishes visuals)
      if (sessionId && isConvexAvailable) {
        logMessageMutation({ sessionId, role: 'assistant', content: aiResponse });
      }

      // Simulate streaming
      const streamedText = await simulateStreaming(aiResponse);

      const aiMessage = { role: 'assistant', content: streamedText };
      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get available suggestions (not used yet)
  const availableSuggestions = SUGGESTED_QUESTIONS.filter(q => !usedQuestions.includes(q)).slice(0, 3);

  // Long press handler for constellation navigator
  const handleAvatarPressStart = () => {
    // Show hint after 1 second
    const hintTimer = setTimeout(() => {
      setShowConstellationHint(true);
    }, 1000);

    // Open constellation after 3 seconds
    const timer = setTimeout(() => {
      setIsConstellationOpen(true);
      setShowConstellationHint(false);
      clearTimeout(hintTimer);
    }, 3000);
    
    setLongPressTimer(timer);
  };

  const handleAvatarPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setShowConstellationHint(false);
  };

  // Keyboard shortcut for constellation (Ctrl + Shift + C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsConstellationOpen(true);
      }
      
      // Close with Escape
      if (isConstellationOpen && e.key === 'Escape') {
        setIsConstellationOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConstellationOpen]);

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/20 backdrop-blur-md shadow-2xl shadow-white/5 z-50 flex items-center justify-center cursor-pointer group"
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.15)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        onMouseDown={handleAvatarPressStart}
        onMouseUp={handleAvatarPressEnd}
        onMouseLeave={handleAvatarPressEnd}
        onTouchStart={handleAvatarPressStart}
        onTouchEnd={handleAvatarPressEnd}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500/10 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Sparkles size={24} className="text-gray-300 relative z-10 group-hover:text-white transition-colors" />

        {/* Subtle Online Dot - Silver/White */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300 border border-black"></span>
        </span>
        
        {/* Constellation hint tooltip */}
        <AnimatePresence>
          {showConstellationHint && (
            <motion.div
              initial={{ opacity: 0, x: -20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: -10 }}
              exit={{ opacity: 0, x: -20, y: -10 }}
              className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 border border-cyan-500/50 rounded-lg text-xs text-cyan-400 whitespace-nowrap z-50"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              🌌 Keep holding for secret...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-10rem)] rounded-2xl bg-[#0F0F0F]/95 border border-white/10 backdrop-blur-xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          >
            {/* Header - Monochrome Premium */}
            <div className="bg-gradient-to-r from-gray-900 to-[#121212] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-inner">
                  <Sparkles size={18} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide font-sans">
                    Eranix AI
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span className="text-[10px] text-gray-300">Portfolio Assistant</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                aria-label="Close chatbot"
              >
                <X size={18} />
              </button>
            </div>

            {/* Warning Banner */}
            {remainingRequests <= 3 && remainingRequests > 0 && (
              <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-gray-400" />
                <p className="text-xs text-gray-300">
                  {remainingRequests} requests remaining
                </p>
              </div>
            )}

            {/* Messages Area - Black & Silver */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[85%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.role === 'user'
                        ? 'bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 text-gray-100 rounded-tr-sm'
                        : 'bg-[#1A1A1A] border border-white/5 text-gray-300 rounded-tl-sm'
                        }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator - Silver Wave */}
              {(isTyping || isLoading) && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 min-w-[60px]">
                    {isTyping && streamingMessage ? (
                      <div className="text-sm text-gray-400">
                        {streamingMessage}
                        <span className="inline-block w-1.5 h-4 bg-gray-500 ml-1 animate-pulse align-middle" />
                      </div>
                    ) : (
                      <div className="flex gap-1 h-5 items-center">
                        <motion.div className="w-1.5 h-1.5 bg-gray-500 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} />
                        <motion.div className="w-1.5 h-1.5 bg-gray-500 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 bg-gray-500 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions - Silver Outline */}
            {showSuggestions && availableSuggestions.length > 0 && messages.length <= 1 && (
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((question, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/30 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-200 transition-all text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading || rateLimitReached}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area - Deep Black */}
            <div className="p-3 bg-[#0F0F0F] border-t border-white/5">
              <div className="flex gap-2 relative bg-[#141414] rounded-xl p-1 border border-white/5 focus-within:border-white/20 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={rateLimitReached ? "Limit reached..." : "Ask me anything..."}
                  className="flex-1 bg-transparent px-3 py-2 text-gray-300 text-sm focus:outline-none placeholder:text-gray-600"
                  disabled={isLoading || rateLimitReached}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputValue.trim() || rateLimitReached}
                  className="bg-gray-800 hover:bg-gray-700 rounded-lg w-10 flex items-center justify-center text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Constellation Navigator Modal */}
      <AnimatePresence>
        {isConstellationOpen && (
          <ConstellationNavigator onClose={() => setIsConstellationOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAvatarAssistant;