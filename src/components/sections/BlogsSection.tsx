import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { ExternalLink, Clock, BookOpen, ArrowRight, Tag } from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  url: string;
  tags: string[];
  gradient: string;
  icon: string;
}

const blogPosts: BlogPost[] = [
  {
    title: 'Why Your RAG Pipeline Still Hallucinates in 2026',
    excerpt:
      'Most RAG failures don\'t come from generation — they come from bad context. The LLM is just the final step. If it receives garbage → it produces polished garbage. Discover the Precision Retrieval Architecture that actually works.',
    category: 'AI / LLM',
    readTime: '8 min read',
    date: 'Apr 2026',
    url: 'https://medium.com/@sujaltalreja04/why-your-rag-pipeline-still-hallucinates-in-2026-717e477efa1a',
    tags: ['RAG', 'LLM', 'AI Engineering', 'Retrieval'],
    gradient: 'from-gray-700 via-gray-800 to-gray-900',
    icon: '🧠',
  },
  {
    title: 'Evolvex AI — How We Built an Agentic Multi-LLM System',
    excerpt:
      'Evolvex AI is a multi-agent, multi-LLM framework designed to analyze user skills, compare them with real-time market data, and generate a personalized career trajectory. Breaking down the agentic architecture behind it.',
    category: 'AI / Research',
    readTime: '7 min read',
    date: '2025',
    url: 'https://medium.com/@sujaltalreja04',
    tags: ['Agentic AI', 'Multi-LLM', 'Career Tech', 'Research'],
    gradient: 'from-gray-800 via-gray-700 to-gray-900',
    icon: '🚀',
  },
  {
    title: 'Small Mistakes, Big Consequences — A Lesson Learned Late',
    excerpt:
      'In life, it is rarely a big decision that destroys us overnight. More often, it is a series of small mistakes, tiny moments of irresponsibility, or the habit of ignoring our own boundaries that slowly lead us toward our downfall.',
    category: 'Personal Growth',
    readTime: '5 min read',
    date: '2025',
    url: 'https://medium.com/@sujaltalreja04',
    tags: ['Mindset', 'Self-Improvement', 'Boundaries', 'Life Lessons'],
    gradient: 'from-gray-900 via-gray-800 to-gray-700',
    icon: '💡',
  },
  {
    title: 'The Billion-Dollar Potential of Data Science & AI',
    excerpt:
      'The convergence of business analysis, data science, AI, and ML represents a paradigm shift in how companies operate. From industry disruption to global scalability, the opportunities are boundless for those willing to innovate.',
    category: 'Data Science',
    readTime: '6 min read',
    date: '2024',
    url: 'https://medium.com/@sujaltalreja04',
    tags: ['Data Science', 'AI', 'Machine Learning', 'Business'],
    gradient: 'from-gray-700 via-gray-900 to-gray-800',
    icon: '📊',
  },
  {
    title: 'From Full Stack Dev to Data & Business Analyst',
    excerpt:
      'Transitioning careers can be both daunting and exhilarating. For me, it meant moving away from the fast-paced world of full stack development to the nuanced realm of data and business analysis. Here\'s how my journey unfolded.',
    category: 'Career',
    readTime: '5 min read',
    date: '2024',
    url: 'https://medium.com/@sujaltalreja04',
    tags: ['Career', 'Data Analysis', 'Full Stack', 'Transition'],
    gradient: 'from-gray-800 via-gray-900 to-gray-700',
    icon: '🛤️',
  },
];

const categories = ['All', 'AI / LLM', 'AI / Research', 'Data Science', 'Career', 'Personal Growth'];

export const BlogsSection = () => {
  const [ref, isInView] = useInView();
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((b) => b.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section
      id="blogs"
      ref={ref}
      className="min-h-screen flex items-center justify-center py-16 md:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, #9ca3af 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, #6b7280 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: -40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-[rgba(192,192,192,0.2)] bg-[rgba(26,26,26,0.6)] backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-medium tracking-widest uppercase" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Thoughts & Insights
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 bg-clip-text text-transparent"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            BLOG
          </motion.h2>

          <motion.p
            className="mt-4 text-gray-400 text-sm sm:text-base max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Articles on AI, engineering, data science, and the lessons in between — published on Medium.
          </motion.p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border backdrop-blur-md transition-all ${
                activeCategory === cat
                  ? 'bg-[rgba(192,192,192,0.2)] border-[rgba(192,192,192,0.5)] text-gray-200 shadow-[0_0_16px_rgba(192,192,192,0.25)]'
                  : 'bg-[rgba(26,26,26,0.6)] border-[rgba(192,192,192,0.15)] text-gray-500 hover:text-gray-300 hover:border-[rgba(192,192,192,0.3)]'
              }`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id={`blog-filter-${cat.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((post, index) => (
              <motion.article
                key={post.title}
                variants={cardVariants}
                layout
                exit="exit"
                className="group relative flex flex-col rounded-xl overflow-hidden border border-[rgba(192,192,192,0.12)] backdrop-blur-md bg-[rgba(20,20,20,0.7)] cursor-pointer"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 16px 60px rgba(0,0,0,0.7), 0 0 30px rgba(192,192,192,0.08)',
                  borderColor: 'rgba(192,192,192,0.3)',
                }}
                onClick={() => window.open(post.url, '_blank', 'noopener,noreferrer')}
                id={`blog-card-${index}`}
              >
                {/* Card top gradient banner */}
                <div
                  className={`relative h-2 w-full bg-gradient-to-r ${post.gradient}`}
                />

                {/* Subtle glow line on hover */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px"
                  animate={{
                    background: hoveredIndex === index
                      ? 'linear-gradient(90deg, transparent, rgba(192,192,192,0.6), transparent)'
                      : 'linear-gradient(90deg, transparent, transparent, transparent)',
                  }}
                  transition={{ duration: 0.4 }}
                />

                <div className="flex flex-col flex-1 p-5 md:p-6">
                  {/* Top row: category + icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 border border-[rgba(192,192,192,0.18)] bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span className="text-2xl select-none">{post.icon}</span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-base sm:text-lg font-bold text-gray-200 mb-3 leading-snug group-hover:text-white transition-colors duration-300"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-4 mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-[rgba(255,255,255,0.05)] border border-[rgba(192,192,192,0.12)] text-gray-500 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer: meta + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(192,192,192,0.1)]">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                      <span className="opacity-40">·</span>
                      <span>{post.date}</span>
                    </div>

                    <motion.div
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-gray-200 transition-colors"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                      animate={{ x: hoveredIndex === index ? 4 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      READ
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.a
            href="https://medium.com/@sujaltalreja04"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-3.5 backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.25)] rounded-xl text-gray-300 font-semibold text-sm transition-all"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(192,192,192,0.25)',
              borderColor: 'rgba(192,192,192,0.5)',
            }}
            whileTap={{ scale: 0.96 }}
            id="blog-view-all-medium"
          >
            <ExternalLink className="w-4 h-4" />
            VIEW ALL ON MEDIUM
          </motion.a>
          <p className="mt-3 text-xs text-gray-600">@sujaltalreja04</p>
        </motion.div>
      </div>
    </section>
  );
};
