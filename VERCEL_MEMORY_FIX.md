# Vercel Memory Limit Fix

## Issue
Error related to serverless function memory limits on Vercel.

## Solution Applied

### 1. Reduced Memory Allocation
- Changed from **3008 MB** to **1024 MB** (1 GB)
- This works for **Hobby plan** (max 1024 MB)
- If you're on **Pro plan**, you can increase to 3008 MB in `vercel.json`

### 2. Optimized Chromium Usage
- Switched to `@sparticuz/chromium-min` (smaller, more memory-efficient)
- Added memory-saving browser flags
- Reduced viewport size (1280x720 instead of 1920x1080)

### 3. Limited Course Extraction
- Reduced from 5 to 3 assignments for course extraction on Vercel
- This reduces memory usage and execution time

## Memory Limits by Plan

According to [Vercel's documentation](https://vercel.com/docs/limits#serverless-function-memory):

- **Hobby Plan**: Maximum **1024 MB** (1 GB) per function
- **Pro Plan**: Maximum **3008 MB** (3 GB) per function  
- **Enterprise Plan**: Custom limits

## Current Configuration

```json
{
  "functions": {
    "app/api/scrape/route.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

## If You're on Pro Plan

If you have a Pro plan and want more memory, update `vercel.json`:

```json
{
  "functions": {
    "app/api/scrape/route.ts": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

## Additional Optimizations

1. **Chromium-min**: Using lighter Chromium build
2. **Reduced viewport**: Smaller screen size = less memory
3. **Limited course extraction**: Only first 3 assignments get course info
4. **Memory-saving flags**: Added browser flags to reduce memory usage

## Testing

After deploying, the function should work within the 1024 MB limit. Monitor your Vercel dashboard for:
- Function execution time
- Memory usage
- Any errors

## If Issues Persist

1. Check your Vercel plan (Hobby vs Pro)
2. Monitor function logs in Vercel dashboard
3. Consider further optimizing the scraping logic
4. Contact Vercel support if needed

