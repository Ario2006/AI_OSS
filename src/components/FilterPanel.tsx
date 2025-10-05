import { useState } from "react";
import { useSearchStore } from "@/store/searchStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw, Search as SearchIcon, Code2, Star, Calendar, GitFork, AlertCircle, X, Shield, BookOpen, Archive } from "lucide-react";
import { searchGitHubRepos } from "@/lib/github";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", 
  "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Dart",
  "Elixir", "Haskell", "R", "Shell", "HTML", "CSS", "Vue", "Svelte"
];

const LICENSES = [
  "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC", 
  "LGPL-3.0", "MPL-2.0", "Unlicense", "AGPL-3.0"
];

const SORT_OPTIONS = [
  { value: "stars", label: "Most Stars" },
  { value: "forks", label: "Most Forks" },
  { value: "updated", label: "Recently Updated" },
  { value: "help-wanted-issues", label: "Help Wanted" },
];

export const FilterPanel = () => {
  const { filters, setFilters, resetFilters, setResults, setIsLoading, setError } = useSearchStore();
  const [minStars, setMinStars] = useState(filters.minStars || 100);
  const [lastCommitDays, setLastCommitDays] = useState(filters.lastCommitDays || 365);
  const [isSearching, setIsSearching] = useState(false);

  const handleLanguageChange = (language: string) => {
    setFilters({ ...filters, language: language === "any" ? undefined : language });
  };

  const handleStarsChange = (value: number[]) => {
    const stars = value[0];
    setMinStars(stars);
    setFilters({ ...filters, minStars: stars });
  };

  const handleCommitDaysChange = (value: number[]) => {
    const days = value[0];
    setLastCommitDays(days);
    setFilters({ ...filters, lastCommitDays: days });
  };

  const handleReset = () => {
    resetFilters();
    setMinStars(100);
    setLastCommitDays(365);
    toast.info("Filters reset to defaults");
  };

  const handleManualSearch = async () => {
    setIsSearching(true);
    setIsLoading(true);
    setError(null);

    try {
      toast.info("🔍 Searching with filters...");
      const results = await searchGitHubRepos("", filters);
      setResults(results);
      
      if (results.length > 0) {
        toast.success(`Found ${results.length} relevant repositories! 🎉`);
      } else {
        toast.warning("No results found. Try adjusting your filters.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to search projects";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const getCommitDaysLabel = (days: number) => {
    if (days <= 7) return "This week";
    if (days <= 30) return "This month";
    if (days <= 90) return "3 months";
    if (days <= 180) return "6 months";
    return "1 year";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 p-6 bg-gradient-to-br from-card via-card to-card/50 rounded-xl border shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Manual Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="language" className="flex items-center gap-2 text-sm font-medium">
            <Code2 className="h-4 w-4 text-primary" />
            Programming Language
          </Label>
          <Select
            value={filters.language || "any"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="language" className="bg-background/50 border-border/50">
              <SelectValue placeholder="Any language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any language</SelectItem>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4 text-primary" />
              Minimum Stars
            </Label>
            <span className="text-sm font-bold text-primary">
              {minStars.toLocaleString()}+
            </span>
          </div>
          <Slider
            value={[minStars]}
            onValueChange={handleStarsChange}
            min={0}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5k</span>
            <span>10k</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Last Commit Within
            </Label>
            <span className="text-sm font-bold text-primary">
              {getCommitDaysLabel(lastCommitDays)}
            </span>
          </div>
          <Slider
            value={[lastCommitDays]}
            onValueChange={handleCommitDaysChange}
            min={7}
            max={365}
            step={7}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 week</span>
            <span>6 months</span>
            <span>1 year</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4 border-t border-border/50"
        >
          <Button
            onClick={handleManualSearch}
            disabled={isSearching}
            className="w-full group relative overflow-hidden"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 group-hover:translate-x-full transition-transform duration-1000" />
            {isSearching ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon className="mr-2 h-4 w-4" />
                Apply Filters
              </>
            )}
          </Button>
        </motion.div>

        <div className="pt-4 border-t border-border/50 space-y-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Tip:</span> Use AI Search for natural language queries or these filters for precise control.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
