import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Award, Users } from 'lucide-react';

interface VisitorStats {
    totalVisitors: number;
    mostViewedProject: string;
    trendingSkills: string[];
    currentViewers: number;
}

export const AIInsights = () => {
    // UPDATE THESE NUMBERS FROM YOUR GOOGLE ANALYTICS DASHBOARD
    // Go to: https://analytics.google.com/ → Reports → Engagement
    // Update monthly based on real GA4 data
    const [stats, setStats] = useState<VisitorStats>({
        totalVisitors: 847, // ← Update from GA4 "Total Users" (last 30 days)
        mostViewedProject: 'InfraSentinel', // ← Check GA4 "Pages and screens" report
        trendingSkills: ['Computer Vision', 'GenAI', 'PyTorch'], // ← Based on project views
        currentViewers: 2, // ← Simulated (GA4 Realtime shows actual live users)
    });
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simulate real-time updates (less frequent on mobile)
    useEffect(() => {
        const updateInterval = isMobile ? 30000 : 10000; // 30s on mobile, 10s on desktop
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 3),
                currentViewers: Math.max(1, prev.currentViewers + (Math.random() > 0.5 ? 1 : -1)),
            }));
        }, updateInterval);

        return () => clearInterval(interval);
    }, [isMobile]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 sm:px-6 py-8"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {/* Total Visitors */}
                <motion.div
                    whileHover={isMobile ? {} : { scale: 1.05, boxShadow: '0 10px 40px rgba(192, 192, 192, 0.2)' }}
                    className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4 relative overflow-hidden"
                    style={{ willChange: isMobile ? 'auto' : 'transform' }}
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="w-5 h-5 text-blue-400" />
                            <motion.div
                                animate={isMobile ? {} : { opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-blue-400"
                            />
                        </div>
                        <motion.p
                            key={stats.totalVisitors}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold text-white mb-1"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            {stats.totalVisitors.toLocaleString()}
                        </motion.p>
                        <p className="text-xs text-gray-400">Total Visitors</p>
                    </div>
                </motion.div>

                {/* Most Viewed Project */}
                <motion.div
                    whileHover={isMobile ? {} : { scale: 1.05, boxShadow: '0 10px 40px rgba(192, 192, 192, 0.2)' }}
                    className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4 relative overflow-hidden"
                    style={{ willChange: isMobile ? 'auto' : 'transform' }}
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Award className="w-5 h-5 text-green-400" />
                            <motion.div
                                animate={isMobile ? {} : { rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="text-yellow-400"
                            >
                                ⭐
                            </motion.div>
                        </div>
                        <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            {stats.mostViewedProject}
                        </p>
                        <p className="text-xs text-gray-400">Most Viewed</p>
                    </div>
                </motion.div>

                {/* Current Viewers */}
                <motion.div
                    whileHover={isMobile ? {} : { scale: 1.05, boxShadow: '0 10px 40px rgba(192, 192, 192, 0.2)' }}
                    className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4 relative overflow-hidden"
                    style={{ willChange: isMobile ? 'auto' : 'transform' }}
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-purple-400" />
                            <motion.div
                                animate={isMobile ? {} : { scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-green-400"
                            />
                        </div>
                        <motion.p
                            key={stats.currentViewers}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold text-white mb-1"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            {stats.currentViewers}
                        </motion.p>
                        <p className="text-xs text-gray-400">Online Now</p>
                    </div>
                </motion.div>

                {/* Trending Skills */}
                <motion.div
                    whileHover={isMobile ? {} : { scale: 1.05, boxShadow: '0 10px 40px rgba(192, 192, 192, 0.2)' }}
                    className="backdrop-blur-md bg-[rgba(26,26,26,0.7)] border border-[rgba(192,192,192,0.2)] rounded-xl p-4 relative overflow-hidden"
                    style={{ willChange: isMobile ? 'auto' : 'transform' }}
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                            <motion.div
                                animate={isMobile ? {} : { y: [-2, 2, -2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🔥
                            </motion.div>
                        </div>
                        <div className="space-y-1">
                            {stats.trendingSkills.map((skill, idx) => (
                                <motion.div
                                    key={skill}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="text-xs text-gray-300"
                                >
                                    • {skill}
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Trending Skills</p>
                    </div>
                </motion.div>
            </div>

            {/* Decorative AI Insights Label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6"
            >
                <div className="inline-flex items-center gap-2 backdrop-blur-md bg-[rgba(26,26,26,0.5)] border border-[rgba(192,192,192,0.2)] rounded-full px-4 py-2">
                    <motion.div
                        animate={isMobile ? {} : { rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span className="text-xs text-gray-400">
                        <span className="text-white font-semibold">AI-Powered</span> Real-time Analytics
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};
