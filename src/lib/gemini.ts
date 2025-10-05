import { GoogleGenerativeAI } from '@google/generative-ai';
import { SearchFilters } from '@/types/project';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ParsedQuery {
  filters: SearchFilters;
  graphqlQuery: string;
  confidence: number;
}

export async function parseNaturalLanguageQuery(query: string): Promise<ParsedQuery> {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return fallbackParser(query);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert GitHub repository search query generator. Your task is to convert natural language queries into precise GitHub search parameters and GraphQL queries.

USER QUERY: "${query}"

INSTRUCTIONS:
1. Analyze the query carefully for implicit and explicit requirements
2. Extract all relevant search parameters
3. Generate a comprehensive GitHub search query
4. Provide confidence score based on query clarity

SUPPORTED PARAMETERS:
- languages: array of programming languages (e.g., ["TypeScript", "JavaScript"])
- minStars, maxStars: star count range
- minForks, maxForks: fork count range  
- lastCommitDays: days since last commit (7, 30, 90, 180, 365)
- topics: array of topic tags (e.g., ["web", "framework", "cli"])
- license: specific license (MIT, Apache-2.0, GPL-3.0, etc.)
- hasWiki: boolean - has wiki documentation
- hasIssues: boolean - has issues enabled
- sortBy: "stars" | "forks" | "updated" | "help-wanted-issues"
- archived: boolean - include archived repos

KEYWORD INTERPRETATION:
- "popular" → minStars: 1000+
- "well-maintained" → lastCommitDays: 90
- "active" / "recent" → lastCommitDays: 30
- "trending" → sortBy: "stars", lastCommitDays: 180
- "beginner-friendly" → topics: ["good-first-issue"], hasIssues: true
- "production-ready" → minStars: 500, lastCommitDays: 90
- "lightweight" → minForks: 0-100
- "enterprise" → minStars: 2000+, license: "Apache-2.0"
- "this year" → created:>YYYY-01-01
- "documented" → hasWiki: true

GITHUB SEARCH SYNTAX RULES:
- Multiple languages: (language:TypeScript OR language:JavaScript)
- Star range: stars:100..1000 or stars:>500
- Date filters: pushed:>YYYY-MM-DD, created:>YYYY-MM-DD
- Topics: topic:web topic:framework (AND condition)
- License: license:MIT
- Boolean: has:wiki, has:issues, archived:false
- Always add: is:public archived:false (unless specified)

RESPONSE FORMAT (JSON only, no markdown):
{
  "languages": ["TypeScript"],
  "minStars": 1000,
  "maxStars": null,
  "minForks": null,
  "maxForks": null,
  "lastCommitDays": 90,
  "topics": ["web", "framework"],
  "license": null,
  "hasWiki": true,
  "hasIssues": true,
  "hasProjects": null,
  "archived": false,
  "sortBy": "stars",
  "order": "desc",
  "graphqlQuery": "language:TypeScript topic:web topic:framework stars:>1000 pushed:>2024-07-01 has:wiki archived:false is:public",
  "confidence": 0.95,
  "interpretation": "Searching for popular TypeScript web frameworks with good documentation and active maintenance"
}

EXAMPLE QUERIES:

1. "Modern React UI libraries with TypeScript support"
→ languages: ["TypeScript", "JavaScript"], topics: ["react", "ui", "components"], minStars: 500, lastCommitDays: 180

2. "Production-ready Python ML frameworks actively maintained"
→ languages: ["Python"], topics: ["machine-learning", "deep-learning"], minStars: 1000, lastCommitDays: 90

3. "Beginner-friendly Rust CLI tools"
→ languages: ["Rust"], topics: ["cli", "command-line", "good-first-issue"], hasIssues: true, minStars: 100

4. "Enterprise Java microservices with Apache license"
→ languages: ["Java"], topics: ["microservices"], license: "Apache-2.0", minStars: 2000

5. "Trending JavaScript testing libraries this year"
→ languages: ["JavaScript"], topics: ["testing", "test"], sortBy: "stars", createdAfter: "2025-01-01"

NOW PARSE THE USER QUERY AND RESPOND WITH ONLY THE JSON OBJECT (no markdown formatting, no code blocks):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove markdown code blocks if present
    if (text.includes('```json')) {
      text = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      text = text.split('```')[1].split('```')[0].trim();
    }
    
    const parsed = JSON.parse(text);
    
    // Build SearchFilters object with validation
    const filters: SearchFilters = {};
    
    if (Array.isArray(parsed.languages) && parsed.languages.length > 0) {
      filters.languages = parsed.languages.filter((l: any) => typeof l === 'string');
    }
    
    if (typeof parsed.minStars === 'number' && parsed.minStars >= 0) {
      filters.minStars = parsed.minStars;
    }
    
    if (typeof parsed.maxStars === 'number' && parsed.maxStars >= 0) {
      filters.maxStars = parsed.maxStars;
    }
    
    if (typeof parsed.minForks === 'number' && parsed.minForks >= 0) {
      filters.minForks = parsed.minForks;
    }
    
    if (typeof parsed.maxForks === 'number' && parsed.maxForks >= 0) {
      filters.maxForks = parsed.maxForks;
    }
    
    if (typeof parsed.lastCommitDays === 'number' && parsed.lastCommitDays > 0) {
      filters.lastCommitDays = parsed.lastCommitDays;
    }
    
    if (Array.isArray(parsed.topics) && parsed.topics.length > 0) {
      filters.topics = parsed.topics.filter((t: any) => typeof t === 'string');
    }
    
    if (typeof parsed.license === 'string' && parsed.license) {
      filters.license = parsed.license;
    }
    
    if (typeof parsed.hasWiki === 'boolean') {
      filters.hasWiki = parsed.hasWiki;
    }
    
    if (typeof parsed.hasIssues === 'boolean') {
      filters.hasIssues = parsed.hasIssues;
    }
    
    if (typeof parsed.hasProjects === 'boolean') {
      filters.hasProjects = parsed.hasProjects;
    }
    
    if (typeof parsed.archived === 'boolean') {
      filters.archived = parsed.archived;
    }
    
    if (typeof parsed.sortBy === 'string') {
      filters.sortBy = parsed.sortBy as any;
    }
    
    if (typeof parsed.order === 'string') {
      filters.order = parsed.order as any;
    }
    
    return {
      filters,
      graphqlQuery: parsed.graphqlQuery || buildGraphQLQuery(filters),
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8
    };
  } catch (error) {
    console.error('Gemini AI parsing error:', error);
    return fallbackParser(query);
  }
}

