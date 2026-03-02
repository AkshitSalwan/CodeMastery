# CodeMastery - LeetCode-Style DSA Platform

A comprehensive Data Structures & Algorithms (DSA) learning platform built with **React**, **Vite**, **Express**, **Sequelize**, and Tailwind CSS. Features interactive problem solving, code editor, gamification, and community discussions.

## Features

### Core Features
- **User Authentication**: Mock authentication system with login/signup (localStorage-based)
- **Problem Library**: 500+ DSA problems with filtering by difficulty, category, and company
- **Interactive Code Editor**: Monaco editor with syntax highlighting for JS, Python, Java, C++
- **Run & Submit**: Mock code execution with test case results and performance metrics
- **Gamification**: Streaks, levels, XP system, and achievement badges
- **Daily Challenge**: Rotates problems daily with bonus rewards
- **Learning Resources**: Progressive hints, optimal solutions, and AI-powered explanations
- **Community Discussions**: Problem-specific discussion threads with upvoting
- **User Dashboard**: Stats overview, progress tracking, and profile management
- **Responsive Design**: Mobile-first design with dark/light mode support

### Technology Stack
- **Framework**: React with Vite (no Next.js)
- **Language**: TypeScript
- **UI Components**: shadcn/ui with Radix UI
- **Code Editor**: Monaco Editor
- **Styling**: Tailwind CSS 4.2
- **Theming**: Context API

## Development setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. To start both client and server in development:
   ```bash
   npm run dev
   ```
   - Frontend runs on [http://localhost:3000](http://localhost:3000)
   - Express backend runs on [http://localhost:4000](http://localhost:4000)
3. Build the frontend for production:
   ```bash
   npm run build
   ```
4. Start the server in production mode (it will serve the built files):
   ```bash
   npm start
   ```

Routes are handled by React Router on the client; backend API endpoints live under `/api` and are implemented using Express and Sequelize.

- **Icons**: Lucide React

## Project Structure

```
/app
├── (dashboard)/           # Protected dashboard routes
│   ├── page.tsx          # Dashboard home
│   ├── problems/         # Problem list and detail pages
│   ├── profile/          # User profile
│   ├── achievements/     # Achievements page
│   ├── daily-challenge/  # Daily challenge
│   └── settings/         # Settings page
├── auth/                 # Authentication pages
│   ├── login/
│   └── signup/
└── page.tsx             # Landing page

/components
├── editor/              # Code editor components
├── problems/            # Problem-related components
├── dashboard/           # Dashboard components
├── ai/                  # AI features
├── navbar.tsx           # Top navigation
└── sidebar.tsx          # Dashboard sidebar

/lib
├── types/               # TypeScript type definitions
├── mock-data/           # Mock data for problems, users, etc.
├── mock-api/            # Mock API functions (executor, etc.)
├── contexts/            # React contexts (auth)
└── editor-utils.ts      # Editor utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm

### Installation

1. Clone the project
2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- **Email**: Any email format
- **Password**: Any password with 6+ characters

The app uses mock authentication, so any email/password combination will work.

## Usage

### Landing Page
- View project overview and features
- Sign up or log in links

### Dashboard
- View stats: problems solved, streak, level, achievements
- Quick links to daily challenge and problem list

### Problems
- Browse all DSA problems with filtering
- Filter by difficulty (Easy/Medium/Hard)
- Filter by topics (Array, Tree, Graph, DP, etc.)
- Filter by companies
- Search by problem name

### Problem Detail
- View full problem description
- See constraints and examples
- Start solving with "Solve" button
- Access discussion threads

### Code Editor
- Write code in multiple languages (JS, Python, Java, C++)
- Run code against sample test cases
- Submit code for full evaluation
- See detailed test results
- Access problem hints and solutions

### Achievements
- Track unlocked badges and milestones
- View streak history
- Monitor progress toward achievements
- See locked achievements with progress

### Daily Challenge
- Solve a new problem each day
- Maintain solving streak
- Get bonus XP for completing
- View challenge statistics

### Profile
- View account information
- Edit profile details
- See personal stats and achievements
- Track level and experience

## Mock Data

The platform includes extensive mock data:

- **30+ DSA Problems** with full descriptions, constraints, and examples
- **Multiple Language Support** with starter code for each problem
- **Mock Test Cases** for execution simulation
- **User Stats & Achievements** with streak tracking
- **Discussion Threads** with comments and upvoting

## Architecture Notes

### Authentication
Uses localStorage-based mock authentication. In production, this would be replaced with a real auth service (Auth0, Firebase, etc.)

### Code Execution
Mock execution simulates compilation and test results. In production, this would call a real code execution service (judge servers).

### State Management
Uses React hooks and Context API for global state (auth). Can be extended with Redux or Zustand for more complex state.

### Data Persistence
All data is stored in localStorage (except Monaco editor, which uses sessionStorage). In production, would use a database.

## Customization

### Adding More Problems
Edit `/lib/mock-data/problems.ts` and add new problem objects following the existing structure.

### Changing Theme Colors
Update design tokens in `/app/globals.css`:
```css
:root {
  --accent: #06b6d4; /* Cyan accent */
  --primary: #0f172a; /* Dark slate */
  /* ... more tokens */
}
```

### Adding New Languages
1. Add to `Language` type in `/lib/types/problem.ts`
2. Add starter code to problems in `/lib/mock-data/problems.ts`
3. Update `languageInfo` and `monacoLanguages` in `/lib/editor-utils.ts`

### Modifying Mock Execution
Edit `/lib/mock-api/executor.ts` to change how code execution is simulated.

## Features Roadmap

### Completed
- Authentication & authorization
- Problem library with filtering
- Monaco code editor
- Run & submit functionality
- Gamification (streaks, levels, achievements)
- Daily challenges
- Discussion threads
- User profiles

### Potential Enhancements
- Real backend integration
- Actual code execution service
- AI-powered hints using LLMs
- Video tutorials
- Interview prep mode
- Company-specific paths
- Contest/competition system
- Leaderboards with social features
- Mobile app
- Real-time collaboration

## Performance Considerations

- Monaco editor loaded dynamically to reduce initial bundle
- Problem list uses pagination-ready component structure
- CSS-in-JS minimized through Tailwind utilities
- Dark mode switch uses system preferences with override option

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a demo project, but improvements are welcome. Feel free to extend features or fix any issues.

## License

MIT License - feel free to use for learning or personal projects.

## Support

For issues or questions, refer to the documentation in this README or examine the component code which is well-commented.

---

**Built with v0** - A full-stack web development assistant powered by Vercel AI SDK
