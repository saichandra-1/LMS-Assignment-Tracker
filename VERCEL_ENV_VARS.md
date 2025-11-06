# Vercel Environment Variables - REQUIRED

## ⚠️ Important: Set This Environment Variable

To fix the `libnss3.so` error, you **MUST** set this environment variable in Vercel:

### Steps:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

2. **Add Environment Variable**
   - **Key**: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`
   - **Value**: `true`
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit

## Why This Is Needed

Setting `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` tells Puppeteer to:
- Not download its own Chromium
- Use `@sparticuz/chromium` instead
- `@sparticuz/chromium` has all libraries (including libnss3.so) bundled

## Additional Environment Variables (Optional)

You can also set:
- `AWS_LAMBDA_JS_RUNTIME` = `nodejs18.x` (ensures correct Node version)

## After Setting Variables

1. Redeploy your project
2. The `libnss3.so` error should be resolved
3. Chromium will use the bundled libraries from `@sparticuz/chromium`

## If Still Failing

Consider using the **Browser Extension** instead:
- Location: `browser-extension/` folder
- No server needed
- No library issues
- Works 100% reliably

