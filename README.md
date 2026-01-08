<div align="center">

# 🚀 SkillVerse_AI

### AI-Powered Career Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

**Transform your career with AI-driven insights.** Analyze resumes, optimize profiles, and generate personalized roadmaps—all in one intelligent platform.

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Demo](#-demo)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Judge Highlights](#-judge-highlights)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**SkillVerse_AI** is a comprehensive career intelligence platform that leverages cutting-edge AI (Google Gemini) to help job seekers optimize their professional presence. The platform combines resume analysis, profile scanning, and personalized career planning into a seamless, intuitive experience.

## ✨ Highlights

- **3D Hero Experience**: Interactive Three.js scene with subtle parallax, optimized for GPU performance and mobile safety.
- **AI Resilience**: Multi-key rotation with automatic failover across Gemini API keys prevents downtime under free-tier quotas.
- **LinkedIn Vision Critique**: Image + text analysis with strict JSON schema, focused on issues only; photo quality report with actionable fixes.
- **Resume Intelligence**: ATS scoring, skill gap detection, tailored rewrites, and an optional “SAVAGE” roast mode for brutally honest feedback.
- **Personalized Roadmaps**: 3–6 week plans by skill level with curated YouTube resources and progress stats (weeks, tasks, projects, hours).
- **Modern UI/UX**: Glassmorphism cards, scroll-in animations, hover shine effects, and mobile-first responsive layouts.
- **Performance by Design**: Lazy-loaded routes, batched state updates, minimal payloads, and clean async flows.
- **Security & Hygiene**: JWT auth, input validation, rate-limit resilience, temporary file cleanup, and least-privilege patterns.
- **Developer Experience**: Clear API contracts, modular controllers, reusable hooks, and shared motion variants for consistent animations.

## 🧩 Problem Statement

Skill gaps and employment readiness are hard to measure consistently. Job seekers often lack clear feedback on which skills are missing, how to tailor their resume to target roles, and whether their online presence (LinkedIn/GitHub) aligns with employer expectations. Traditional job portals and resume builders rarely provide actionable, AI-backed diagnostics across resume, ATS, LinkedIn visuals, and GitHub activity.

## 🧠 Solution Overview

SkillVerse_AI detects skill gaps and evaluates employment readiness using multi-source signals:
- AI-powered resume audit: ATS score, strengths/weaknesses, missing skills
- Resume tailoring: role-specific rewrites with keyword enhancement
- LinkedIn visual critique: photo quality, headline optimization, action checklist
- GitHub analysis: tech stack, project quality, contribution patterns
- Roadmap generator: personalized 3–6 week learning plans to close gaps

Together, these produce a clear improvement path: diagnose → tailor → learn → showcase.

### Why SkillVerse_AI?

- 🎯 **ATS Optimization**: Beat applicant tracking systems with AI-powered resume analysis
- 🔍 **Multi-Platform Scanning**: Analyze GitHub contributions and LinkedIn profiles
- 🗺️ **Smart Roadmaps**: Generate personalized learning paths based on your goals
- 🎨 **Modern UI/UX**: Glassmorphism design with 3D elements and smooth animations
- 🔐 **Secure Authentication**: Google OAuth integration with JWT tokens
- ⚡ **Real-time AI**: Multi-key rotation system ensures uninterrupted service

---

## ✨ Features

### 🎯 Resume Intelligence Suite

#### 1. **Resume Audit & Analysis**
- **ATS Compatibility Score**: Get a percentage-based compatibility score
- **Skill Gap Detection**: Identifies critical, recommended, and nice-to-have skills
- **Career Progression**: Maps your current level to next career milestones
- **Actionable Insights**: Concrete steps to improve your resume
- **Job Recommendations**: AI-suggested roles with match confidence scores

#### 2. **Resume Tailor**
- **Job-Specific Optimization**: Customize resume for target job descriptions
- **Keyword Enhancement**: Strategic keyword placement for ATS systems
- **Multiple Input Methods**: Upload PDF, paste text, or use saved resume
- **Before/After Comparison**: See exactly what changed and why

#### 3. **Resume Roaster** 🔥
- **Three Roast Levels**: Mild (gentle), Medium (direct), Spicy (savage)
- **Human Tone**: Plain English feedback, no AI jargon
- **Constructive Criticism**: Identifies strengths, gaps, and improvements
- **Career-Focused**: Roasts the work, not the person

### 🔍 Profile Analysis Tools

#### 4. **GitHub Scanner**
- **Tech Stack Analysis**: Visualizes language distribution with interactive charts
- **Project Evaluation**: Assesses code quality, consistency, and documentation
- **Contribution Metrics**: Analyzes commit patterns and collaboration
- **Job Match Suggestions**: Recommends roles based on GitHub activity
- **Direct Job Search Links**: One-click access to LinkedIn, Indeed, and more

#### 5. **LinkedIn Profile Reviewer**
- **Visual Brand Score**: 0-100 score for first impression
- **Photo Quality Report**: Analyzes background, lighting, framing, expression
- **Headline Optimization**: AI-generated headline suggestions
- **Critical Issues**: Identifies gaps in profile completeness
- **Optimization Checklist**: Prioritized action items

#### 6. **ATS Scanner**
- **Match Percentage**: Direct comparison against job descriptions
- **Missing Keywords**: Highlights critical skills not in resume
- **Suggested Rewrite**: AI-generated improved version of resume sections
- **Real-time Analysis**: Instant feedback as you upload

### 🗺️ Career Planning

#### 7. **Roadmap Generator**
- **Personalized Learning Paths**: 3-6 week structured roadmaps
- **Skill-Based Planning**: Beginner, Intermediate, or Advanced levels
- **Weekly Breakdown**: Tasks, projects, and time estimates
- **YouTube Resources**: Curated learning videos for each skill
- **Progress Tracking**: Visual stats for weeks, tasks, projects, hours

### 🎨 User Experience

- **3D Hero Scene**: Three.js powered interactive landing
- **Glassmorphism UI**: Modern glass cards with blur effects
- **Smooth Animations**: Count-up effects, fade-ins, typewriter text
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Theme**: Eye-friendly dark mode throughout
- **Persistent State**: Zustand store with localStorage sync

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.3+ |
| **Vite** | Build Tool | 5.0+ |
| **Tailwind CSS** | Styling | 3.4+ |
| **Three.js** | 3D Graphics | Latest |
| **Recharts** | Data Visualization | 2.10+ |
| **Zustand** | State Management | 4.5+ |
| **React Router** | Navigation | 6.21+ |
| **Axios** | HTTP Client | 1.6+ |
| **Lucide React** | Icons | 0.344+ |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 18+ |
| **Express.js** | Web Framework | 4.18+ |
| **MongoDB** | Database | 6.0+ |
| **Mongoose** | ODM | 8.1+ |
| **Google Gemini AI** | AI Engine | 2.5 Flash |
| **Multer** | File Uploads | 1.4+ |
| **PDF-Parse** | PDF Extraction | 1.1+ |
| **JWT** | Authentication | 9.0+ |
| **bcryptjs** | Password Hashing | 2.4+ |

### DevOps & Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Nodemon** - Auto-restart server
- **dotenv** - Environment variables

---

## 🏗️ Architecture

### System Design

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │ ◄─────► │   Express    │ ◄─────► │   MongoDB   │
│   (React)   │  HTTPS  │   Server     │   TCP   │   Database  │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              │ API Calls
                              ▼
                        ┌──────────────┐
                        │   Gemini AI  │
                        │   (Google)   │
                        └──────────────┘
```

### Key Design Patterns

1. **Multi-Key Rotation**: Automatically rotates between API keys on quota/rate limits
2. **Middleware Pipeline**: Auth → Validation → Business Logic → Error Handling
3. **Component Composition**: Reusable UI components (GlassCard, GradientButton)
4. **Custom Hooks**: Encapsulated logic (useScanGithub, useRoadmap)
5. **Centralized State**: Zustand store with persistence
6. **Service Layer**: Separated business logic from controllers

### API Flow Example (Resume Audit)

```
User uploads PDF
    ↓
Frontend: api.js → POST /api/resume/audit
    ↓
Backend: authMiddleware → upload.js → resumeController.js
    ↓
Extract text (PDF-Parse/Mammoth)
    ↓
Send to Gemini AI with structured prompt
    ↓
Parse JSON response → Store in MongoDB
    ↓
Return structured data to frontend
    ↓
Display in ResumeAudit.jsx with charts/cards
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Install locally](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/SkillVerse_AI.git
cd SkillVerse_AI
```

#### Step 2: Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:

```env
PORT=5000

NODE_ENV=development

GEMINI_API_KEY=AIzaSyDL6I6vMnqfD6agky-RkbXdA3trcIeHU2o,AIzaSyBWTPG4euuUhuUoHs_Pi3LPKQhHUdcVKEk,AIzaSyDuNDwa4ts48gfUeE3BnIe5iHGg1oX6oBE,AIzaSyB_Vf-_YrZTptSnSu8eM5MCA5EyoTKTH20,AIzaSyAKJqhFwokv69T8si3I1QNriC51L0KvBTo

GITHUB_TOKEN=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

MONGO_URI=mongodb+srv://anishshetty124:Anish2puc@cluster0.lpaf4id.mongodb.net/skill_project?retryWrites=true&w=majority&appName=Cluster0

# Auth
JWT_SECRET=ashwinbhai
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=109106026507-71a4v63v30r1ecl1qso8c4ela59l1tc6.apps.googleusercontent.com

YOUTUBE_API_KEY=AIzaSyCbR8ntfpwWfzpldgrd_VnNzpw8tMAY_Pw
```

**Start Backend:**

```bash
npm run dev
```

Server runs on `http://localhost:5000`

#### Step 3: Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file in `client/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_API_URL=/api
```

### 🔐 Environment Variables Summary

- Server `.env`:
  - `PORT`: API port (default 5000)
  - `MONGO_URI`: MongoDB connection string (local or Atlas)
  - `JWT_SECRET`, `JWT_EXPIRES_IN`: Auth token settings
  - `GOOGLE_CLIENT_ID`: OAuth Client ID
  - `GEMINI_API_KEY`: Comma-separated list of Gemini API keys for rotation
  - `GITHUB_TOKEN` (optional): Increases GitHub API rate limits

- Client `.env`:
 VITE_GOOGLE_CLIENT_ID=109106026507-71a4v63v30r1ecl1qso8c4ela59l1tc6.apps.googleusercontent.com

# Point this to your backend server
VITE_API_URL=http://localhost:5000/api
### ▶️ Run Instructions

1) Start backend:
```bash
cd server
npm install
npm run dev
```

2) Start frontend:
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.


**Start Frontend:**

```bash
npm run dev
```

App runs on `http://localhost:5173`

#### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## ⚙️ Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (add app name, email, logo)
6. Select **Web application** as application type
7. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   ```
8. Add **Authorized redirect URIs**:
   ```
   http://localhost:5173
   ```
9. Copy the **Client ID** and paste into both `.env` files

### Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API key**
4. Copy the key and add to `server/.env` as `GEMINI_API_KEY`
5. **(Recommended)**: Create multiple API keys for rotation to avoid rate limits

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Use in .env
MONGO_URI=mongodb://localhost:27017/skillverse
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add your IP to whitelist (or allow 0.0.0.0/0 for development)
4. Create a database user
5. Get connection string and add to `.env`

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/signin`
Sign in existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### POST `/api/auth/google`
Google OAuth authentication.

**Request Body:**
```json
{
  "credential": "google_oauth_token"
}
```

### Resume Endpoints (Protected)

#### POST `/api/resume/parse`
Extract text from resume file.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
resume: <PDF/DOCX file>
```

#### POST `/api/resume/audit-text`
Comprehensive resume analysis.

**Request Body:**
```json
{
  "resumeText": "Your resume content here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "atsScore": 78,
    "profileSummary": "Mid-level Software Engineer...",
    "detectedSkills": {
      "technical": ["React", "Node.js", "MongoDB"],
      "soft": ["Communication", "Leadership"]
    },
    "skillGaps": {
      "critical": ["Docker", "Kubernetes"],
      "recommended": ["AWS", "CI/CD"],
      "niceToHave": ["GraphQL"]
    },
    "strengths": [...],
    "weaknesses": [...],
    "actionableInsights": [...],
    "recommendedJobs": [...]
  }
}
```

#### POST `/api/resume/tailor`
Tailor resume for specific job description.

**Request Body:**
```json
{
  "existingResumeText": "Your resume...",
  "jobDescription": "We are seeking..."
}
```

#### POST `/api/resume/roast`
Get playful resume feedback.

**Request Body:**
```json
{
  "resumeText": "Your resume...",
  "roastLevel": "Mild" // "Mild" | "Medium" | "Spicy"
}
```

### Profile Analysis Endpoints

#### POST `/api/github`
Analyze GitHub profile.

**Request Body:**
```json
{
  "username": "github_username"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "stats": {
        "topLanguages": [
          { "language": "JavaScript", "percentage": 45 }
        ],
        "repos": 25,
        "followers": 150
      }
    },
    "analysis": {
      "tech_stack": {
        "frontend": ["React", "Vue"],
        "backend": ["Node.js", "Python"]
      },
      "project_quality": "Strong project diversity...",
      "code_consistency": "Consistent coding style...",
      "recommended_jobs": [...]
    }
  }
}
```

#### POST `/api/linkedin`
Analyze LinkedIn profile screenshot.

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
```
screenshot: <Image file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "visual_score": 82,
    "critique": "Profile needs stronger headline...",
    "headline_suggestion": "Senior Full-Stack Developer...",
    "action_items": [...],
    "photo_report": {
      "strengths": [...],
      "issues": [...],
      "quality_score": 85
    }
  }
}
```

#### POST `/api/ats`
ATS compatibility check.

**Form Data:**
```
resume: <PDF file>
jobDescription: <String>
```

### Roadmap Endpoint

#### POST `/api/roadmap`
Generate learning roadmap.

**Request Body:**
```json
{
  "skill": "Docker",
  "currentLevel": "Beginner" // "Beginner" | "Intermediate" | "Advanced"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "week": 1,
      "focus": "Docker Fundamentals",
      "tasks": [
        "Install Docker Desktop",
        "Complete Docker tutorial",
        "Build your first container"
      ],
      "project": "Containerize a simple Node.js app",
      "resources": [...]
    }
  ]
}
```

---

## 📁 Project Structure

```
SkillVerse_AI/
│
├── client/                          # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, fonts
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   └── HeroScene.jsx    # Three.js 3D scene
│   │   │   ├── features/
│   │   │   │   ├── auth/            # Sign in/up, Google OAuth
│   │   │   │   ├── ats/             # ATS scanner
│   │   │   │   ├── github/          # GitHub analyzer
│   │   │   │   ├── linkedin/        # LinkedIn reviewer
│   │   │   │   ├── resume/          # Resume audit/tailor/roast
│   │   │   │   └── roadmap/         # Roadmap generator
│   │   │   └── ui/                  # Reusable components
│   │   │       ├── Animations.jsx   # CountUp, Typewriter
│   │   │       ├── GlassCard.jsx    # Glassmorphism card
│   │   │       ├── GradientButton.jsx
│   │   │       └── PasswordInput.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useRoadmap.js
│   │   │   ├── useScanAts.js
│   │   │   ├── useScanGithub.js
│   │   │   └── useScanLinkedin.js
│   │   ├── services/
│   │   │   └── api.js               # Axios HTTP client
│   │   ├── store/
│   │   │   └── useStore.js          # Zustand global state
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js        # Auth logic
│   │   ├── resumeController.js      # Resume operations
│   │   ├── atsController.js         # ATS scanning
│   │   ├── githubController.js      # GitHub analysis
│   │   ├── linkedinController.js    # LinkedIn review
│   │   └── roadmapController.js     # Roadmap generation
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── errorMiddleware.js       # Error handling
│   │   └── upload.js                # Multer file upload
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  # User model
│   │   └── UserProfile.js           # Profile data
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   └── apiRoutes.js             # /api/* (protected)
│   ├── services/
│   │   └── aiService.js             # AI integration layer
│   ├── utils/
│   │   └── gemini.js                # Gemini API wrapper
│   ├── uploads/                     # Temporary file storage
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Express server entry
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🎨 Design Philosophy

