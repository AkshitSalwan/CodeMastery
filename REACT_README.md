# CodeMastery - React + JavaScript Version

A complete DSA (Data Structures & Algorithms) learning platform built with React and JavaScript (no TypeScript).

## Setup & Installation

### Prerequisites
- Node.js 16+ installed
- npm or pnpm package manager

### Installation Steps

1. **Copy the React project files:**
   ```bash
   # All source files are in the src/ directory
   # Copy the entire src/ folder along with configuration files
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   # or
   npm run build
   ```

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Main app with routing
├── index.css               # Global styles with design tokens
├── components/             # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── ThemeToggle.jsx
│   ├── BookmarkButton.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── context/               # React Context for state management
│   ├── ThemeContext.jsx   # Dark/light mode
│   └── AuthContext.jsx    # User authentication (mock)
├── pages/                 # Page components
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   ├── ProblemsPage.jsx
│   ├── ProblemDetailPage.jsx
│   ├── CodeEditorPage.jsx  # Interactive code editor
│   ├── AdminPage.jsx       # Analytics dashboard
│   ├── BookmarksPage.jsx
│   ├── TopicsPage.jsx
│   ├── FeedbackPage.jsx
│   ├── ProfilePage.jsx
│   ├── LoginPage.jsx
│   └── SignupPage.jsx
└── data/                  # Mock data
    └── problems.js        # 3+ sample DSA problems
```

## Key Features

### 1. **Dashboard**
- Welcome page with user stats
- Quick action buttons
- Recent activity tracking

### 2. **Code Editor** ⭐
- Interactive code editor with syntax highlighting
- Support for JavaScript, Python, Java, C++
- Run code and see output
- Problem description sidebar
- Copy/Reset code buttons

### 3. **Admin Panel**
- Analytics dashboard with 4 KPI cards
- Charts: Weekly activity, difficulty distribution, submissions by language
- Recent feedback widget
- Uses Recharts for visualizations

### 4. **Problems List**
- Browse 3+ sample DSA problems
- Filter by difficulty and category
- Search functionality
- Problem cards with acceptance rate
- Bookmark problems

### 5. **Bookmarks**
- View all bookmarked problems
- Quick access to solve problems
- Empty state with call-to-action

### 6. **Dark/Light Mode**
- Toggle theme button in navbar
- Persists theme preference
- Full CSS custom properties support

### 7. **Additional Pages**
- Topics discovery with 12 curated topics
- Feedback system with 5-star rating
- User profile page
- Login/Signup pages (dummy)

## Technology Stack

- **React 18.3** - UI library
- **React Router 6.20** - Routing
- **Vite** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts for admin panel

## Design System

All components use CSS custom properties (CSS variables) defined in `src/index.css`:

- **Colors**: background, foreground, card, accent, secondary, muted, destructive, border
- **Dark Mode**: Automatically applied when `class="dark"` is on root element
- **Theme Toggle**: Via `useTheme()` hook

## State Management

### Contexts

1. **ThemeContext** - Dark/light mode state
   - `useTheme()` - Access theme and toggleTheme function

2. **AuthContext** - User data and bookmarks
   - `useAuth()` - Access user, toggleBookmark, isBookmarked

## Important Pages

### CodeEditor (`/problems/:id/editor`)
The most feature-rich page:
- Full-featured code editor
- Language selector
- Run/Reset/Copy buttons
- Test output display
- Problem details sidebar
- Mock code execution

### Admin Dashboard (`/admin`)
Features analytics:
- KPI cards with trends
- Activity line chart
- Difficulty distribution pie chart
- Submissions bar chart by language
- Recent feedback widget

### Problems Page (`/problems`)
Full DSA problem browser:
- Search by title/description
- Filter by difficulty
- Filter by category
- Problem cards with stats
- Bookmark button on each card

## Mock Data

The app includes 3 sample problems:
1. Two Sum (Easy)
2. Add Two Numbers (Medium)
3. Longest Substring Without Repeating Characters (Medium)

Each problem includes:
- Full description and constraints
- Code starter code in 4 languages
- Examples with explanations
- Hints for solving
- Company tags
- Rating system

## Routing

```
/                    - Dashboard (main)
/problems            - Problems list
/problems/:id        - Problem detail
/problems/:id/editor - Code editor
/bookmarks           - Bookmarks list
/topics              - Topics discovery
/feedback            - Feedback system
/profile             - User profile
/admin               - Admin analytics
/home                - Public landing page
/login               - Login page
/signup              - Signup page
```

## Notes

- **No Backend**: All data is mock/hardcoded
- **No TypeScript**: Pure JavaScript for simplicity
- **Dark Mode**: Fully supported with theme toggle
- **Responsive**: Mobile-first design with Tailwind CSS
- **Mock Auth**: Login/signup are dummy - just navigate to dashboard

## Development

### Adding New Pages

1. Create a new file in `src/pages/`
2. Export a component function
3. Add route in `App.jsx`
4. Update sidebar if needed

### Adding Components

1. Create in `src/components/`
2. Use CSS custom properties for colors
3. Import and use in pages

### Modifying Styles

- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.js`
- Component-specific: Use Tailwind classes

## Performance Tips

- Code editor uses a simple textarea (no Monaco)
- Charts render smoothly with Recharts
- Dark mode uses CSS class toggle
- Context API for state (no Redux needed)

## Future Enhancements

- Connect to a real backend API
- Add Monaco editor for advanced features
- Implement real authentication
- Add user submission history
- Real-time leaderboards
- Problem difficulty ratings
