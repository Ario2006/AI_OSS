import { Octokit } from 'octokit';
import { Project, SearchFilters, HealthBreakdown, ComponentScore } from '@/types/project';
import { cache as cacheService, CACHE_TTL, generateCacheKey } from './cache';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_API = 'https://api.github.com';

// Initialize Octokit with auth token for GitHub GraphQL API
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  baseUrl: GITHUB_API,
});

// Log GitHub GraphQL endpoint for verification
if (import.meta.env.DEV) {
  console.log('✓ GitHub GraphQL endpoint configured:', `${GITHUB_API}/graphql`);
}

interface GraphQLSearchResult {
  search: {
    repositoryCount: number;
    edges: Array<{
      node: {
        id: string;
        name: string;
        nameWithOwner: string;
        description: string;
        url: string;
        stargazerCount: number;
        forkCount: number;
        watchers: { totalCount: number };
        issues: { totalCount: number };
        pullRequests: { totalCount: number };
        primaryLanguage: { name: string } | null;
        repositoryTopics: {
          edges: Array<{
            node: { topic: { name: string } };
          }>;
        };
        licenseInfo: { name: string } | null;
        createdAt: string;
        updatedAt: string;
        pushedAt: string;
        defaultBranchRef: {
          target: {
            history: {
              totalCount: number;
              edges: Array<{
                node: {
                  committedDate: string;
                  author: { user: { login: string } | null };
                };
              }>;
            };
          };
        } | null;
        object: {
          text: string;
        } | null;
        hasWikiEnabled: boolean;
        mentionableUsers: { totalCount: number };
      };
    }>;
  };
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: { spdx_id: string } | null;
  owner: { login: string; avatar_url: string };
  homepage: string | null;
  default_branch: string;
}

/**
 * Search GitHub repositories using GitHub GraphQL API (for AI search)
 * This uses octokit.graphql() which sends requests to https://api.github.com/graphql
 */
export async function searchWithGraphQL(graphqlQuery: string): Promise<Project[]> {
  // Warn if no token is provided
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ No GitHub token found. GraphQL API has strict rate limits without authentication.');
    console.warn('💡 Add VITE_GITHUB_TOKEN to your .env file to increase limits from 60 to 5000 requests/hour');
  }
  
  // Check cache first
  const cacheKey = generateCacheKey('graphql-search', { query: graphqlQuery });
  const cached = cacheService.get<Project[]>(cacheKey);
  
  if (cached) {
    console.log('✓ Returning cached GitHub GraphQL search results');
    return cached;
  }

  try {
    console.log('🔍 Executing GitHub GraphQL API query:', graphqlQuery);
    console.log('📡 Endpoint: https://api.github.com/graphql');

    const query = `
      query SearchRepositories($searchQuery: String!, $first: Int!) {
        search(query: $searchQuery, type: REPOSITORY, first: $first) {
          repositoryCount
          edges {
            node {
              ... on Repository {
                id
                name
                nameWithOwner
                description
                url
                stargazerCount
                forkCount
                watchers { totalCount }
                issues(states: OPEN) { totalCount }
                pullRequests(states: OPEN) { totalCount }
                primaryLanguage { name }
                repositoryTopics(first: 10) {
                  edges {
                    node { topic { name } }
                  }
                }
                licenseInfo { name }
                createdAt
                updatedAt
                pushedAt
                
                # For health score calculation
                defaultBranchRef {
                  target {
                    ... on Commit {
                      history(first: 100) {
                        totalCount
                        edges {
                          node {
                            committedDate
                            author { user { login } }
                          }
                        }
                      }
                    }
                  }
                }
                
                # Documentation
                object(expression: "HEAD:README.md") {
                  ... on Blob { text }
                }
                hasWikiEnabled
                
                # Contributors
                mentionableUsers(first: 100) { totalCount }
              }
            }
          }
        }
      }
    `;

    const result = await octokit.graphql<GraphQLSearchResult>(query, {
      searchQuery: graphqlQuery,
      first: 20,
    });

    console.log('✅ GitHub GraphQL API returned', result.search.edges.length, 'repositories');

    if (result.search.edges.length === 0) {
      console.warn('No repositories found for GraphQL query:', graphqlQuery);
      return [];
    }

    // Transform GraphQL results to Project format
    const projects = await Promise.all(
      result.search.edges.map(async ({ node: repo }) => {
        const healthData = calculateGraphQLHealthScore(repo);
        
        const lastCommitDate = new Date(repo.pushedAt);
        const now = new Date();
        const lastCommitDaysAgo = Math.floor(
          (now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: repo.nameWithOwner,
          name: repo.name,
          fullName: repo.nameWithOwner,
          description: repo.description || 'No description available',
          url: repo.url,
          healthScore: healthData.score,
          healthBreakdown: healthData.breakdown,
          stats: {
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            watchers: repo.watchers.totalCount,
            openIssues: repo.issues.totalCount,
            lastCommit: repo.pushedAt,
            lastCommitDaysAgo,
            contributors: repo.mentionableUsers.totalCount,
            license: repo.licenseInfo?.name || 'Unknown',
          },
          topics: repo.repositoryTopics.edges.map(e => e.node.topic.name),
          language: repo.primaryLanguage?.name || 'Unknown',
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
        };
      })
    );

    // Sort by health score
    const sortedProjects = projects.sort((a, b) => b.healthScore - a.healthScore);
    
    // Cache the results
    cacheService.set(cacheKey, sortedProjects, CACHE_TTL.SEARCH_RESULTS);
    
    return sortedProjects;
  } catch (error: any) {
    console.error('❌ GitHub GraphQL search error:', error);
    
    // Check if it's a token/permission issue
    if (error.status === 401 || error.status === 403) {
      const tokenIssue = !GITHUB_TOKEN 
        ? 'No GitHub token provided' 
        : 'GitHub token lacks GraphQL API permissions';
      
      throw new Error(
        `${tokenIssue}. Please:\n` +
        `1. Generate a token at https://github.com/settings/tokens/new\n` +
        `2. Enable these scopes: public_repo, read:org, read:user\n` +
        `3. Add it to your .env file as VITE_GITHUB_TOKEN=your_token\n` +
        `4. Restart the dev server`
      );
    }
    
    // Check if it's a rate limit issue
    if (error.message?.includes('quota exhausted') || error.message?.includes('rate limit')) {
      throw new Error(
        'GitHub GraphQL API rate limit exceeded. Please:\n' +
        '1. Wait a few minutes and try again\n' +
        '2. Or add a GitHub Personal Access Token to increase limits\n' +
        '3. Without a token: 60 requests/hour\n' +
        '4. With a token: 5000 requests/hour'
      );
    }
    
    throw error;
  }
}

