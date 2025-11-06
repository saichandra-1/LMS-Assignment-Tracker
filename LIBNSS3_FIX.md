# Fixing libnss3.so Error on Vercel

## Issue
Error: `libnss3.so: cannot open shared object file: No such file or directory`

This error occurs because Chromium needs system libraries that aren't available in Vercel's serverless environment.

## Solution Applied

### 1. Proper Chromium Configuration
- Using `@sparticuz/chromium` which is pre-configured for serverless
- Using Chromium's built-in args (already optimized for Lambda/Vercel)
- Added additional memory-saving flags

### 2. Node.js Version
- Added `engines` field to `package.json` specifying Node.js 18+
- This ensures compatibility with Vercel's environment

### 3. Browser Arguments
- Using Chromium's default args (which include necessary library paths)
- Added `--single-process` and `--no-zygote` (required for serverless)
- Added memory-saving flags to reduce resource usage

## Additional Steps (If Issue Persists)

### Option 1: Set Environment Variable in Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key**: `AWS_LAMBDA_JS_RUNTIME`
   - **Value**: `nodejs18.x` or `nodejs20.x`
3. Redeploy

### Option 2: Verify Chromium Package

Make sure `@sparticuz/chromium` is properly installed:
```bash
cd web-app
pnpm install @sparticuz/chromium
```

### Option 3: Check Vercel Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. Check the build logs for any Chromium-related errors
4. Verify that Chromium binary is being included in the deployment

## Why This Should Work

`@sparticuz/chromium` is specifically designed for AWS Lambda and Vercel serverless functions. It includes:
- Pre-compiled Chromium binary with all necessary libraries
- Proper configuration for serverless environments
- Optimized for low memory usage

The package handles the library dependencies internally, so you shouldn't need system libraries like `libnss3.so`.

## Current Configuration

```typescript
const chromium = await import('@sparticuz/chromium');
const Chromium = chromium.default || chromium;
const executablePath = await Chromium.executablePath();
const args = Chromium.args || []; // These args include necessary library paths
```

## If Still Failing

1. **Check package version**: Ensure you're using the latest `@sparticuz/chromium`
2. **Clear Vercel cache**: Redeploy with "Clear Cache" option
3. **Check memory limit**: Ensure function has enough memory (1024 MB minimum)
4. **Contact Vercel support**: If issue persists, it might be a platform-specific issue

## References

- [@sparticuz/chromium GitHub](https://github.com/Sparticuz/chromium)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)

