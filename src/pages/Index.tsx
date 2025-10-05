import { FilterPanel } from "@/components/FilterPanelNew";
import { AISearchPanel } from "@/components/AISearchPanel";
import { ResultsGrid } from "@/components/ResultsGrid";
import { ProjectModal } from "@/components/ProjectModal";
import { Sparkles, Zap, TrendingUp, ArrowRight, Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Index = () => {
  const [showHero, setShowHero] = useState(true);

  return (
    <div className="min-h-screen bg-background dark relative overflow-hidden">
      {/* Premium gradient mesh background */}
      <div className="fixed inset-0 gradient-mesh opacity-60" />
      <div className="fixed inset-0 bg-grid-white/5" />
      
      {/* Animated liquid glass orbs - Electric Lime aesthetic */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#BFFF00]/20 via-[#0D1F14]/30 to-transparent rounded-full blur-3xl animate-morph opacity-40" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-gradient-to-tl from-[#BFFF00]/15 via-[#1A2F1F]/30 to-transparent rounded-full blur-3xl animate-morph opacity-30" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-[#BFFF00]/10 to-transparent rounded-full blur-2xl animate-morph opacity-20" style={{ animationDelay: '4s' }} />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border/30 liquid-glass sticky top-0 z-50 shadow-2xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="h-11 w-11 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#BFFF00]/20 to-[#0D1F14]/30 p-1">
                  <img 
                    src="/Logo.png" 
                    alt="Discover.oss Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-gradient">discover</span>
                    <span className="text-foreground/90">.oss</span>
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">AI-Powered Discovery</p>
                </div>
              </motion.div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full liquid-glass border border-[#BFFF00]/30 glow-effect"
              >
                <Sparkles className="h-4 w-4 text-[#BFFF00] animate-pulse" />
                <span className="text-sm font-semibold text-[#BFFF00]">
                  Powered by Gemini AI
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Premium Futuristic Design */}
      {showHero && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative overflow-hidden"
        >
          {/* 3D liquid glass orb effects */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none">
            <motion.div 
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#BFFF00]/15 via-[#0D1F14]/25 to-transparent blur-3xl"
            />
            <motion.div 
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1 
              }}
              className="absolute inset-20 rounded-full bg-gradient-to-tl from-[#BFFF00]/20 via-[#1A2F1F]/30 to-transparent blur-2xl"
            />
          </div>
          
          <div className="container mx-auto px-6 py-20 md:py-32 relative">
            <div className="max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-10"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#BFFF00] text-[#0A0F0D] border border-[#BFFF00]/30 shadow-[0_0_24px_rgba(191,255,0,0.3)]"
                >
                  <Boxes className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-bold tracking-wide">Next-Gen Repository Discovery Platform</span>
                </motion.div>

                {/* Main Headline - Bold, modern typography */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tighter"
                >
                  <span className="text-white">Discover Open Source,</span>
                  <br />
                  <span className="text-[#BFFF00]">Intelligently.</span>
                </motion.h2>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-lg md:text-xl text-[#8A9A8E] max-w-2xl leading-relaxed font-light"
                >
                  AI-powered search that understands what you actually need. Find quality repositories 
                  with 8-metric health analysis, not just star counts.
                </motion.p>

                {/* Stats Row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-12 text-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-[#BFFF00]">8</div>
                    <div className="text-sm text-[#8A9A8E] leading-tight">
                      AI-Powered<br />Health Metrics
                    </div>
                  </div>
                  <div className="h-14 w-px bg-gradient-to-b from-transparent via-[#BFFF00]/30 to-transparent" />
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-[#BFFF00]">∞</div>
                    <div className="text-sm text-[#8A9A8E] leading-tight">
                      GitHub<br />Repositories
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-center gap-4 pt-6"
                >
                  <motion.button
                    onClick={() => setShowHero(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 rounded-full bg-[#BFFF00] text-[#0A0F0D] font-bold text-base shadow-2xl hover:shadow-[0_0_48px_rgba(191,255,0,0.5)] transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
                  >
                    <span className="relative z-10">Start Discovering</span>
                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.a
                    href="https://github.com/Ario2006/AI_OSS"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full liquid-glass border border-[#BFFF00]/30 text-white font-semibold hover:border-[#BFFF00]/50 hover:glow-effect transition-all duration-300"
                  >
                    View on GitHub
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </motion.section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Filters */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="sticky top-28">
              <FilterPanel />
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-9 space-y-8"
          >
            {/* AI Search Panel */}
            <AISearchPanel />

            {/* Results Grid */}
            <ResultsGrid />
          </motion.div>
        </div>
      </main>

      {/* Project Details Modal */}
      <ProjectModal />

      {/* Footer */}
      <footer className="border-t border-border/30 mt-24 liquid-glass">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#BFFF00]/20 to-[#0D1F14]/30 p-1">
                  <img 
                    src="/Logo.png" 
                    alt="Discover.oss" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold">
                  <span className="text-[#BFFF00]">discover</span>
                  <span className="text-white">.oss</span>
                </h3>
              </div>
              <p className="text-sm text-[#8A9A8E] leading-relaxed">
                Revolutionizing open-source discovery with AI-powered intelligence 
                and 8-metric health analysis.
              </p>
            </div>

            {/* Platform Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-sm text-[#8A9A8E]">
                <li className="hover:text-[#BFFF00] cursor-pointer transition-colors">AI Search Technology</li>
                <li className="hover:text-[#BFFF00] cursor-pointer transition-colors">Health Metrics</li>
                <li className="hover:text-[#BFFF00] cursor-pointer transition-colors">GraphQL API Integration</li>
                <li className="hover:text-[#BFFF00] cursor-pointer transition-colors">Real-Time Analysis</li>
              </ul>
            </div>

            {/* Powered By Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Powered By</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg liquid-glass border border-[#BFFF00]/20">
                  <Sparkles className="h-5 w-5 text-[#BFFF00]" />
                  <div>
                    <p className="text-sm font-semibold text-white">Google Gemini AI</p>
                    <p className="text-xs text-[#8A9A8E]">Natural Language Processing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg liquid-glass border border-[#BFFF00]/20">
                  <TrendingUp className="h-5 w-5 text-[#BFFF00]" />
                  <div>
                    <p className="text-sm font-semibold text-white">GitHub GraphQL</p>
                    <p className="text-xs text-[#8A9A8E]">Advanced Repository Data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#BFFF00]/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#8A9A8E]">
                © 2025 Discover.oss. Empowering developers with intelligent repository discovery.
              </p>
              <div className="flex items-center gap-6 text-xs text-[#8A9A8E]">
                <a href="#" className="hover:text-[#BFFF00] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#BFFF00] transition-colors">Terms</a>
                <a href="#" className="hover:text-[#BFFF00] transition-colors">Documentation</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
