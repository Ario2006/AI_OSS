import { useState, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Wand2, Code2 } from "lucide-react";
import { toast } from "sonner";
import { searchWithGraphQL } from "@/lib/github";
import { parseNaturalLanguageQuery, enhanceSearchQuery } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLE_QUERIES = [
  "Modern React UI component libraries with TypeScript support and comprehensive documentation",
  "High-performance Python machine learning frameworks actively maintained in 2025",
  "Production-ready Rust CLI tools with strong community engagement and recent updates",
  "Enterprise-grade Go microservices frameworks with excellent test coverage",
  "Cutting-edge JavaScript testing libraries with active development and stellar documentation",
  "Lightweight Vue.js state management libraries with excellent developer experience",
  "Fast and secure authentication libraries for Node.js applications",
  "Popular data visualization libraries for Python with interactive charts",
  "Modern CSS-in-JS solutions with zero-runtime overhead and TypeScript support",
  "Blazing fast build tools for web development with hot module replacement",
];

export const AISearchPanel = () => {
  const { query, setQuery, setResults, setIsLoading, setError } = useSearchStore();
  const [isSearching, setIsSearching] = useState(false);
  const [enhancedQuery, setEnhancedQuery] = useState<string>("");
  const [graphqlQuery, setGraphqlQuery] = useState<string>("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentQuery = EXAMPLE_QUERIES[placeholderIndex];
    let currentIndex = 0;

    if (isTyping) {
      // Typing forward
      const typingInterval = setInterval(() => {
        if (currentIndex <= currentQuery.length) {
          setDisplayedPlaceholder(currentQuery.slice(0, currentIndex));
          currentIndex++;
        } else {
          // Finished typing, wait then start deleting
          clearInterval(typingInterval);
          setTimeout(() => setIsTyping(false), 2000); // Wait 2s before deleting
        }
      }, 50); // Typing speed: 50ms per character

      return () => clearInterval(typingInterval);
    } else {
      // Deleting backward
      currentIndex = currentQuery.length;
      const deletingInterval = setInterval(() => {
        if (currentIndex >= 0) {
          setDisplayedPlaceholder(currentQuery.slice(0, currentIndex));
          currentIndex--;
        } else {
          // Finished deleting, move to next query
          clearInterval(deletingInterval);
          setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
          setIsTyping(true);
        }
      }, 30); // Deleting speed: 30ms per character

      return () => clearInterval(deletingInterval);
    }
  }, [placeholderIndex, isTyping]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setError(null);
    setEnhancedQuery("");
    setGraphqlQuery("");

    try {
      // Parse natural language query using Gemini AI → returns GraphQL query
      toast.info("🤖 AI is parsing your query...");
      const parsedQuery = await parseNaturalLanguageQuery(query);
      
      // Create enhanced query description
      const enhanced = await enhanceSearchQuery(query, parsedQuery);
      setEnhancedQuery(enhanced);
      setGraphqlQuery(parsedQuery.graphqlQuery);
      
      // Search GitHub using GraphQL
      toast.info("🔍 Searching GitHub with GraphQL...");
      const results = await searchWithGraphQL(parsedQuery.graphqlQuery);
      
      setResults(results);
      
      if (results.length > 0) {
        toast.success(`Found ${results.length} relevant repositories! 🎉`, {
          description: enhanced,
        });
      } else {
        toast.warning("No results found. Try adjusting your search.", {
          description: "Try different keywords or broader criteria",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to search projects";
      setError(errorMessage);
      toast.error(errorMessage, {
        description: "Please check your API keys and try again",
      });
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-8 liquid-glass rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#BFFF00]/20 to-[#0D1F14]/30 glow-effect">
            <Sparkles className="h-6 w-6 text-[#BFFF00]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#BFFF00]">AI-Powered Search</h2>
            <p className="text-xs text-[#8A9A8E] font-medium">Natural language repository discovery</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full liquid-glass border border-[#BFFF00]/30">
          <Wand2 className="h-4 w-4 text-[#BFFF00] animate-pulse" />
          <span className="text-xs font-bold text-[#BFFF00]">
            Gemini AI
          </span>
        </div>
      </div>

      <div className="space-y-5 relative z-10">
        <div className="space-y-3">
          <Textarea
            placeholder={displayedPlaceholder + (isTyping ? "|" : "")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[160px] resize-none liquid-glass backdrop-blur-sm border-border/50 focus:border-primary/60 focus:glow-effect transition-all text-base font-light leading-relaxed placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSearch();
              }
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Press <kbd className="px-2 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono">⌘+Enter</kbd> or <kbd className="px-2 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono">Ctrl+Enter</kbd> to search</span>
            <span className="font-mono">{query.length} / 500</span>
          </div>
        </div>

        <AnimatePresence>
          {enhancedQuery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl liquid-glass border border-[#BFFF00]/30 glow-effect"
              >
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-[#BFFF00]">AI Interpretation:</span>{" "}
                  <span className="text-white font-light">{enhancedQuery}</span>
                </p>
              </motion.div>

              {graphqlQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-xl liquid-glass border border-[#BFFF00]/20"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <Code2 className="h-4 w-4 text-[#BFFF00]" />
                    <span className="text-xs font-bold text-[#BFFF00] uppercase tracking-wider">Generated GraphQL Query</span>
                  </div>
                  <code className="text-sm font-mono text-[#8A9A8E] break-all block bg-[#0A0F0D]/50 p-3 rounded-lg border border-[#BFFF00]/10">
                    {graphqlQuery}
                  </code>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="w-full group relative overflow-hidden h-14 text-base font-bold bg-[#BFFF00] text-[#0A0F0D] hover:shadow-[0_0_48px_rgba(191,255,0,0.5)] transition-all duration-300"
          size="lg"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2.5 h-5 w-5 animate-spin relative z-10" />
              <span className="relative z-10">Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-2.5 h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Search with AI</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
