# 🔧 Utility Scripts

This directory contains various utility scripts for CodeMastery project maintenance, fixes, and initialization.

## 📋 Scripts Overview

### 🔨 Fix & Audit Scripts

These scripts help identify and fix issues in the codebase.

| Script | Purpose | Usage |
|--------|---------|-------|
| **fix-all-boilerplate.js** | Fix all boilerplate code issues | `node scripts/utils/fix-all-boilerplate.js` |
| **fix-java-main.js** | Fix Java main class issues | `node scripts/utils/fix-java-main.js` |
| **fix-java-wrappers.js** | Fix Java wrapper classes | `node scripts/utils/fix-java-wrappers.js` |
| **fix-remaining-boilerplate.js** | Fix remaining boilerplate issues | `node scripts/utils/fix-remaining-boilerplate.js` |
| **fix-remaining-issues.js** | Fix other remaining issues | `node scripts/utils/fix-remaining-issues.js` |
| **audit-all-boilerplate.js** | Audit boilerplate code | `node scripts/utils/audit-all-boilerplate.js` |
| **update-boilerplate.js** | Update boilerplate templates | `node scripts/utils/update-boilerplate.js` |

### 🎯 Problem Management Scripts

Scripts for managing coding problems and test cases.

| Script | Purpose | Usage |
|--------|---------|-------|
| **ADD_JOLLY_PROBLEM.js** | Add a new Jolly problem | `node scripts/utils/ADD_JOLLY_PROBLEM.js` |
| **add-cpp-jolly.js** | Add C++ Jolly problems | `node scripts/utils/add-cpp-jolly.js` |
| **add-jolly-problem.sh** | Shell script for adding Jolly problems | `bash scripts/utils/add-jolly-problem.sh` |

### 🚀 Initialization Scripts

Scripts for initializing and setting up the application.

| Script | Purpose | Usage |
|--------|---------|-------|
| **INIT_DEMO_USERS.js** | Initialize demo users in database | `node scripts/utils/INIT_DEMO_USERS.js` |
| **init-auth.js** | Initialize authentication system | `node scripts/utils/init-auth.js` |

### 🐛 Debug Scripts

Scripts for debugging specific issues.

| Script | Purpose | Usage |
|--------|---------|-------|
| **debug-java-cpp.mjs** | Debug Java and C++ code | `node scripts/utils/debug-java-cpp.mjs` |

---

## 🚀 Quick Start

### Run a fix script:
```bash
npm run fix:all        # or manually
node scripts/utils/fix-all-boilerplate.js
```

### Initialize demo data:
```bash
node scripts/utils/INIT_DEMO_USERS.js
```

### Add new problems:
```bash
node scripts/utils/ADD_JOLLY_PROBLEM.js
```

---

## 📁 Structure

```
scripts/
├── utils/
│   ├── INDEX.md (you are here)
│   ├── fix-all-boilerplate.js
│   ├── fix-java-main.js
│   ├── fix-java-wrappers.js
│   ├── fix-remaining-boilerplate.js
│   ├── fix-remaining-issues.js
│   ├── audit-all-boilerplate.js
│   ├── update-boilerplate.js
│   ├── ADD_JOLLY_PROBLEM.js
│   ├── add-cpp-jolly.js
│   ├── add-jolly-problem.sh
│   ├── debug-java-cpp.mjs
│   ├── INIT_DEMO_USERS.js
│   └── init-auth.js
├── seeders/
├── test/
├── cli.js
├── seed-global-db.js
├── seed-global-db-smart.js
└── seed-global-db-sequelize.js
```

---

## ⚠️ Important Notes

- Always run these scripts from the **project root** directory
- Some scripts may modify your database - **backup before running**
- Test scripts in development environment first
- Check script documentation/comments for specific requirements

---

## 🔧 Adding New Utility Scripts

To add a new utility script:

1. Create the script in `scripts/utils/`
2. Add an entry to this INDEX.md file
3. Add an npm script command in `package.json` if frequently used
4. Document any prerequisites or dependencies

---

**Last Updated**: April 29, 2026