### UI/UX Principles

1. **Glassmorphism**: Frosted glass effects with backdrop blur
2. **Dark Theme**: Reduced eye strain, professional look
3. **3D Elements**: Interactive Three.js scene on landing
4. **Smooth Animations**: Framer Motion, CSS transitions
5. **Mobile-First**: Responsive breakpoints (sm, md, lg, xl)
6. **Accessible**: ARIA labels, keyboard navigation
7. **Performance**: Code splitting, lazy loading, optimized images

### Color Palette

```css
Primary: #6366f1 (Indigo)
Secondary: #ec4899 (Pink)
Success: #10b981 (Emerald)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
Background: #0f172a (Slate-950)
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with Google OAuth
- [ ] Upload PDF resume for audit
- [ ] Paste resume text for tailoring
- [ ] Scan GitHub username
- [ ] Upload LinkedIn screenshot
- [ ] Run ATS scanner with job description
- [ ] Generate roadmap for 3 skills (Beginner/Intermediate/Advanced)
- [ ] Test roast levels (Mild/Medium/Spicy)
- [ ] Check responsive design on mobile/tablet/desktop
- [ ] Verify persistent state after page refresh

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "GEMINI_API_KEY not found"**
- **Solution**: Ensure `.env` file exists in `server/` with valid API key

**Issue: MongoDB connection error**
- **Solution**: Check MongoDB is running or Atlas IP whitelist

**Issue: Google OAuth not working**
- **Solution**: Verify Client ID matches in both `.env` files

**Issue: File upload fails**
- **Solution**: Check `uploads/` directory exists with write permissions

**Issue: Port already in use**
- **Solution**: Change port in `.env` or kill process:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Contribution Workflow

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Code Standards

- **Frontend**: ESLint rules, Prettier formatting
- **Backend**: Follow existing patterns (MVC, async/await)
- **Commits**: Use conventional commits (feat, fix, docs, style, refactor)
- **Testing**: Add tests for new features
- **Documentation**: Update README if adding new features

---

## 📄 License

This project is licensed under the **MIT License**.


## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent features
- **MongoDB** for robust data storage
- **React Community** for excellent ecosystem
- **Three.js** for stunning 3D capabilities
- **Tailwind CSS** for rapid UI development


## 👥 Team

- Team Name: xor
- Members:
  - Anish Shetty
  - Ashwin Bairi
  - Sathyadev Nayak
  - Adithya

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/SkillVerse_AI/issues)

---

<div align="center">

### 🌟 Star this repo if it helped you!

Made with ❤️ by the SkillVerse_AI Team

[⬆ Back to Top](#-skillverse_ai)

</div>