export async function searchGitHubRepos(
  query: string,
  filters: SearchFilters = {}
): Promise<Project[]> {
  // Check cache first
  const cacheKey = generateCacheKey('search', { query, ...filters });
  const cached = cacheService.get<Project[]>(cacheKey);
  
  if (cached) {
    console.log('Returning cached search results');
    return cached;
  }

  try {
    // Build GitHub search query with enhanced filters
    let searchQuery = query || '';
    
    // Multiple languages support (OR condition)
    if (filters.languages && filters.languages.length > 0) {
      const languageQuery = filters.languages.map(lang => `language:${lang}`).join(' OR ');
      searchQuery += ` (${languageQuery})`;
    }
    
    // Stars range
    if (filters.minStars && filters.maxStars) {
      searchQuery += ` stars:${filters.minStars}..${filters.maxStars}`;
    } else if (filters.minStars) {
      searchQuery += ` stars:>=${filters.minStars}`;
    } else if (filters.maxStars) {
      searchQuery += ` stars:<=${filters.maxStars}`;
    }
    
    // Forks range
    if (filters.minForks && filters.maxForks) {
      searchQuery += ` forks:${filters.minForks}..${filters.maxForks}`;
    } else if (filters.minForks) {
      searchQuery += ` forks:>=${filters.minForks}`;
    } else if (filters.maxForks) {
      searchQuery += ` forks:<=${filters.maxForks}`;
    }
    
    // Last commit (pushed date)
    if (filters.lastCommitDays) {
      const date = new Date();
      date.setDate(date.getDate() - filters.lastCommitDays);
      searchQuery += ` pushed:>=${date.toISOString().split('T')[0]}`;
    }
    
    // Created after date
    if (filters.createdAfter) {
      searchQuery += ` created:>=${filters.createdAfter}`;
    }
    
    // Pushed after date
    if (filters.pushedAfter) {
      searchQuery += ` pushed:>=${filters.pushedAfter}`;
    }

    // Topics
    if (filters.topics && filters.topics.length > 0) {
      filters.topics.forEach(topic => {
        searchQuery += ` topic:${topic}`;
      });
    }
    
    // License
    if (filters.license) {
      searchQuery += ` license:${filters.license}`;
    }
    
    // Boolean filters
    if (filters.hasWiki !== undefined) {
      searchQuery += ` ${filters.hasWiki ? '' : 'NOT '}wiki:true`;
    }
    
    if (filters.hasIssues !== undefined) {
      searchQuery += ` ${filters.hasIssues ? '' : 'NOT '}has:issues`;
    }
    
    if (filters.hasProjects !== undefined) {
      searchQuery += ` ${filters.hasProjects ? '' : 'NOT '}has:projects`;
    }
    
    // Archived filter (exclude archived by default)
    if (filters.archived === false || filters.archived === undefined) {
      searchQuery += ` archived:false`;
    }

    // Sort and order
    const sortParam = filters.sortBy || 'stars';
    const orderParam = filters.order || 'desc';

    console.log('Executing GitHub REST API search with query:', searchQuery);

    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `${GITHUB_API}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sortParam}&order=${orderParam}&per_page=30`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please add a GitHub token to your .env file.');
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const repos: GitHubRepo[] = data.items || [];

    console.log('GitHub API returned', repos.length, 'repositories');

    if (repos.length === 0) {
      console.warn('No repositories found for query:', searchQuery);
      return [];
    }

    // Fetch additional details and calculate health scores
    const projects = await Promise.all(
      repos.slice(0, 20).map(async (repo) => {
        const [healthData, contributorCount] = await Promise.all([
          calculateDetailedHealthScore(repo),
          getContributorCount(repo.full_name),
        ]);
        
        const lastCommitDate = new Date(repo.pushed_at);
        const now = new Date();
        const lastCommitDaysAgo = Math.floor(
          (now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: repo.full_name,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || 'No description available',
          url: repo.html_url,
          healthScore: healthData.score,
          healthBreakdown: healthData.breakdown,
          stats: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
            openIssues: repo.open_issues_count,
            lastCommit: repo.pushed_at,
            lastCommitDaysAgo,
            contributors: contributorCount,
            license: repo.license?.spdx_id || 'Unknown',
          },
          topics: repo.topics || [],
          language: repo.language || 'Unknown',
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
        };
      })
    );

    // Sort by health score
    const sortedProjects = projects.sort((a, b) => b.healthScore - a.healthScore);
    
    // Cache the results
    cacheService.set(cacheKey, sortedProjects, CACHE_TTL.SEARCH_RESULTS);
    
    return sortedProjects;
  } catch (error) {
    console.error('GitHub search error:', error);
    throw error;
  }
}

