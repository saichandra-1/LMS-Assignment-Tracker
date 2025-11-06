# Vercel Environment Variables Setup

## Required Environment Variable

To fix the `libnss3.so` error, you need to set an environment variable in Vercel:

### Steps:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click on "Settings"
   - Go to "Environment Variables"

2. **Add Environment Variable**
   - **Key**: `AWS_LAMBDA_JS_RUNTIME`
   - **Value**: `nodejs18.x` (or `nodejs20.x` if using Node 20)
   - **Environment**: Select "Production", "Preview", and "Development"
   - Click "Save"

3. **Redeploy**
   - Go to "Deployments"
   - Click "Redeploy" on your latest deployment
   - Or push a new commit to trigger auto-deploy

## Alternative: Use vercel.json (if supported)

If Vercel supports environment variables in `vercel.json`, you can add:

```json
{
  "env": {
    "AWS_LAMBDA_JS_RUNTIME": "nodejs18.x"
  }
}
```

However, it's recommended to set it in the Vercel Dashboard for better control.

## Why This Works

The `AWS_LAMBDA_JS_RUNTIME` environment variable tells Vercel's serverless runtime which Node.js version to use, which ensures compatibility with `@sparticuz/chromium` and its bundled libraries.

## Verification

After setting the environment variable and redeploying:
1. Check the deployment logs
2. The `libnss3.so` error should be gone
3. Chromium should launch successfully

