# Chromium Package Fix

## Issue
Error: `The input directory "/var/task/node_modules/@sparticuz/chromium-min/bin" does not exist.`

## Solution
Switched from `@sparticuz/chromium-min` to `@sparticuz/chromium` (the standard package).

## Changes Made

1. **Removed chromium-min package**
   - Removed `@sparticuz/chromium-min` from dependencies
   - Using `@sparticuz/chromium` instead

2. **Updated import in route.ts**
   - Changed from `@sparticuz/chromium-min` to `@sparticuz/chromium`

3. **Memory optimizations kept**
   - Still using 1024 MB memory limit
   - All memory-saving browser flags remain
   - Reduced viewport size (1280x720)

## Current Configuration

- **Package**: `@sparticuz/chromium` (v131.0.1)
- **Memory**: 1024 MB
- **Viewport**: 1280x720 (reduced from 1920x1080)
- **Course extraction**: Limited to 3 assignments on Vercel

## Why This Works

`@sparticuz/chromium` is the standard, well-tested package for Vercel serverless functions. It's properly configured and works reliably on Vercel's infrastructure.

## Next Steps

1. **Commit and push**:
```bash
cd web-app
git add .
git commit -m "Fix Chromium package - use @sparticuz/chromium instead of chromium-min"
git push
```

2. **Vercel will auto-deploy** - The error should be resolved

3. **Monitor deployment** - Check Vercel logs to confirm it works

The function should now work correctly on Vercel!

