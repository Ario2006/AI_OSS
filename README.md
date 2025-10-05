<div align="center">

<img src="public/Logo.png" alt="Discover.oss Logo" width="120" height="120">

# 🚀 Discover.oss

### AI-Powered Open Source Discovery Platform

**Find quality repositories with intelligent search and 8-metric health analysis**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Documentation](#features) • [Getting Started](#quick-start)

![Discover.oss Screenshot](public/placeholder.svg)

</div>

---

## ✨ What is Discover.oss?

**Discover.oss** is a next-generation repository discovery platform that goes beyond simple star counts. Using **Google Gemini AI** and a comprehensive **8-metric health scoring system**, it helps developers find truly quality open-source projects that are well-maintained, documented, and community-driven.

### 🎯 Why Discover.oss?

| Traditional GitHub Search | 🚀 Discover.oss |
|---------------------------|-----------------|
| ⭐ Just star counts | 📊 8-metric health analysis |
| 🔍 Keyword matching only | 🤖 AI-powered natural language search |
| 📝 No quality indicators | ✅ Comprehensive health breakdown |
| 🎲 Unpredictable results | 🎯 Intelligent filtering & sorting |

---

## 🌟 Key Features

### 🤖 AI-Powered Search
- **Natural Language Processing** via Google Gemini AI
- Understands queries like *"Find lightweight TypeScript web frameworks with good documentation"*
- Automatic query-to-filter conversion
- Fallback keyword parsing for offline mode

### 📊 Comprehensive Health Scoring

**8-Metric Analysis System:**

| Metric | Weight | What It Measures |
|--------|--------|------------------|
| 🔄 **Commit Frequency** | 20% | Last commit recency & activity |
| 🎫 **Issue Response** | 15% | Open/closed issue ratio |
| 🔀 **PR Merge Rate** | 15% | Active code review indicators |
| 👥 **Contributor Diversity** | 10% | Fork & contributor counts |
| 📚 **Documentation** | 15% | README, license, topics, homepage |
| 📦 **Dependency Freshness** | 10% | Last update recency |
| 📈 **Community Growth** | 10% | Stars-per-day growth rate |
| 🛡️ **Stability** | 5% | Project age & maturity |

**Visual Health Indicators:**
- 🟢 **70-100:** Excellent (Healthy, active project)
- 🟡 **40-69:** Moderate (Decent but needs attention)
- 🔴 **0-39:** Poor (Potentially abandoned)

### 🎨 Modern UI/UX

- ⚡ **Electric Lime (#BFFF00)** theme on deep black background
- 🔮 **Glassmorphism** design elements
- 🌊 **Smooth animations** powered by Framer Motion
- 📱 **Fully responsive** (mobile, tablet, desktop)
- ♿ **Accessible** with ARIA labels and keyboard navigation

### 🔍 Powerful Filtering

**Manual Filters:**
- 💻 **Multiple Languages** - Select TypeScript, JavaScript, Python, etc.
- ⭐ **Stars Range** - Minimum/maximum star counts
- 🔱 **Forks Range** - Filter by fork counts
- 📅 **Last Commit** - Within days/weeks/months
- 📜 **License** - MIT, Apache, GPL, BSD, ISC, etc.
- 📖 **Has Wiki** - Documentation availability
- 🎫 **Has Issues** - Issue tracking enabled
- 🗄️ **Exclude Archived** - Filter out archived repos

### ⚡ Performance Optimizations

- 🗄️ **Smart Caching** - 1hr search cache, 24hr health score cache
- 🚀 **Instant Results** - In-memory cache with TTL
- 📦 **Code Splitting** - Optimized bundle sizes
- 🎭 **Skeleton Loading** - Beautiful loading states

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript 5.8, Vite 5.4 |
| **Styling** | Tailwind CSS 3.4, shadcn/ui components |
| **State** | Zustand 5.0 for global state management |
| **AI** | Google Gemini AI (gemini-1.5-flash) |
| **APIs** | GitHub REST API, GitHub GraphQL (Octokit 5.0) |
| **Data Fetching** | TanStack Query 5.8, Axios 1.12 |
| **Animations** | Framer Motion 12.2 |
| **Charts** | Recharts 2.15 (Radar charts) |
| **Icons** | Lucide React 0.462 |
| **Notifications** | Sonner 1.7 (Toast messages) |

</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun** package manager
- **GitHub Personal Access Token** ([Create one here](https://github.com/settings/tokens))
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ario2006/AI_OSS.git
cd AI_OSS

# 2. Install dependencies
npm install
# or
bun install

# 3. Create environment file
cp .env.example .env

# 4. Add your API keys to .env
# VITE_GITHUB_TOKEN=your_github_token_here
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 5. Start development server
npm run dev
# or
bun run dev
```

The app will be running at **http://localhost:8080** 🎉

---

## 📖 Usage

### AI-Powered Search

Simply describe what you're looking for in natural language:

```
"Find lightweight TypeScript web frameworks with good documentation"
"Show me Python data science libraries maintained this year"
"Popular Go microservice frameworks with recent activity"
"Rust CLI tools with active communities"
```

The AI understands:
- **Languages**: TypeScript, Python, JavaScript, Go, Rust, etc.
- **Topics**: web, ML/AI, CLI, DevOps, blockchain, etc.
- **Quality**: "well-documented", "active", "maintained", "popular"
- **Licenses**: MIT, Apache, GPL, etc.
- **Activity**: "recent", "trending", "this year", "this month"

### Manual Filtering

For precise control, use the **Filter Panel**:

1. **Select Languages** - Choose multiple (OR condition)
2. **Set Star Range** - Minimum stars (0-10,000+)
3. **Set Fork Range** - Minimum forks (0-5,000+)
4. **Last Commit** - Within 1 week to 1 year
5. **Advanced Options** - License, Wiki, Issues, Archived

Click **"Apply Filters"** to search!

### Understanding Health Scores

Click any project card to view:

- 📊 **Health Overview** - Overall score with color coding
- 📈 **Interactive Radar Chart** - Visual metric breakdown
- 📋 **Detailed Metrics** - Each metric with explanation
- 📦 **Project Details** - Stars, forks, topics, license

---

## 🏗️ Project Structure

```
AI_OSS/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AISearchPanel.tsx      # AI search interface
│   │   ├── FilterPanelNew.tsx     # Manual filter panel
│   │   ├── ProjectCard.tsx        # Repository card
│   │   ├── ProjectModal.tsx       # Health breakdown modal
│   │   ├── ResultsGrid.tsx        # Results display
│   │   └── HealthBadge.tsx        # Health score badge
│   ├── lib/                # Core utilities
│   │   ├── gemini.ts              # Gemini AI integration
│   │   ├── github.ts              # GitHub API client
│   │   ├── cache.ts               # Caching system
│   │   └── utils.ts               # Helper functions
│   ├── pages/              # Route pages
│   │   ├── Index.tsx              # Main landing page
│   │   └── NotFound.tsx           # 404 page
│   ├── store/              # State management
│   │   └── searchStore.ts         # Zustand store
│   ├── types/              # TypeScript types
│   │   └── project.ts             # Type definitions
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Root component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
│   ├── Logo.png           # App logo
│   └── favicon.ico        # Favicon
├── .env.example           # Environment template
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# GitHub Personal Access Token (required)
# Get it from: https://github.com/settings/tokens
VITE_GITHUB_TOKEN=ghp_your_token_here

# Google Gemini API Key (required for AI search)
# Get it from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### How to Get API Keys

#### GitHub Token:
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Select scopes: `public_repo`, `read:user`
4. Copy the token and add to `.env`

#### Gemini API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key and add to `.env`

---

## 📦 Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ario2006/AI_OSS)

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Other Platforms

- **Cloudflare Pages**: Build command: `npm run build`, Publish directory: `dist`
- **GitHub Pages**: Use `gh-pages` package
- **Railway**: Connect repo and add env vars
- **Render**: Static site, Build: `npm run build`, Publish: `dist`

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Electric Lime** | `#BFFF00` | Primary accent, buttons, highlights |
| **Deep Black** | `#0A0F0D` | Background, dark elements |
| **Gray-Green** | `#8A9A8E` | Secondary text, muted elements |
| **Dark Green** | `#0D1F14` | Gradient backgrounds |

### Typography

- **Headings**: System font stack (Inter, SF Pro, Segoe UI)
- **Body**: Sans-serif stack
- **Code**: Monospace (Fira Code, Monaco, Consolas)

### Spacing Scale

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- ✅ Write **TypeScript** (no `any` types)
- ✅ Follow **Tailwind CSS** conventions
- ✅ Add **JSDoc comments** for functions
- ✅ Test on **mobile devices**
- ✅ Keep **accessibility** in mind
- ✅ Use **semantic HTML**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Lucide](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[TanStack Query](https://tanstack.com/query)** - Data fetching
- **[Recharts](https://recharts.org/)** - Charting library
- **[Google Gemini AI](https://ai.google.dev/)** - Natural language processing
- **[GitHub API](https://docs.github.com/)** - Repository data

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea?

- **Bug Reports**: [Open an issue](https://github.com/Ario2006/AI_OSS/issues)
- **Feature Requests**: [Start a discussion](https://github.com/Ario2006/AI_OSS/discussions)
- **Security Issues**: Email security@example.com (do not open public issues)

---

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Ario2006/AI_OSS?style=social)
![GitHub forks](https://img.shields.io/github/forks/Ario2006/AI_OSS?style=social)
![GitHub issues](https://img.shields.io/github/issues/Ario2006/AI_OSS)
![GitHub license](https://img.shields.io/github/license/Ario2006/AI_OSS)

</div>

---

## 🔗 Links

- **Repository**: [github.com/Ario2006/AI_OSS](https://github.com/Ario2006/AI_OSS)
- **Live Demo**: [Coming Soon](#)
- **Documentation**: [See above](#features)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

<div align="center">

**Built with ❤️ using React, TypeScript, and AI**

*Making open-source discovery intelligent, one repository at a time.*

⭐ **Star this repo if you find it useful!** ⭐

</div>
