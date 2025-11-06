# Vercel Deployment Fix

## Issue
Error: `libnss3.so: cannot open shared object file: No such file or directory`

## Solution Applied

1. **Updated Chromium Configuration**
   - Properly configured `@sparticuz/chromium` for serverless
   - Added all necessary browser args for Vercel environment

2. **Updated Vercel Configuration**
   - Increased memory to 3008MB (required for Chromium)
   - Set environment variables for Puppeteer

3. **Browser Launch Args**
   - Added `--single-process` flag (required for serverless)
   - Added `--no-zygote` flag
   - Added other necessary flags for Vercel

## Important Notes

### Memory Requirements
Vercel requires at least 3008MB of memory for Chromium to work properly. This is configured in `vercel.json`.

### Function Timeout
The function has a 60-second timeout. For longer scraping, consider:
- Upgrading to Vercel Pro (up to 300s timeout)
- Optimizing the scraping process
- Limiting course extraction (already done - first 5 only)

### Deployment Steps

1. **Push to GitHub** (if not already):
```bash
git add .
git commit -m "Fix Vercel deployment"
git push
```

2. **Redeploy on Vercel**:
   - Go to Vercel dashboard
   - Click "Redeploy" on your project
   - Or push a new commit to trigger auto-deploy

3. **Verify Memory Settings**:
   - In Vercel dashboard → Settings → Functions
   - Ensure memory is set to 3008MB or higher

## Alternative: Use Browserless (If Issues Persist)

If Chromium still doesn't work on Vercel, consider using Browserless.io:

1. Sign up for Browserless.io
2. Get API key
3. Update API route to use Browserless WebSocket
4. This avoids Chromium installation issues

## Testing Locally

Test the Vercel-compatible code locally:
```bash
VERCEL=1 pnpm dev
```

This simulates the Vercel environment.

