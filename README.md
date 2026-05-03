# 💻 CodeMastery - DSA and Interview Platform
<div align="center">
<img src="https://github.com/user-attachments/assets/f75964ce-d558-4b82-a66b-302f5acc4a3f" alt="CodeMastery Preview" width="400">
</div>

## ✨ Overview

CodeMastery is a comprehensive Data Structures & Algorithms (DSA) learning platform designed to mimic the professional experience of sites like LeetCode. Built with a modern stack including React, Node.js, and Sequelize, it features an interactive Monaco code editor, real-time feedback, gamified progression, and a robust library of 500+ problems.

---

<div align="center">
<table>
<tr>
<td><b>Frontend</b></td>
<td>React 18, Vite, Tailwind CSS 4.2, shadcn/ui</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Express.js, Node.js, Sequelize ORM</td>
</tr>
<tr>
<td><b>Editor</b></td>
<td>Monaco Editor (VS Code Engine)</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>PostgreSQL / MySQL (via Sequelize)</td>
</tr>
</table>
</div>

---

## 🌟 Features

- **🚀 Interactive Coding Environment**
  - Multi-language support: JS, Python, Java, C++
  - Integrated Monaco Editor with syntax highlighting 
  - Mock "Run & Submit" engine with performance metrics

- **🎮 Gamification & Engagement**
  - Daily Challenges with bonus XP
  - Achievement badges and leveling system
  - Streak tracking to maintain learning consistency

- **📚 Problem Library**
  - 500+ problems categorized by difficulty and topic
  - Advanced filtering by Company (FAANG) and Tags  
  - Community discussion threads and upvoting  

- **🤖 AI-Powered Learning**
  - rogressive hints and optimal solution explanations 
  - AI-driven code analysis and performance suggestions
  - Personalized user dashboard for progress tracking


## 🛠️ Tech Stack

| Category         | Technologies                                                                                                           |
|------------------|-----------------------------------------------------------------------------------------------------------------------|
| **Frontend**      |<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> |
| **Backend**     |<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />|
| **ORM/Database**   |<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" /> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" /> |
| **UI Components**   | <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" /> <img src="https://img.shields.io/badge/Lucide_Icons-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />|
| **Editor** |<img src="https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" /> |

---

## 📚 Documentation & Guides

All documentation and guides have been organized in the [`guides/`](./guides/INDEX.md) folder for easy navigation.

### Quick Links
- 🚀 [**Getting Started**](./guides/ADMIN_QUICK_START.md) - Quick setup guide for administrators
- 🗄️ [**Database Migration**](./guides/MIGRATION_GUIDE.md) - Migrate data from local MySQL to Aiven cloud
- 📖 [**Complete Documentation**](./guides/INDEX.md) - Browse all available guides
- 🔑 [**Login Credentials**](./guides/LOGIN_CREDENTIALS.md) - Default test credentials
- ⚡ [**Quick Reference**](./guides/QUICK_REFERENCE.md) - Common commands and tasks

---

## 📁 Directory Structure

```
Elara-Regency/
├── 📂 api/                    # API routes for data handling
├── 📂 middlewares/            # Application middleware
│   ├── index.js               # Exports all middleware
│   ├── authMiddleware.js      # Authentication middleware
│   ├── performanceMiddleware.js # Performance optimization
│   └── securityMiddleware.js  # Security enhancements
├── 📂 models/                 # Database models
│   ├── User.js                # User schema and model
│   ├── Reservation.js         # Reservation schema and model
│   ├── ContactMessage.js      # Contact message schema and model
│   └── users.json             # Sample user data
├── 📂 node_modules/           # Node.js dependencies
├── 📂 public/                 # Static assets
│   ├── css/                   # Stylesheets
│   ├── js/                    # Client-side JavaScript
│   └── images/                # Image assets
├── 📂 views/                  # EJS templates
│   ├── 404.ejs               # 404 page
│   ├── about.ejs             # About page
│   ├── admin-dashboard.ejs   # Admin dashboard
│   ├── blog.ejs              # Blog page
│   ├── contact.ejs           # Contact page
│   ├── error.ejs             # Error page
│   ├── home.ejs              # Home page
│   ├── location-detail.ejs   # Location detail page
│   ├── locations.ejs         # Locations page
│   ├── login.ejs             # Login page
│   ├── profile.ejs           # User profile page
│   ├── register.ejs          # Register page
│   ├── reservation.ejs       # Reservation page
│   └── rooms.ejs             # Rooms page
├── 📂 .git/                   # Git repository files
├── 📄 package.json            # Project metadata and dependencies
├── 📄 package-lock.json       # Dependency lock file
├── 📄 README.md               # Project documentation
└── 📄 server.js               # Main server file
```
---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AkshitSalwan/CodeMastery
   cd elara-regency
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@cluster0.example.mongodb.net/?retryWrites=true&w=majority
   PORT=3000
   SESSION_SECRET=your_secret_key
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

   The server will start at http://localhost:3000
