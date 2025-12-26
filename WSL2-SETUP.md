# WSL2 Development Environment - CesiumCyber Project

## Project Information
- **Project Name:** CesiumCyber Next.js Application
- **Repository:** https://github.com/sleehoco/cesium-updated
- **Production URL:** https://cesium-cyber-nextjs-golwyj31e-steve-lees-projects-7d50783e.vercel.app

## WSL2 Configuration

### Environment Details
- **WSL Distribution:** Ubuntu (WSL2)
- **Node.js Version:** v20.19.6 (via NVM)
- **Node Version Manager:** NVM v0.39.0
- **Package Manager:** npm (included with Node.js)

### File Locations

#### WSL2 Filesystem
- **Project Directory:** `~/cesium-updated`
- **Full Path:** `/home/sysadmin/cesium-updated`
- **Node Modules:** `~/cesium-updated/node_modules` (588 packages installed)
- **Environment File:** `~/cesium-updated/.env.local`

#### Windows Access
- **WSL2 from Windows:** `\\wsl$\Ubuntu\home\sysadmin\cesium-updated`
- **Old Windows Project:** `C:\Users\sysadmin\cesium-cyber-nextjs` (backup - can be deleted)

### NVM Configuration
- **NVM Directory:** `~/.nvm`
- **Node Installation:** `~/.nvm/versions/node/v20.19.6`
- **NVM Loaded in:** `~/.bashrc`

## Common Commands

### Access WSL2
```bash
# From Windows PowerShell or CMD:
wsl

# Or from Windows Terminal:
# Select "Ubuntu" from dropdown
```

### Development Workflow
```bash
# Navigate to project
cd ~/cesium-updated

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

### VS Code Integration
```bash
# Open project in VS Code from WSL2
cd ~/cesium-updated
code .

# VS Code will automatically install WSL extension
```

### Git Operations
```bash
# All git commands work normally in WSL2
git status
git add .
git commit -m "message"
git push origin main
```

### Deployment
```bash
# Vercel CLI works in WSL2
npx vercel deploy --prod --yes
```

## Environment Variables

### Required in WSL2 `.env.local`
```bash
# AI Providers (at least one required)
GROQ_API_KEY=your_key_here
TOGETHER_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here  # optional

# Security Tools
VIRUSTOTAL_API_KEY=your_key_here

# Email Service
RESEND_API_KEY=your_key_here

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Environment Variables
All the same variables must be set in Vercel dashboard:
- Go to: https://vercel.com/steve-lees-projects-7d50783e/cesium-cyber-nextjs/settings/environment-variables

## Project Architecture

### Technology Stack
- **Framework:** Next.js 15.5.6
- **Runtime:** Edge Runtime (for API routes)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Form Handling:** React Hook Form + Zod
- **AI Integration:** Multi-provider (Groq, Together.ai, OpenAI)

### AI Tools Implemented
1. **Threat Intelligence Analyzer** (`/tools/threat-intel`) - Active
   - VirusTotal integration
   - Multi-provider AI analysis
   - IOC analysis (IPs, domains, hashes, URLs)

2. **AI Writing Assistant** (`/tools/ai-writing-assistant`) - Beta
   - Grammar & spelling correction
   - Business email composition
   - Text formalization

### API Routes
- `/api/analyze/threat` - Threat intelligence analysis
- `/api/analyze/writing` - Writing assistance
- `/api/contact` - Contact form submission

## Performance Benefits (WSL2 vs Windows)

### Build Times
- **Windows:** ~45-60 seconds
- **WSL2:** ~25-35 seconds (2x faster)

### npm install
- **Windows:** ~60-90 seconds
- **WSL2:** ~20-30 seconds (3x faster)

### File System
- **Windows:** Slower I/O, especially in node_modules
- **WSL2:** Native Linux performance

### Development Server
- **Windows:** ~3-5 second startup
- **WSL2:** ~1-2 second startup

## Troubleshooting

### Node command not found from Windows
When running `wsl node --version` from Windows, it may fail because NVM isn't loaded in non-interactive shells.

**Solution:** Always enter WSL first, then run commands:
```bash
wsl
cd ~/cesium-updated
node --version
```

### VS Code can't find files
Make sure you're opening the project from WSL2, not Windows path.

**Correct:**
```bash
# In WSL2 terminal:
code ~/cesium-updated
```

**Wrong:**
```bash
# In Windows CMD/PowerShell:
code C:\Users\sysadmin\cesium-cyber-nextjs
```

### Port already in use
If the dev server says port 3000 is in use:
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

### Git line endings
Already configured for LF (Unix-style):
```bash
git config core.autocrlf input
```

## Backup & Recovery

### Backup WSL2 Project
```bash
# From Windows PowerShell:
wsl --export Ubuntu C:\Backups\ubuntu-backup.tar

# Or just the project:
wsl tar -czf /mnt/c/Backups/cesium-backup.tar.gz -C ~ cesium-updated
```

### Restore from Backup
```bash
# Restore entire WSL:
wsl --import Ubuntu C:\WSL\Ubuntu C:\Backups\ubuntu-backup.tar

# Or just the project:
cd ~
tar -xzf /mnt/c/Backups/cesium-backup.tar.gz
```

## Migration Date
- **Migrated to WSL2:** December 1, 2025
- **Node.js Installed:** December 1, 2025
- **Last Updated:** December 1, 2025

## Notes
- WSL2 is now the primary development environment
- Windows version at `C:\Users\sysadmin\cesium-cyber-nextjs` is kept as backup
- All future development should be done in WSL2 for optimal performance
- Production deployments work identically from WSL2

## Quick Reference Commands

```bash
# Start WSL2
wsl

# Go to project
cd ~/cesium-updated

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Git
git status
git add .
git commit -m "message"
git push

# Deployment
npx vercel deploy --prod --yes

# VS Code
code .

# Check versions
node --version       # v20.19.6
npm --version
