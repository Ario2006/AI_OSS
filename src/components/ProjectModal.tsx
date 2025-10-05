import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSearchStore } from "@/store/searchStore";
import { HealthBadge } from "./HealthBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, GitFork, Users, Clock, ExternalLink, GitPullRequest, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { motion } from "framer-motion";

export const ProjectModal = () => {
  const { selectedProject, setSelectedProject } = useSearchStore();

  if (!selectedProject) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Use actual health breakdown data if available
  const healthBreakdown = selectedProject.healthBreakdown || {
    commitFrequency: { score: 0, value: 0, unit: 'days', weight: 20 },
    issueResponseTime: { score: 0, value: 0, unit: 'ratio', weight: 15 },
    prMergeRate: { score: 0, value: 0, unit: '%', weight: 15 },
    contributorDiversity: { score: 0, value: 0, unit: 'count', weight: 10 },
    documentationQuality: { score: 0, value: 0, unit: 'score', weight: 15 },
    dependencyFreshness: { score: 0, value: 0, unit: 'days', weight: 10 },
    communityGrowth: { score: 0, value: 0, unit: 'stars/day', weight: 10 },
    breakingChangeFrequency: { score: 0, value: 0, unit: 'stability', weight: 5 },
  };

  const healthData = [
    { name: "Commit Freq", score: Math.round(healthBreakdown.commitFrequency.score), fullMark: 100 },
    { name: "Issue Response", score: Math.round(healthBreakdown.issueResponseTime.score), fullMark: 100 },
    { name: "PR Merge", score: Math.round(healthBreakdown.prMergeRate.score), fullMark: 100 },
    { name: "Contributors", score: Math.round(healthBreakdown.contributorDiversity.score), fullMark: 100 },
    { name: "Docs Quality", score: Math.round(healthBreakdown.documentationQuality.score), fullMark: 100 },
    { name: "Dependencies", score: Math.round(healthBreakdown.dependencyFreshness.score), fullMark: 100 },
    { name: "Growth", score: Math.round(healthBreakdown.communityGrowth.score), fullMark: 100 },
    { name: "Stability", score: Math.round(healthBreakdown.breakingChangeFrequency.score), fullMark: 100 },
  ];

  const healthDetails = [
    {
      name: "Commit Frequency",
      score: Math.round(healthBreakdown.commitFrequency.score),
      value: `${healthBreakdown.commitFrequency.value} ${healthBreakdown.commitFrequency.unit} ago`,
      weight: `${healthBreakdown.commitFrequency.weight}%`,
    },
    {
      name: "Issue Response Time",
      score: Math.round(healthBreakdown.issueResponseTime.score),
      value: `${healthBreakdown.issueResponseTime.value} ${healthBreakdown.issueResponseTime.unit}`,
      weight: `${healthBreakdown.issueResponseTime.weight}%`,
    },
    {
      name: "PR Merge Rate",
      score: Math.round(healthBreakdown.prMergeRate.score),
      value: `${healthBreakdown.prMergeRate.value}${healthBreakdown.prMergeRate.unit}`,
      weight: `${healthBreakdown.prMergeRate.weight}%`,
    },
    {
      name: "Contributor Diversity",
      score: Math.round(healthBreakdown.contributorDiversity.score),
      value: `${healthBreakdown.contributorDiversity.value} forks`,
      weight: `${healthBreakdown.contributorDiversity.weight}%`,
    },
    {
      name: "Documentation Quality",
      score: Math.round(healthBreakdown.documentationQuality.score),
      value: `${healthBreakdown.documentationQuality.value} elements`,
      weight: `${healthBreakdown.documentationQuality.weight}%`,
    },
    {
      name: "Dependency Freshness",
      score: Math.round(healthBreakdown.dependencyFreshness.score),
      value: `${healthBreakdown.dependencyFreshness.value} ${healthBreakdown.dependencyFreshness.unit} ago`,
      weight: `${healthBreakdown.dependencyFreshness.weight}%`,
    },
    {
      name: "Community Growth",
      score: Math.round(healthBreakdown.communityGrowth.score),
      value: `${healthBreakdown.communityGrowth.value} ${healthBreakdown.communityGrowth.unit}`,
      weight: `${healthBreakdown.communityGrowth.weight}%`,
    },
    {
      name: "Breaking Changes",
      score: Math.round(healthBreakdown.breakingChangeFrequency.score),
      value: `${Math.round(healthBreakdown.breakingChangeFrequency.value / 365)}y old`,
      weight: `${healthBreakdown.breakingChangeFrequency.weight}%`,
    },
  ];

  return (
    <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-primary/5">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <DialogTitle className="text-3xl mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {selectedProject.name}
              </DialogTitle>
              <DialogDescription className="text-base flex items-center gap-2">
                {selectedProject.fullName}
              </DialogDescription>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <HealthBadge score={selectedProject.healthScore} size="lg" />
            </motion.div>
          </motion.div>
        </DialogHeader>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-foreground/80 leading-relaxed">{selectedProject.description}</p>
            <Button
              variant="default"
              size="sm"
              className="mt-4 group"
              onClick={() => window.open(selectedProject.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              View on GitHub
            </Button>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {selectedProject.language && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {selectedProject.language}
              </Badge>
            )}
            {selectedProject.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="hover:bg-secondary/80 transition-colors">
                {topic}
              </Badge>
            ))}
            {selectedProject.stats.license && (
              <Badge variant="outline">{selectedProject.stats.license}</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Star, label: "Stars", value: selectedProject.stats.stars, color: "text-amber-500" },
              { icon: GitFork, label: "Forks", value: selectedProject.stats.forks, color: "text-blue-500" },
              { icon: Users, label: "Contributors", value: selectedProject.stats.contributors, color: "text-green-500" },
              { icon: AlertCircle, label: "Open Issues", value: selectedProject.stats.openIssues, color: "text-purple-500" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-card via-card to-card/50 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span>{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="health" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
              <TabsTrigger value="health" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                AI Relevancy Breakdown
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Metrics Detail
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Project Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health" className="space-y-6 pt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-card via-card to-primary/5 border"
              >
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  8-Metric AI Relevancy Analysis
                </h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={healthData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.4} 
                        strokeWidth={2}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {healthData.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border hover:bg-secondary/50 hover:border-primary/30 transition-all group"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-20 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.score >= 70 ? 'bg-green-500' :
                            item.score >= 40 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-primary min-w-[3ch] text-right">{item.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4 pt-4">
              <div className="space-y-3">
                {healthDetails.map((metric, i) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-card via-card to-card/50 border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold">{metric.name}</h5>
                      <Badge variant="outline" className="font-mono">{metric.weight} weight</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.value}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              metric.score >= 70 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                              metric.score >= 40 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                              'bg-gradient-to-r from-red-600 to-red-400'
                            }`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                        <span className="text-xl font-bold text-primary min-w-[3ch] text-right">{metric.score}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="space-y-3">
                {[
                  { label: "Created", value: formatDate(selectedProject.createdAt) },
                  { label: "Last Updated", value: formatDate(selectedProject.updatedAt) },
                  { label: "Last Commit", value: formatDate(selectedProject.stats.lastCommit) },
                  { label: "Days Since Last Commit", value: `${selectedProject.stats.lastCommitDaysAgo} days` },
                  { label: "Watchers", value: selectedProject.stats.watchers.toLocaleString() },
                  { label: "License", value: selectedProject.stats.license },
                  { label: "Language", value: selectedProject.language },
                ].map((detail, i) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex justify-between py-3 px-4 rounded-lg hover:bg-secondary/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">{detail.label}</span>
                    <span className="text-sm font-medium">{detail.value}</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
