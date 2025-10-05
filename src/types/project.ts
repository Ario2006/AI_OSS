export interface ProjectStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  lastCommit: string;
  lastCommitDaysAgo: number;
  contributors: number;
  license: string;
}

export interface HealthBreakdown {
  commitFrequency: ComponentScore;
  issueResponseTime: ComponentScore;
  prMergeRate: ComponentScore;
  contributorDiversity: ComponentScore;
  documentationQuality: ComponentScore;
  dependencyFreshness: ComponentScore;
  communityGrowth: ComponentScore;
  breakingChangeFrequency: ComponentScore;
}

export interface ComponentScore {
  score: number;
  value: number;
  unit: string;
  weight: number;
}

export interface Project {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  healthScore: number;
  stats: ProjectStats;
  topics: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
  healthBreakdown?: HealthBreakdown;
}

export interface SearchFilters {
  languages?: string[]; // Changed to array for multiple languages
  minStars?: number;
  maxStars?: number;
  minForks?: number;
  maxForks?: number;
  lastCommitDays?: number;
  minIssues?: number;
  maxIssues?: number;
  topics?: string[];
  license?: string;
  hasWiki?: boolean;
  hasIssues?: boolean;
  hasProjects?: boolean;
  archived?: boolean;
  sortBy?: 'stars' | 'forks' | 'updated' | 'help-wanted-issues';
  order?: 'desc' | 'asc';
  createdAfter?: string; // ISO date string
  pushedAfter?: string; // ISO date string
  size?: 'small' | 'medium' | 'large'; // Repository size
}

export interface SearchRequest {
  query?: string;
  filters?: SearchFilters;
  limit?: number;
}

export interface SearchResponse {
  results: Project[];
  metadata: {
    totalResults: number;
    returnedResults: number;
    queryTimeMs: number;
    parsedQuery?: {
      language?: string;
      category?: string;
      constraints?: string[];
    };
  };
}
