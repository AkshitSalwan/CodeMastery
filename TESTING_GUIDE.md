# 🚀 Quick Start Guide - New Features Testing

## Getting Started

### Step 1: Start the Development Server
```bash
npm run dev
```
This will start both the client and server.

### Step 2: Navigate to Login Page
Open your browser and go to `http://localhost:3000/login`

---

## 👤 User Account Testing

### Login as a Regular User
1. On the login page, select **"👨‍💻 User"** role
2. Enter credentials:
   - **Email**: `alex@example.com`
   - **Password**: `password`
3. Click **"Sign In"**

### What You'll See:
- **Navbar**: Shows "👨‍💻 User" badge with your name "Alex Developer"
- **Sidebar**: Shows user-focused menu with:
  - Dashboard
  - Problems
  - Topics
  - Bookmarks
  - **Challenges Section:**
    - Daily Challenges
    - Achievements
    - Contests
    - Leaderboard

### Features to Explore:

#### 1️⃣ **Achievements Page** (`/achievements`)
- View 8 different achievements
- See progress on each achievement
- View 4 achievements unlocked (with dates)
- Check 2,450 total points earned
- Filter: All / Unlocked / Locked
- Click on any achievement card to see details

**Stats Displayed:**
- 5 Achievements Unlocked
- 2,450 Total Points
- 62.5% Progress (5/8)
- 12 Day Streak

#### 2️⃣ **Daily Challenges Page** (`/daily-challenges`)
- View 5 daily challenges
- Each challenge shows:
  - Title, difficulty level, and points
  - Whether completed or in progress
  - Number of attempts
- Click a challenge to view details in the right panel
- Easy challenges: 20 points
- Medium challenges: 50 points
- Hard challenges: 100 points

**Stats Displayed:**
- 0 Completed Today
- Current Streak (based on completed challenges)
- Total Points Earned from challenges

#### 3️⃣ **Contests Page** (`/contests`)
- Browse 5 different contests
- Filter by: All / Active / Upcoming / Completed
- Each contest shows:
  - Title and description
  - Number of problems (4-30)
  - Active participants
  - Difficulty level
  - Entry fee (if any)
  - Creator information
- Click a contest to see:
  - Full details
  - Prize distribution
  - Contest rules
  - Your rank (if joined)

**Sample Contests:**
- **Weekly Challenge #1** - Active - 5 problems
- **Tree & Graph Mastery** - Active - 8 problems
- **Dynamic Programming Sprint** - Upcoming - 10 problems
- **Beginner Friendly Week** - Completed - 4 problems
- **Interview Preparation Bootcamp** - Active - 30 problems

#### 4️⃣ **Leaderboard Page** (`/leaderboard`)
- View global rankings of top 10 users
- Your rank: **#6** (Alex Developer)
- Your stats:
  - 2,450 points
  - 85 problems solved
  - 12 day streak
  - 5 contests participated
  - 4.0 rating

**Sorting Options:**
- By Points (default)
- By Problems Solved
- By Streak

**Time Filters:**
- All Time
- This Month
- This Week

**Top Performers:**
- 🥇 Alex Chen (1st) - 4,850 points
- 🥈 Jordan Lee (2nd) - 4,320 points
- 🥉 Taylor Smith (3rd) - 3,950 points

---

## 👔 Interviewer Account Testing

### Login as an Interviewer
1. On the login page, select **"👔 Interviewer"** role
2. Enter credentials:
   - **Email**: `sarah@interviewer.com`
   - **Password**: `password`
3. Click **"Sign In"**

### What You'll See:
- **Navbar**: Shows "👔 Interviewer" badge with name "Sarah Chen"
- **Sidebar**: Shows interviewer-focused menu with:
  - Dashboard
  - Contests (management)
  - Leaderboard

### Features to Explore:

#### 1️⃣ **Contests Management** (`/contests`)
- Different view than users
- "Create New Contest" button at the top
- View all contests you've created or that are available
- Each contest shows:
  - Participant count and capacity
  - Entry fees (if any)
  - Prize pools
  - Contest status

#### 2️⃣ **Leaderboard** (`/leaderboard`)
- Same leaderboard as users
- View performance metrics of all users
- Sort by different criteria
- Analyze user performance data

---

## 🔐 User Profile Menu

Click on your avatar/name in the **top-right corner** to see:
1. **Profile** - View your account details
2. **Settings** - Manage your preferences
3. **Logout** - Sign out and return to login

---

## 🎯 Key Features to Test

### ✅ Responsive Design
- Try resizing your browser window
- Test on mobile (F12 → Device toolbar)

### ✅ Theme Toggle
- Click the moon/sun icon in navbar
- Switch between light and dark modes

### ✅ Navigation
- All sidebar links work
- Active page is highlighted
- Quick navigation between sections