function fallbackParser(query: string): ParsedQuery {
  const filters: SearchFilters = {};
  const lowerQuery = query.toLowerCase();
  
  // Detect languages
  const languages = ['typescript', 'javascript', 'python', 'go', 'rust', 'java', 'cpp', 'c++', 'csharp', 'c#', 'ruby', 'php'];
  const detectedLangs: string[] = [];
  
  for (const lang of languages) {
    if (lowerQuery.includes(lang)) {
      const normalized = lang === 'c++' || lang === 'cpp' ? 'C++' :
                        lang === 'c#' || lang === 'csharp' ? 'C#' :
                        lang.charAt(0).toUpperCase() + lang.slice(1);
      if (!detectedLangs.includes(normalized)) {
        detectedLangs.push(normalized);
      }
    }
  }
  
  if (detectedLangs.length > 0) {
    filters.languages = detectedLangs;
  }
  
  // Detect time-based filters
  if (lowerQuery.includes('recent') || lowerQuery.includes('active')) {
    filters.lastCommitDays = 30;
  } else if (lowerQuery.includes('maintained') || lowerQuery.includes('updated')) {
    filters.lastCommitDays = 90;
  }
  
  // Detect popularity
  if (lowerQuery.includes('popular') || lowerQuery.includes('trending')) {
    filters.minStars = 1000;
    filters.sortBy = 'stars';
  } else if (lowerQuery.includes('production') || lowerQuery.includes('enterprise')) {
    filters.minStars = 500;
  } else {
    filters.minStars = 100;
  }
  
  // Detect topics
  const topics: string[] = [];
  const topicKeywords = {
    'framework': 'framework',
    'cli': 'cli',
    'web': 'web',
    'api': 'api',
    'testing': 'testing',
    'ui': 'ui',
    'machine learning': 'machine-learning',
    'ml': 'machine-learning',
    'data science': 'data-science',
    'database': 'database',
    'auth': 'authentication',
    'microservice': 'microservices',
  };
  
  Object.entries(topicKeywords).forEach(([keyword, topic]) => {
    if (lowerQuery.includes(keyword) && !topics.includes(topic)) {
      topics.push(topic);
    }
  });
  
  if (topics.length > 0) {
    filters.topics = topics;
  }
  
  // Detect license
  if (lowerQuery.includes('mit')) filters.license = 'MIT';
  if (lowerQuery.includes('apache')) filters.license = 'Apache-2.0';
  
  // Detect documentation
  if (lowerQuery.includes('documented') || lowerQuery.includes('documentation')) {
    filters.hasWiki = true;
  }
  
  // Exclude archived by default
  filters.archived = false;
  
  return {
    filters,
    graphqlQuery: buildGraphQLQuery(filters),
    confidence: 0.6
  };
}

