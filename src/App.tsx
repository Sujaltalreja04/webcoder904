import { lazy, Suspense, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/sections/HeroSection';
import AIAvatarAssistant from './components/AIAvatarAssistant';
import { VoiceCommandHelper } from './components/VoiceCommandHelper';
import { AIInsights } from './components/AIInsights';
import { SmartScrollPredictor } from './components/SmartScrollPredictor';
import { SEO } from './components/SEO';
import { TerminalMode } from './components/TerminalMode';
import { HiddenWorldController } from './components/HiddenWorldController';
import { WebVitals } from './components/WebVitals';
// TEMPORARILY DISABLED - Gamification & Screenshot Features
// Uncomment below to re-enable
// import { AdvancedScreenshotTool } from './components/AdvancedScreenshotTool';
// import { GamificationProvider } from './context/GamificationContext';
// import {
//   AchievementPopup,
//   AchievementsPanel,
//   AchievementsButton,
//   ExplorationProgress
// } from './components/Gamification';
// import { useScrollTracker, useKonamiCode, SectionTracker } from './hooks/useGamificationTracking';

const Scene3D = lazy(() => import('./components/3d/Scene3D').then(module => ({ default: module.Scene3D })));
const AboutSection = lazy(() => import('./components/sections/AboutSection').then(module => ({ default: module.AboutSection })));
const ProjectsSection = lazy(() => import('./components/sections/ProjectsSection').then(module => ({ default: module.ProjectsSection })));
const OngoingProjectsSection = lazy(() => import('./components/sections/OngoingProjectsSection').then(module => ({ default: module.OngoingProjectsSection })));
const SkillsSection = lazy(() => import('./components/sections/SkillsSection').then(module => ({ default: module.SkillsSection })));
const AchievementsSection = lazy(() => import('./components/sections/AchievementsSection').then(module => ({ default: module.AchievementsSection })));
const StorySection = lazy(() => import('./components/sections/StorySection').then(module => ({ default: module.StorySection })));
const BlogsSection = lazy(() => import('./components/sections/BlogsSection').then(module => ({ default: module.BlogsSection })));
const ContactSection = lazy(() => import('./components/sections/ContactSection').then(module => ({ default: module.ContactSection })));
const PlanningBoardSection = lazy(() => import('./components/sections/PlanningBoardSection').then(module => ({ default: module.PlanningBoardSection })));

// Inner app component
function AppContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  // TEMPORARILY DISABLED - Gamification tracking
  // useScrollTracker();
  // useKonamiCode();

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0a]">
      <WebVitals />
      <SEO
        title="AI Portfolio - Sujal Talreja | AI & LLM Engineer and Full Stack Developer Portfolio"
        description="Professional AI & LLM Engineer Portfolio showcasing AI agents, LLM fine-tuning, RAG pipelines, deep learning and data analysis solutions. Explore InfraSentinel, Evolvex AI, and cutting-edge GenAI projects. Full-stack developer & data analyst portfolio with real-world AI applications."
      />
      {/* TEMPORARILY DISABLED - Gamification UI */}
      {/* <ExplorationProgress /> */}
      {/* <SectionTracker /> */}

      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      <Navigation />

      {/* AI-Powered Insights - Top Banner */}
      <div className="relative z-10 pt-20">
        <AIInsights />
      </div>

      <main className="relative z-10">
        <section id="hero">
          <HeroSection />
        </section>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        }>
          <section id="about">
            <AboutSection />
          </section>
          <section id="story">
            <StorySection />
          </section>
          <section id="projects">
            <ProjectsSection />
          </section>
          <section id="ongoing-projects">
            <OngoingProjectsSection />
          </section>
          <section id="skills">
            <SkillsSection />
          </section>
          <section id="achievements">
            <AchievementsSection />
          </section>
          <section id="planning">
            <PlanningBoardSection />
          </section>
          <section id="blogs">
            <BlogsSection />
          </section>
          <section id="contact">
            <ContactSection />
          </section>
        </Suspense>
      </main>


      {/* AI-Enhanced Features */}
      <AIAvatarAssistant />
      <VoiceCommandHelper />
      <SmartScrollPredictor />
      <TerminalMode />
      <HiddenWorldController />
      {/* TEMPORARILY DISABLED - Screenshot Tool */}
      {/* <AdvancedScreenshotTool /> */}

      {/* TEMPORARILY DISABLED - Gamification UI */}
      {/* <AchievementPopup /> */}
      {/* <AchievementsPanel /> */}
      {/* <AchievementsButton /> */}

      <footer className="relative z-10 py-6 md:py-8 text-center text-gray-500 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            © 2025 SUJAL TALREJA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    // TEMPORARILY DISABLED - Gamification Provider
    // <GamificationProvider>
    <AppContent />
    // </GamificationProvider>
  );
}

export default App;