### ✅ Data Filtering
- Achievements: Filter by All/Unlocked/Locked
- Contests: Filter by All/Active/Upcoming/Completed
- Leaderboard: Sort and filter by timeframe

### ✅ Role-Based Access
- Switch between User and Interviewer
- Notice different navigation and features
- Each role sees appropriate menu items

---

## 🧪 Test Workflows

### Test Workflow 1: Complete User Experience
1. Login as User
2. View Daily Challenges
3. Click a challenge to see details
4. View Achievements and progress
5. Check your rank on Leaderboard
6. Browse and view Contests
7. Log out

### Test Workflow 2: Interviewer Experience
1. Login as Interviewer
2. View Contests
3. Check Leaderboard
4. Log out

### Test Workflow 3: Authentication
1. Try visiting `/achievements` without login → Redirected to login
2. Login and visit again → Works
3. Click Logout → Returned to login page
4. Try accessing protected route → Must login again

---

## 📊 Sample Data Overview

### Users in Leaderboard:
- 10 different users
- Ranked by points (2,450 - 1,420)
- Various problem-solving counts (48 - 127)
- Different streak levels (5 - 28 days)

### Achievements:
- First Step (unlocked)
- Problem Solver (unlocked)
- Expert Problem Solver (locked - 47/50)
- Week Warrior (unlocked)
- Speed Demon (unlocked)
- Algorithm Master (locked - 18/20)
- Perfect Score (unlocked)
- Data Structure Pro (unlocked)

### Contests:
- Multiple difficulty levels
- Various timeframes (7-28 days)
- Prize pools up to $5000
- Entry fees from free to $20

---

## 🐛 Troubleshooting

### Issue: Blank page after login
- **Solution**: Clear browser cache (Ctrl+Shift+Del) and refresh

### Issue: Sidebar doesn't show all items
- **Solution**: Make sure browser width is sufficient for sidebar display

### Issue: Dark mode not applied
- **Solution**: Click the theme toggle in navbar

### Issue: Login not working
- **Solution**: 
  - Make sure you selected a role (User or Interviewer)
  - Check email and password match demo credentials
  - Clear browser cache and try again

---

## 💡 Tips & Tricks

1. **Quick Navigation**: Use sidebar to jump between pages
2. **User Menu**: Always accessible from top-right corner
3. **Responsive**: Resize for mobile view experience
4. **Details Panel**: Select items in list to see details on right panel
5. **Progress Tracking**: Watch progress bars update on achievement and challenge pages

---

## 📸 Screenshots of Key Pages

### Login Page Features:
- Role selection with icons
- Demo credentials displayed
- Beautiful gradient background
- Form validation

### Achievements Page Features:
- Stats cards at top
- Overall progress bar
- Grid of achievement cards
- Filter buttons
- Progress indicators per achievement

### Daily Challenges Page Features:
- Two-column layout
- Challenge list with status badges
- Details panel on right
- Difficulty color coding
- Completion tracking

### Leaderboard Page Features:
- User's rank highlighted
- Sortable table
- Time filter options
- Stats summary cards
- Medal emojis for top 3

### Contests Page Features:
- Contest cards with status
- Multiple info sections
- Selectable contests
- Detailed side panel
- Prize information
- Rules display

---

## ✨ What's Working

✅ Role-based authentication  
✅ Login/Logout flow  
✅ Protected routes  
✅ User sidebar navigation  
✅ Interviewer sidebar navigation  

### Settings Page  
1. Click on **Settings** in navbar or sidebar.  
2. Verify profile information loads (name, email).  
3. For interviewer role, additional fields "Organization" and "Default Availability" should appear.  
4. Update any field and save; confirm success message.  
5. Change password using the form; mock update should show confirmation.  
6. Ensure page is protected when not authenticated (redirects to login).  
7. Under **Preferences** card:
   - Toggle **Email notifications** and save, then reload to ensure it's persisted.
   - Switch theme between Light/Dark/System and verify the app theme changes immediately and persists.
   - Preferences should be retained across page refreshes and after logout/login.
8. Visit your profile and:
   - Verify unlocked achievement badges appear under your avatar.
   - Click **Edit** on the profile card; name and bio should become editable inline.
   - Change a value and save; refresh to confirm the change persisted.
   - Cancel editing to ensure form resets.

✅ Achievements display and filtering  
✅ Daily challenges listing  
✅ Leaderboard with sorting  
✅ Contests browsing  
✅ User profile dropdown  
✅ Theme toggle  
✅ Responsive design  
✅ Mock data population  

---

## 🎓 Learning Outcomes

After testing these features, you'll understand:
- Role-based authentication patterns
- Context API for state management
- Protected route implementations
- Responsive React component design
- Mock data structures
- Navigation patterns in SPAs
- User experience best practices

---

Enjoy exploring the new features! 🎉