function buildGraphQLQuery(filters: SearchFilters): string {
  const parts: string[] = [];
  
  // Multiple languages with OR
  if (filters.languages && filters.languages.length > 0) {
    if (filters.languages.length === 1) {
      parts.push(`language:${filters.languages[0]}`);
    } else {
      const langQuery = filters.languages.map(lang => `language:${lang}`).join(' OR ');
      parts.push(`(${langQuery})`);
    }
  }
  
  // Topics
  if (filters.topics && filters.topics.length > 0) {
    filters.topics.forEach(topic => {
      parts.push(`topic:${topic}`);
    });
  }
  
  // Stars
  if (filters.minStars && filters.maxStars) {
    parts.push(`stars:${filters.minStars}..${filters.maxStars}`);
  } else if (filters.minStars) {
    parts.push(`stars:>${filters.minStars}`);
  } else if (filters.maxStars) {
    parts.push(`stars:<${filters.maxStars}`);
  }
  
  // Forks
  if (filters.minForks && filters.maxForks) {
    parts.push(`forks:${filters.minForks}..${filters.maxForks}`);
  } else if (filters.minForks) {
    parts.push(`forks:>${filters.minForks}`);
  }
  
  // Last commit
  if (filters.lastCommitDays) {
    const date = new Date();
    date.setDate(date.getDate() - filters.lastCommitDays);
    const dateStr = date.toISOString().split('T')[0];
    parts.push(`pushed:>${dateStr}`);
  }
  
  // License
  if (filters.license) {
    parts.push(`license:${filters.license}`);
  }
  
  // Boolean filters
  if (filters.hasWiki) {
    parts.push('has:wiki');
  }
  
  if (filters.hasIssues) {
    parts.push('has:issues');
  }
  
  if (filters.hasProjects) {
    parts.push('has:projects');
  }
  
  // Always add these
  parts.push('is:public');
  
  if (filters.archived === false || filters.archived === undefined) {
    parts.push('archived:false');
  }
  
  return parts.join(' ');
}

export async function enhanceSearchQuery(query: string, parsedQuery: ParsedQuery): Promise<string> {
  const parts: string[] = [];
  const filters = parsedQuery.filters;
  
  if (filters.languages && filters.languages.length > 0) {
    parts.push(`${filters.languages.join('/')} projects`);
  }
  if (filters.topics && filters.topics.length > 0) {
    parts.push(`related to ${filters.topics.join(', ')}`);
  }
  if (filters.minStars) {
    parts.push(`with ${filters.minStars.toLocaleString()}+ stars`);
  }
  if (filters.lastCommitDays) {
    const timeframe = filters.lastCommitDays <= 30 ? 'recently' : 
                     filters.lastCommitDays <= 90 ? 'in the last 3 months' :
                     'this year';
    parts.push(`updated ${timeframe}`);
  }
  if (filters.license) {
    parts.push(`with ${filters.license} license`);
  }
  
  return parts.length > 0 ? parts.join(' ') : query || 'all repositories';
}
