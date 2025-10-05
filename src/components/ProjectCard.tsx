import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { HealthBadge } from "./HealthBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, GitFork, Users, Clock, ExternalLink, ArrowUpRight } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { setSelectedProject } = useSearchStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card
        className="group cursor-pointer h-full relative overflow-hidden liquid-glass border-border/50 hover:border-primary/40 hover:glow-effect transition-all duration-500"
        onClick={() => setSelectedProject(project)}
      >
        {/* Premium gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent" />
        </div>
        
        {/* Animated top accent bar with neon glow */}
        <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-full w-full bg-gradient-to-r from-transparent via-primary to-accent shadow-lg shadow-primary/50"
          />
        </div>

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl truncate group-hover:text-gradient transition-all duration-300 font-bold">
                  {project.name}
                </CardTitle>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
              <CardDescription className="text-xs text-muted-foreground font-mono opacity-70">
                {project.fullName}
              </CardDescription>
            </div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <HealthBadge score={project.healthScore} size="md" showLabel={false} />
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed min-h-[40px] font-light">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.language && (
              <Badge 
                variant="secondary" 
                className="text-xs font-semibold bg-gradient-to-r from-primary/15 to-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:glow-effect transition-all duration-300"
              >
                {project.language}
              </Badge>
            )}
            {project.topics.slice(0, 2).map((topic) => (
              <Badge 
                key={topic} 
                variant="outline" 
                className="text-xs font-medium border-border/50 hover:border-accent/40 hover:bg-accent/10 hover:text-accent transition-all duration-300"
              >
                {topic}
              </Badge>
            ))}
            {project.topics.length > 2 && (
              <Badge variant="outline" className="text-xs text-muted-foreground border-border/30">
                +{project.topics.length - 2}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
            <motion.div 
              whileHover={{ scale: 1.05, x: 2 }}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
              </div>
              <span className="font-semibold">{project.stats.stars.toLocaleString()}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, x: 2 }}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <GitFork className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-semibold">{project.stats.forks.toLocaleString()}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, x: 2 }}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="font-semibold">{project.stats.contributors}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, x: 2 }}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-accent/10">
                <Clock className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="truncate font-semibold">{formatDate(project.stats.lastCommit)}</span>
            </motion.div>
          </div>

          {/* AI Relevancy Score Progress Bar - Premium Design */}
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">AI Relevancy Score</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {project.healthScore}/100
              </span>
            </div>
            <div className="h-2 bg-secondary/30 rounded-full overflow-hidden border border-border/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.healthScore}%` }}
                transition={{ duration: 1.2, delay: index * 0.05 + 0.3, ease: "easeOut" }}
                className={`h-full rounded-full relative ${
                  project.healthScore >= 70 ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600' :
                  project.healthScore >= 40 ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600' :
                  'bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
