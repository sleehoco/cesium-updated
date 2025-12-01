# Deployment Guide: Staging to Production

This guide explains how to promote changes from the staging branch to production (main branch) for the CesiumCyber website.

## Branch Strategy

- **staging** - Preview/testing environment, deploys automatically to Vercel staging
- **main** - Production environment, deploys automatically to Vercel production

## Prerequisites

Before merging to production, ensure:
- ✅ Staging deployment succeeded on Vercel
- ✅ Tested all features on staging URL
- ✅ Contact form works and sends emails
- ✅ AI tools are functioning correctly
- ✅ All pages load without errors
- ✅ No console errors in browser

## Step-by-Step: Staging to Production

### 1. Verify Staging is Ready

```bash
# Make sure you're on the staging branch
git checkout staging

# Pull latest changes
git pull origin staging

# Check the status
git status
```

### 2. Switch to Main Branch

```bash
# Switch to main branch
git checkout main

# Pull latest changes from remote
git pull origin main
```

### 3. Merge Staging into Main

```bash
# Merge staging branch into main
git merge staging
```

If there are merge conflicts:
```bash
# View conflicted files
git status

# After resolving conflicts manually
git add .
git commit -m "Merge staging into main - production release"
```

### 4. Push to Production

```bash
# Push main branch to trigger production deployment
git push origin main
```

### 5. Monitor Deployment

1. Go to your Vercel dashboard
2. Watch the main branch deployment
3. Once deployed, test the production URL
4. Verify all functionality works

## Quick Commands Cheat Sheet

### Standard Promotion (No Conflicts)
```bash
git checkout main
git pull origin main
git merge staging
git push origin main
```

### If You Need to Abort a Merge
```bash
git merge --abort
git checkout staging
```

### View Commit Differences Between Branches
```bash
# See what's in staging but not in main
git log main..staging --oneline

# See detailed differences
git diff main..staging
```

### Check Which Branch You're On
```bash
git branch
# The current branch will have an asterisk (*)
```

### View Recent Commits
```bash
git log --oneline -n 10
```

## Rollback Procedures

### If Production Deployment Fails

**Option 1: Quick Rollback**
```bash
# Revert the last commit on main
git checkout main
git revert HEAD
git push origin main
```

**Option 2: Hard Reset (Use with Caution)**
```bash
# Find the commit to revert to
git log --oneline

# Reset to specific commit (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# Force push (WARNING: This rewrites history)
git push -f origin main
```

**Option 3: Redeploy Previous Version in Vercel**
1. Go to Vercel dashboard
2. Find the previous successful deployment
3. Click "Redeploy" on that deployment

## Best Practices

### Before Merging to Production

1. **Test Thoroughly on Staging**
   - Test contact form submission
   - Test AI Threat Intelligence tool
   - Check all navigation links
   - Test on mobile and desktop
   - Verify VirusTotal integration works

2. **Review Changes**
   ```bash
   git diff main..staging
   ```

3. **Check for Breaking Changes**
   - Environment variable changes
   - API endpoint modifications
   - Database schema updates

### After Deploying to Production

1. **Smoke Test**
   - Visit production URL
   - Test critical features
   - Check browser console for errors

2. **Monitor**
   - Watch Vercel analytics
   - Check error logs if issues arise

3. **Document**
   - Note what was deployed
   - Record any issues encountered

## Environment Variables

When deploying to production, ensure Vercel has these environment variables set:

**Required:**
- `TOGETHER_API_KEY`
- `GROQ_API_KEY`
- `OPENAI_API_KEY`
- `VIRUSTOTAL_API_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Optional:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Vercel Postgres variables (auto-populated)

## Troubleshooting

### Build Fails on Main Branch

1. Check Vercel build logs
2. Compare with successful staging build
3. Verify all fixes are included:
   ```bash
   git log staging --oneline -n 10
   git log main --oneline -n 10
   ```

### Merge Conflicts

1. Identify conflicted files:
   ```bash
   git status
   ```

2. Open each file and look for conflict markers:
   ```
   <<<<<<< HEAD
   (main branch code)
   =======
   (staging branch code)
   >>>>>>> staging
   ```

3. Choose which version to keep or combine them
4. Remove conflict markers
5. Save file
6. Mark as resolved:
   ```bash
   git add <filename>
   ```

7. Complete the merge:
   ```bash
   git commit -m "Resolve merge conflicts"
   ```

### Need to Update Staging After Main Changes

If you made a hotfix directly on main:
```bash
git checkout staging
git merge main
git push origin staging
```

## Emergency Procedures

### Critical Bug in Production

**Immediate Actions:**
1. Create hotfix directly on main branch
2. Test locally
3. Push to main
4. Merge back to staging after deploy

**Hotfix Process:**
```bash
# Switch to main
git checkout main
git pull origin main

# Make your fix
# ... edit files ...

# Commit and push
git add .
git commit -m "Hotfix: [describe the fix]"
git push origin main

# Merge back to staging
git checkout staging
git merge main
git push origin staging
```

## Contact Information

**Repository:** https://github.com/sleehoco/cesium-updated

**Vercel Dashboard:** https://vercel.com/dashboard

**Support:**
- Git Issues: https://github.com/sleehoco/cesium-updated/issues
- Vercel Support: https://vercel.com/support

---

**Last Updated:** December 1, 2025
**Maintained By:** CesiumCyber Team
