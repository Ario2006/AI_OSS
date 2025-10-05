import { useSearchStore } from "@/store/searchStore";
import { ProjectCard } from "./ProjectCard";
import { Loader2, Search, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export const ResultsGrid = () => {
  const { results, isLoading, error } = useSearchStore();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-8 w-40" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-5 p-7 border border-border/30 rounded-2xl liquid-glass">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
              <Skeleton className="h-14 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-18" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-16"
        >
          <div className="text-center space-y-5">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
            </div>
            <div>
              <p className="text-xl font-bold text-gradient mb-2">Discovering Relevant Repositories...</p>
              <p className="text-sm text-muted-foreground font-light">AI analyzing relevancy metrics across GitHub</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[500px]"
      >
        <div className="text-center space-y-6 max-w-lg p-10 rounded-2xl liquid-glass border border-destructive/30 shadow-2xl">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center mx-auto">
            <Search className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-destructive">Search Failed</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[500px]"
      >
        <div className="text-center space-y-8 max-w-xl">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 blur-3xl rounded-full" />
            <div className="relative h-28 w-28 rounded-3xl liquid-glass border border-primary/30 flex items-center justify-center mx-auto glow-effect">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="text-gradient">Discover</span> Relevant Repositories
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base font-light">
              Use the <span className="font-bold text-primary">AI-powered search</span> above to describe what you're looking for in natural language,
              or apply <span className="font-bold text-accent">manual filters</span> on the left to discover quality open-source projects.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 pt-6">
            {[
              { icon: Search, label: "Smart Search", color: "primary" },
              { icon: TrendingUp, label: "Trend Analysis", color: "accent" },
              { icon: Sparkles, label: "AI Scoring", color: "primary" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`p-5 rounded-xl liquid-glass border ${
                  item.color === 'accent' ? 'border-accent/30 hover:border-accent/50 hover:glow-effect-purple' : 'border-primary/30 hover:border-primary/50 hover:glow-effect'
                } transition-all duration-300 cursor-pointer`}
              >
                <item.icon className={`h-7 w-7 mx-auto mb-3 ${
                  item.color === 'accent' ? 'text-accent' : 'text-primary'
                }`} />
                <p className="text-xs font-bold text-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between p-6 rounded-2xl liquid-glass border border-primary/30 glow-effect shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-gradient mb-2">
            {results.length} {results.length === 1 ? "Repository" : "Repositories"} Discovered
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Intelligently ranked by AI Relevancy Score (highest first)
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full liquid-glass border border-accent/30 glow-effect-purple">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              AI-Ranked
            </span>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};
