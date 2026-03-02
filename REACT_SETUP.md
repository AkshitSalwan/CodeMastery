# React Version - Quick Setup Guide

## File Structure Summary

All React files are in the `src/` directory. The project uses **Vite** as the build tool.

### Files to Use:

**Configuration Files (in project root):**
- `package-react.json` → Rename to `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`

**Source Code (src/ directory):**
- `src/main.jsx` - Entry point
- `src/App.jsx` - Main routing component
- `src/index.css` - Global styles with design tokens
- `src/context/` - Theme and Auth contexts
- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/data/` - Mock data

## Quick Start (Step by Step)

### Step 1: Setup Project
```bash
# Create a new directory
mkdir codemastery-react
cd codemastery-react

# Copy all files from src/ folder
# Copy configuration files: vite.config.js, tailwind.config.js, postcss.config.js, index.html
# Copy package-react.json as package.json
```

### Step 2: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 3: Start Development Server
```bash
npm run dev
# or
pnpm dev
```

Browser will open at: `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
# or
pnpm build
```

## Key Differences from Next.js Version

| Feature | Next.js | React |
|---------|---------|-------|
| Framework | Next.js | React + React Router |
| Language | TypeScript | JavaScript |
| Routing | File-based | React Router |
| Build Tool | Next.js | Vite |
| Entry Point | `app/` folder | `src/main.jsx` |
| Theme | next-themes | Context API |

## Main Pages (Routes)

1. **Home** - `/home` - Public landing page
2. **Dashboard** - `/` - Main dashboard with stats
3. **Problems** - `/problems` - Browse DSA problems
4. **Problem Detail** - `/problems/:id` - View problem
5. **Code Editor** - `/problems/:id/editor` - Solve problems ⭐
6. **Admin** - `/admin` - Analytics dashboard
7. **Bookmarks** - `/bookmarks` - Saved problems
8. **Topics** - `/topics` - Topic discovery
9. **Feedback** - `/feedback` - Submit feedback
10. **Profile** - `/profile` - User profile
11. **Login** - `/login` - Login page
12. **Signup** - `/signup` - Signup page

## Important Components

### Code Editor Page
Most feature-rich page with:
- Interactive textarea editor
- Language selector (JavaScript, Python, Java, C++)
- Run/Reset/Copy buttons
- Problem details sidebar
- Output display

### Admin Dashboard
Analytics page with:
- 4 KPI cards
- Weekly activity chart
- Difficulty distribution pie chart
- Submissions bar chart
- Recent feedback widget

### Problems Page
Problem browser with:
- Search functionality
- Difficulty filters
- Category filters
- Bookmark feature
- Problem cards with metadata

## Design System

**Colors (CSS Variables):**
```css
--background: #ffffff (light) / #0f0f0f (dark)
--foreground: #0f0f0f (light) / #f5f5f5 (dark)
--accent: #06b6d4 (cyan - primary color)
--card: #ffffff (light) / #1a1a1a (dark)
--secondary: #f5f5f5 (light) / #262626 (dark)
--muted-foreground: #737373 (light) / #a3a3a3 (dark)
```

**Theme Toggle:**
- Dark mode is controlled via `class="dark"` on `<html>`
- Automatically loads from localStorage
- Toggle button in navbar

## Context Hooks

### useTheme()
```javascript
import { useTheme } from './context/ThemeContext';

const { theme, toggleTheme } = useTheme();
// theme: 'light' | 'dark'
```

### useAuth()
```javascript
import { useAuth } from './context/AuthContext';

const { user, toggleBookmark, isBookmarked } = useAuth();
// user: { id, name, email, avatar, bio, bookmarkedProblems }
// toggleBookmark(problemId): void
// isBookmarked(problemId): boolean
```

## Mock Data

**3 Sample Problems:**
1. Two Sum (Easy)
2. Add Two Numbers (Medium)
3. Longest Substring Without Repeating Characters (Medium)

Each problem has:
- Description, constraints, examples
- Starter code in 4 languages
- Hints and explanation
- Company tags
- Rating system

**Import in your pages:**
```javascript
import { problems } from '../data/problems';
```

## Dependencies

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "react-router-dom": "^6.20.0",
  "lucide-react": "^0.294.0",
  "recharts": "^2.10.3"
}
```

## No TypeScript?

This is **pure JavaScript** - no TypeScript. All files are `.jsx` not `.tsx`.

If you want to add TypeScript:
1. Rename files from `.jsx` to `.tsx`
2. Add type annotations
3. Update `tsconfig.json`

## Dark Mode

**Current Implementation:**
- Uses CSS custom properties
- `useTheme()` hook manages state
- Persists to localStorage
- Toggle button in navbar

**Light mode colors** → Set on `:root`
**Dark mode colors** → Set on `:root.dark`

## Common Tasks

### Add a New Page
1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Update sidebar if needed

### Add a Component
1. Create `src/components/MyComponent.jsx`
2. Import and use:
   ```jsx
   import { MyComponent } from '../components/MyComponent';
   ```

### Change Colors
Edit `src/index.css`:
```css
:root {
  --accent: #YOUR_COLOR;
  /* ... other variables */
}
```

## Troubleshooting

**Port already in use:**
```bash
npm run dev -- --port 3001
```

**Clear cache:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Hot reload not working:**
- Check Vite config
- Restart dev server

## Next Steps

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Explore all pages and features
4. Try the code editor on `/problems/1/editor`
5. Check admin dashboard at `/admin`

## Deployment

**Build:**
```bash
npm run build
```

**Preview:**
```bash
npm run preview
```

Outputs to `dist/` folder - ready for hosting on Vercel, Netlify, etc.

---

**All files are organized and ready to use!** Just run `npm install && npm run dev` to get started.
