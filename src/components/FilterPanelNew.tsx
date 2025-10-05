import { useState } from "react";
import { useSearchStore } from "@/store/searchStore";
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
import { SearchFilters } from "@/types/project";

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", 
  "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Dart",
  "Elixir", "Haskell", "R", "Shell", "HTML", "CSS", "Vue", "Svelte"
];

const LICENSES = [
  "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC", 
  "LGPL-3.0", "MPL-2.0", "Unlicense", "AGPL-3.0"
];

export const FilterPanel = () => {
  const { filters, setFilters, resetFilters, setResults, setIsLoading, setError } = useSearchStore();
  
  // Local state for UI - initialize from store filters
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(filters.languages || []);
  const [minStars, setMinStars] = useState(filters.minStars || 100);
  const [minForks, setMinForks] = useState(filters.minForks || 0);
  const [lastCommitDays, setLastCommitDays] = useState(filters.lastCommitDays || 365);
  const [hasIssues, setHasIssues] = useState(filters.hasIssues ?? true);
  const [hasWiki, setHasWiki] = useState(filters.hasWiki ?? false);
  const [excludeArchived, setExcludeArchived] = useState(!(filters.archived ?? false));
  const [selectedLicense, setSelectedLicense] = useState(filters.license || "any");
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLanguageToggle = (language: string) => {
    const updated = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    
    setSelectedLanguages(updated);
    
    // Immediately update the store with new languages
    const updatedFilters = {
      ...filters,
      languages: updated.length > 0 ? updated : undefined
    };
    setFilters(updatedFilters);
  };

  const handleRemoveLanguage = (language: string) => {
    const updated = selectedLanguages.filter(l => l !== language);
    setSelectedLanguages(updated);
    
    // Immediately update the store with new languages
    const updatedFilters = {
      ...filters,
      languages: updated.length > 0 ? updated : undefined
    };
    setFilters(updatedFilters);
  };

  const handleStarsChange = (value: number[]) => {
    const stars = value[0];
    setMinStars(stars);
    setFilters({ ...filters, minStars: stars });
  };

  const handleForksChange = (value: number[]) => {
    const forks = value[0];
    setMinForks(forks);
    setFilters({ ...filters, minForks: forks });
  };

  const handleCommitDaysChange = (value: number[]) => {
    const days = value[0];
    setLastCommitDays(days);
    setFilters({ ...filters, lastCommitDays: days });
  };

  const handleLicenseChange = (value: string) => {
    setSelectedLicense(value);
    setFilters({ ...filters, license: value === "any" ? undefined : value });
  };

  const handleReset = () => {
    resetFilters();
    setSelectedLanguages([]);
    setMinStars(100);
    setMinForks(0);
    setLastCommitDays(365);
    setHasIssues(true);
    setHasWiki(false);
    setExcludeArchived(true);
    setSelectedLicense("any");
    toast.info("Filters reset to defaults");
  };

  const handleManualSearch = async () => {
    setIsSearching(true);
    setIsLoading(true);
    setError(null);

    const searchFilters: SearchFilters = {
      ...filters,
      languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
      minStars,
      minForks,
      lastCommitDays,
      hasIssues,
      hasWiki,
      archived: !excludeArchived,
      license: selectedLicense === "any" ? undefined : selectedLicense,
    };

    try {
      toast.info("🔍 Searching with filters...");
      const results = await searchGitHubRepos("", searchFilters);
      setResults(results);
      setFilters(searchFilters); // Update store with current filters
      
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
      className="space-y-6 p-6 liquid-glass rounded-xl border border-[#BFFF00]/20 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#BFFF00]/20 to-[#0D1F14]/30">
            <Filter className="h-5 w-5 text-[#BFFF00]" />
          </div>
          <h2 className="text-lg font-semibold text-white">Manual Filters</h2>
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
        {/* Languages - Multiple Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <Label className="flex items-center gap-2 text-sm font-medium text-white">
            <Code2 className="h-4 w-4 text-[#BFFF00]" />
            Programming Languages
          </Label>
          
          {/* Selected Languages */}
          {selectedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              <AnimatePresence>
                {selectedLanguages.map((lang) => (
                  <motion.div
                    key={lang}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="bg-[#BFFF00] text-[#0A0F0D] hover:bg-[#BFFF00]/90 pr-1"
                    >
                      {lang}
                      <button
                        onClick={() => handleRemoveLanguage(lang)}
                        className="ml-1 hover:bg-[#0A0F0D]/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Language Selector */}
          <Select onValueChange={(lang) => lang !== "select" && handleLanguageToggle(lang)}>
            <SelectTrigger className="liquid-glass border-[#BFFF00]/20 text-white">
              <SelectValue placeholder="Add language..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select" disabled>Select languages...</SelectItem>
              {LANGUAGES.map((lang) => (
                <SelectItem 
                  key={lang} 
                  value={lang}
                  disabled={selectedLanguages.includes(lang)}
                >
                  {lang} {selectedLanguages.includes(lang) && "✓"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Minimum Stars */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium text-white">
              <Star className="h-4 w-4 text-[#BFFF00]" />
              Minimum Stars
            </Label>
            <span className="text-sm font-bold text-[#BFFF00]">
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
          <div className="flex justify-between text-xs text-[#8A9A8E]">
            <span>0</span>
            <span>5k</span>
            <span>10k</span>
          </div>
        </motion.div>

        {/* Minimum Forks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium text-white">
              <GitFork className="h-4 w-4 text-[#BFFF00]" />
              Minimum Forks
            </Label>
            <span className="text-sm font-bold text-[#BFFF00]">
              {minForks.toLocaleString()}+
            </span>
          </div>
          <Slider
            value={[minForks]}
            onValueChange={handleForksChange}
            min={0}
            max={5000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[#8A9A8E]">
            <span>0</span>
            <span>2.5k</span>
            <span>5k</span>
          </div>
        </motion.div>

        {/* Last Commit Within */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium text-white">
              <Calendar className="h-4 w-4 text-[#BFFF00]" />
              Last Commit Within
            </Label>
            <span className="text-sm font-bold text-[#BFFF00]">
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
          <div className="flex justify-between text-xs text-[#8A9A8E]">
            <span>1 week</span>
            <span>6 months</span>
            <span>1 year</span>
          </div>
        </motion.div>

        {/* Advanced Options Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-[#8A9A8E] hover:text-[#BFFF00]"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
        </motion.div>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 border-t border-[#BFFF00]/20"
            >
              {/* License */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-white">
                  <Shield className="h-4 w-4 text-[#BFFF00]" />
                  License
                </Label>
                <Select value={selectedLicense} onValueChange={handleLicenseChange}>
                  <SelectTrigger className="liquid-glass border-[#BFFF00]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any License</SelectItem>
                    {LICENSES.map((license) => (
                      <SelectItem key={license} value={license}>
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Boolean Filters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium text-white">
                    <AlertCircle className="h-4 w-4 text-[#BFFF00]" />
                    Has Issues Enabled
                  </Label>
                  <Switch
                    checked={hasIssues}
                    onCheckedChange={(checked) => {
                      setHasIssues(checked);
                      setFilters({ ...filters, hasIssues: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium text-white">
                    <BookOpen className="h-4 w-4 text-[#BFFF00]" />
                    Has Wiki
                  </Label>
                  <Switch
                    checked={hasWiki}
                    onCheckedChange={(checked) => {
                      setHasWiki(checked);
                      setFilters({ ...filters, hasWiki: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-medium text-white">
                    <Archive className="h-4 w-4 text-[#BFFF00]" />
                    Exclude Archived
                  </Label>
                  <Switch
                    checked={excludeArchived}
                    onCheckedChange={(checked) => {
                      setExcludeArchived(checked);
                      setFilters({ ...filters, archived: !checked });
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Button
            onClick={handleManualSearch}
            disabled={isSearching}
            className="w-full group relative overflow-hidden bg-[#BFFF00] text-[#0A0F0D] hover:shadow-[0_0_48px_rgba(191,255,0,0.5)] font-bold"
            size="lg"
          >
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

        {/* Tip */}
        <div className="pt-4 border-t border-[#BFFF00]/20 space-y-2">
          <p className="text-xs text-[#8A9A8E]">
            <span className="font-medium text-[#BFFF00]">Tip:</span> Select multiple languages to search repos using any of them. Results are automatically sorted by stars.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