async function getContributorCount(fullName: string): Promise<number> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${fullName}/contributors?per_page=1`,
      { headers }
    );
    
    if (response.ok) {
      const linkHeader = response.headers.get('Link');
      if (linkHeader) {
        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
        return match ? parseInt(match[1]) : 1;
      } else {
        const contributors = await response.json();
        return Array.isArray(contributors) ? contributors.length : 0;
      }
    }
    return 0;
  } catch (e) {
    console.warn(`Failed to fetch contributors for ${fullName}`);
    return 0;
  }
}

async function calculateDetailedHealthScore(repo: GitHubRepo): Promise<{ score: number; breakdown: HealthBreakdown }> {
  const breakdown: HealthBreakdown = {
    commitFrequency: { score: 0, value: 0, unit: 'days', weight: 20 },
    issueResponseTime: { score: 0, value: 0, unit: 'ratio', weight: 15 },
    prMergeRate: { score: 0, value: 0, unit: '%', weight: 15 },
    contributorDiversity: { score: 0, value: 0, unit: 'count', weight: 10 },
    documentationQuality: { score: 0, value: 0, unit: 'score', weight: 15 },
    dependencyFreshness: { score: 0, value: 0, unit: 'days', weight: 10 },
    communityGrowth: { score: 0, value: 0, unit: 'stars/day', weight: 10 },
    breakingChangeFrequency: { score: 0, value: 0, unit: 'stability', weight: 5 },
  };

  // 1. Commit frequency & recency (20%)
  const daysSinceLastCommit = Math.floor(
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  breakdown.commitFrequency.value = daysSinceLastCommit;
  breakdown.commitFrequency.score = Math.max(0, Math.min(100, 100 - (daysSinceLastCommit / 3)));

  // 2. Issue response time (15%) - estimated from open issues ratio
  const totalIssuesEstimate = repo.open_issues_count + (repo.stargazers_count / 10);
  const issueRatio = repo.open_issues_count / Math.max(totalIssuesEstimate, 1);
  breakdown.issueResponseTime.value = parseFloat(issueRatio.toFixed(2));
  breakdown.issueResponseTime.score = Math.max(0, Math.min(100, 100 - (issueRatio * 100)));

  // 3. PR merge rate (15%) - estimated from activity
  const activityScore = daysSinceLastCommit < 7 ? 95 : 
                       daysSinceLastCommit < 30 ? 85 : 
                       daysSinceLastCommit < 90 ? 65 : 
                       daysSinceLastCommit < 180 ? 45 : 30;
  breakdown.prMergeRate.value = activityScore;
  breakdown.prMergeRate.score = activityScore;

  // 4. Contributor diversity (10%) - based on forks/stars ratio
  const contributorEstimate = Math.min(100, (repo.forks_count / Math.max(repo.stargazers_count / 50, 1)) * 100);
  breakdown.contributorDiversity.value = repo.forks_count;
  breakdown.contributorDiversity.score = contributorEstimate;

  // 5. Documentation quality (15%) - has description, topics, license, readme
  let docScore = 0;
  let docMetrics = 0;
  
  if (repo.description && repo.description.length > 20) {
    docScore += 35;
    docMetrics += 1;
  }
  if (repo.topics && repo.topics.length > 0) {
    docScore += 30;
    docMetrics += repo.topics.length;
  }
  if (repo.license) {
    docScore += 25;
    docMetrics += 1;
  }
  if (repo.homepage) {
    docScore += 10;
    docMetrics += 1;
  }
  
  breakdown.documentationQuality.value = docMetrics;
  breakdown.documentationQuality.score = docScore;

  // 6. Dependency freshness (10%) - based on last update
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  breakdown.dependencyFreshness.value = daysSinceUpdate;
  breakdown.dependencyFreshness.score = Math.max(0, Math.min(100, 100 - (daysSinceUpdate / 3)));

  // 7. Community growth (10%) - stars per day since creation
  const ageInDays = Math.max(1, Math.floor(
    (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const starsPerDay = repo.stargazers_count / ageInDays;
  const growthScore = Math.min(100, starsPerDay * 20);
  breakdown.communityGrowth.value = parseFloat(starsPerDay.toFixed(2));
  breakdown.communityGrowth.score = growthScore;

  // 8. Breaking change frequency (5%) - stability bonus for mature projects
  const stabilityScore = ageInDays > 365 ? 100 : ageInDays > 180 ? 90 : 80;
  breakdown.breakingChangeFrequency.value = ageInDays;
  breakdown.breakingChangeFrequency.score = stabilityScore;

  // Calculate total weighted score
  let totalScore = 0;
  totalScore += breakdown.commitFrequency.score * 0.20;
  totalScore += breakdown.issueResponseTime.score * 0.15;
  totalScore += breakdown.prMergeRate.score * 0.15;
  totalScore += breakdown.contributorDiversity.score * 0.10;
  totalScore += breakdown.documentationQuality.score * 0.15;
  totalScore += breakdown.dependencyFreshness.score * 0.10;
  totalScore += breakdown.communityGrowth.score * 0.10;
  totalScore += breakdown.breakingChangeFrequency.score * 0.05;

  return {
    score: Math.round(Math.min(100, Math.max(0, totalScore))),
    breakdown,
  };
}

/**
 * Calculate health score from GraphQL repository data
 */
function calculateGraphQLHealthScore(repo: GraphQLSearchResult['search']['edges'][0]['node']): { score: number; breakdown: HealthBreakdown } {
  const breakdown: HealthBreakdown = {
    commitFrequency: { score: 0, value: 0, unit: 'days', weight: 20 },
    issueResponseTime: { score: 0, value: 0, unit: 'ratio', weight: 15 },
    prMergeRate: { score: 0, value: 0, unit: '%', weight: 15 },
    contributorDiversity: { score: 0, value: 0, unit: 'count', weight: 10 },
    documentationQuality: { score: 0, value: 0, unit: 'score', weight: 15 },
    dependencyFreshness: { score: 0, value: 0, unit: 'days', weight: 10 },
    communityGrowth: { score: 0, value: 0, unit: 'stars/day', weight: 10 },
    breakingChangeFrequency: { score: 0, value: 0, unit: 'stability', weight: 5 },
  };

  // 1. Commit frequency & recency (20%)
  const daysSinceLastCommit = Math.floor(
    (Date.now() - new Date(repo.pushedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  breakdown.commitFrequency.value = daysSinceLastCommit;
  breakdown.commitFrequency.score = Math.max(0, Math.min(100, 100 - (daysSinceLastCommit / 3)));

  // 2. Issue response time (15%) - estimated from open issues ratio
  const totalIssuesEstimate = repo.issues.totalCount + (repo.stargazerCount / 10);
  const issueRatio = repo.issues.totalCount / Math.max(totalIssuesEstimate, 1);
  breakdown.issueResponseTime.value = parseFloat(issueRatio.toFixed(2));
  breakdown.issueResponseTime.score = Math.max(0, Math.min(100, 100 - (issueRatio * 100)));

  // 3. PR merge rate (15%) - estimated from activity
  const activityScore = daysSinceLastCommit < 7 ? 95 : 
                       daysSinceLastCommit < 30 ? 85 : 
                       daysSinceLastCommit < 90 ? 65 : 
                       daysSinceLastCommit < 180 ? 45 : 30;
  breakdown.prMergeRate.value = activityScore;
  breakdown.prMergeRate.score = activityScore;

  // 4. Contributor diversity (10%)
  const contributorCount = repo.mentionableUsers.totalCount;
  const contributorEstimate = Math.min(100, Math.log10(Math.max(contributorCount, 1)) * 30);
  breakdown.contributorDiversity.value = contributorCount;
  breakdown.contributorDiversity.score = contributorEstimate;

  // 5. Documentation quality (15%)
  let docScore = 0;
  let docMetrics = 0;
  
  if (repo.description && repo.description.length > 20) {
    docScore += 35;
    docMetrics += 1;
  }
  if (repo.repositoryTopics.edges.length > 0) {
    docScore += 30;
    docMetrics += repo.repositoryTopics.edges.length;
  }
  if (repo.licenseInfo) {
    docScore += 25;
    docMetrics += 1;
  }
  if (repo.object && repo.object.text && repo.object.text.length > 500) {
    docScore += 10;
    docMetrics += 1;
  }
  
  breakdown.documentationQuality.value = docMetrics;
  breakdown.documentationQuality.score = docScore;

  // 6. Dependency freshness (10%) - based on last update
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  breakdown.dependencyFreshness.value = daysSinceUpdate;
  breakdown.dependencyFreshness.score = Math.max(0, Math.min(100, 100 - (daysSinceUpdate / 3)));

  // 7. Community growth (10%) - stars per day since creation
  const ageInDays = Math.max(1, Math.floor(
    (Date.now() - new Date(repo.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const starsPerDay = repo.stargazerCount / ageInDays;
  const growthScore = Math.min(100, starsPerDay * 20);
  breakdown.communityGrowth.value = parseFloat(starsPerDay.toFixed(2));
  breakdown.communityGrowth.score = growthScore;

  // 8. Breaking change frequency (5%) - stability bonus for mature projects
  const stabilityScore = ageInDays > 365 ? 100 : ageInDays > 180 ? 90 : 80;
  breakdown.breakingChangeFrequency.value = ageInDays;
  breakdown.breakingChangeFrequency.score = stabilityScore;

  // Calculate total weighted score
  let totalScore = 0;
  totalScore += breakdown.commitFrequency.score * 0.20;
  totalScore += breakdown.issueResponseTime.score * 0.15;
  totalScore += breakdown.prMergeRate.score * 0.15;
  totalScore += breakdown.contributorDiversity.score * 0.10;
  totalScore += breakdown.documentationQuality.score * 0.15;
  totalScore += breakdown.dependencyFreshness.score * 0.10;
  totalScore += breakdown.communityGrowth.score * 0.10;
  totalScore += breakdown.breakingChangeFrequency.score * 0.05;

  return {
    score: Math.round(Math.min(100, Math.max(0, totalScore))),
    breakdown,
  };
}

/**
 * Search repositories from natural language query
 * Combines Gemini AI query parsing + GitHub GraphQL API search
 * 
 * Flow:
 * 1. User enters: "Popular TypeScript web frameworks"
 * 2. Gemini parses to: "language:TypeScript topic:web stars:>1000"
 * 3. GitHub GraphQL API executes the search
 * 4. Returns projects with health scores
 */
export async function searchReposFromNaturalQuery(naturalQuery: string): Promise<Project[]> {
  const { parseNaturalLanguageQuery } = await import('./gemini');
  
  console.log('🤖 Parsing natural language query with Gemini AI:', naturalQuery);
  const parsed = await parseNaturalLanguageQuery(naturalQuery);
  
  console.log('📝 Generated GraphQL query:', parsed.graphqlQuery);
  console.log('🎯 Confidence:', `${(parsed.confidence * 100).toFixed(0)}%`);
  
  const projects = await searchWithGraphQL(parsed.graphqlQuery);
  return projects;
}