---

## 🧭 Usage Guide

- **🏠 Dashboard**: View your current streak, level, and solved problem stats.
- **📝 Register/Login**: Create an account or sign in
- **👤 Profile**: View your details and reservation history
- **💻 Problem Solving**: Select a problem, choose your language (JS/Python/Java), and use the Monaco editor to write your solution.
- **🏆 Achievements:**: Check your progress on badges like "7-Day Streak" or "DP Master."
- **💬 Discussions**: Post questions or view alternative solutions in the problem discussion tab.

## 💾 Database Setup

1. **Create MongoDB Atlas Account**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster

2. **Configure Database Access**:
   - Create a database user
   - Set up network access (IP whitelist)

3. **Get Connection String**:
   - Navigate to "Connect" > "Connect your application"
   - Copy the connection string and update your `.env` file
---

## ⚡ Redis Verification

This project uses Redis for login rate limiting, password reset OTP storage, and caching authenticated user data.

### 1. Confirm Redis is running

In PowerShell or terminal:
```bash
"D:\Program Files\Redis\redis-cli.exe" ping
```
Expected response:
```text
PONG
```

### 2. Confirm `.env` is configured

Make sure your `.env` contains:
```env
REDIS_URL=redis://localhost:6379
```

### 3. Check Redis keys in your local instance

Use Redis CLI to inspect keys:
```bash
"D:\Program Files\Redis\redis-cli.exe" KEYS '*'
```

### 4. Test Redis storage for this project

Add sample values:
```bash
"D:\Program Files\Redis\redis-cli.exe" SET test:key "Hello from CodeMastery"
"D:\Program Files\Redis\redis-cli.exe" SET login_attempts:127.0.0.1 2 EX 900
"D:\Program Files\Redis\redis-cli.exe" SELECT 1
"D:\Program Files\Redis\redis-cli.exe" SET user:1:email "test@example.com"
"D:\Program Files\Redis\redis-cli.exe" SET user:1:username "testuser"
"D:\Program Files\Redis\redis-cli.exe" SELECT 2
"D:\Program Files\Redis\redis-cli.exe" SET session:abc123 "user_id:1"
```

### 5. What is stored in each Redis database

- `db0`
  - `login_attempts:<ip>` — login rate limit counters
  - `otp:<email>` — password reset one-time codes
  - `user:<id>` — cached authenticated user objects
  - `session:<id>` — any session-like cache data if enabled

- `db1`
  - `user:<id>:email` — example user data stored for caching
  - `user:<id>:username` — example username data

- `db2`
  - `session:abc123` — example session-like data

### 6. Verify database usage

Use Redis CLI:
```bash
"D:\Program Files\Redis\redis-cli.exe" INFO keyspace
```
You should see one or more entries like:
```text
# Keyspace
db0:keys=3,expires=2,avg_ttl=...
db1:keys=2,expires=0,avg_ttl=0
db2:keys=1,expires=0,avg_ttl=0
```

---

## 🔒 Security Features

- **Password Protection**: All passwords are hashed using bcrypt
- **HTTP Security**: Helmet middleware for securing HTTP headers
- **CORS Protection**: Configured to prevent cross-origin issues
- **Input Validation**: Sanitization of user inputs
- **Authentication**: Protected routes with auth middleware
---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes and commit (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

⭐ **Star this repository if you find it useful!** ⭐
