import { create } from 'zustand';
import { Project, SearchFilters } from '@/types/project';

interface SearchState {
  // Search state
  query: string;
  filters: SearchFilters;
  results: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Selected project for modal
  selectedProject: Project | null;
  
  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setResults: (results: Project[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProject: (project: Project | null) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  minStars: 100,
  lastCommitDays: 365,
};

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: defaultFilters,
  results: [],
  isLoading: false,
  error: null,
  selectedProject: null,
  
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set({ filters }),
  setResults: (results) => set({ results }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
