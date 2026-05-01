import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, Sparkles, AlertTriangle } from 'lucide-react';
// TEMPORARILY DISABLED - Gamification tracking
// import { useGamification } from '../context/GamificationContext';

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

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  // TEMPORARILY DISABLED - Gamification tracking
  // const { trackChatbotInteraction } = useGamification();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Check and update rate limit
  useEffect(() => {
    updateRateLimit();
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

    // TEMPORARILY DISABLED - Track chatbot interaction for gamification
    // trackChatbotInteraction();

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

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-[rgba(192,192,192,0.3)] backdrop-blur-md shadow-lg z-50 flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MessageCircle className="text-gray-300" size={24} />
        {/* Pulsing indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] rounded-xl bg-[rgba(26,26,26,0.95)] border border-[rgba(192,192,192,0.3)] backdrop-blur-md shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h3 className="text-gray-100 font-bold flex items-center gap-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <Sparkles size={16} className="text-yellow-400" />
                  Eranix AI
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Rate Limit Warning */}
            {remainingRequests <= 3 && remainingRequests > 0 && (
              <div className="bg-yellow-900/30 border-b border-yellow-600/30 px-4 py-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-yellow-400" />
                <p className="text-xs text-yellow-300">
                  {remainingRequests} request{remainingRequests !== 1 ? 's' : ''} remaining this hour
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${message.role === 'user'
                      ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-100'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200'
                      }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Streaming message */}
              {isTyping && streamingMessage && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="max-w-[85%] bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200">
                    {streamingMessage}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-4 bg-gray-400 ml-1"
                    />
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {isLoading && !isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {showSuggestions && availableSuggestions.length > 0 && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((question, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs bg-[rgba(192,192,192,0.1)] hover:bg-[rgba(192,192,192,0.2)] border border-[rgba(192,192,192,0.2)] rounded-full px-3 py-1.5 text-gray-300 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading || rateLimitReached}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[rgba(192,192,192,0.2)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={rateLimitReached ? "Rate limit reached..." : "Ask about Sujal's work..."}
                  className="flex-1 bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  disabled={isLoading || rateLimitReached}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputValue.trim() || rateLimitReached}
                  className="bg-gradient-to-br from-gray-600 to-gray-800 border border-[rgba(192,192,192,0.3)] rounded-lg p-2 text-gray-300 hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;