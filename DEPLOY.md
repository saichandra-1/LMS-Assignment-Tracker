# Deployment Guide

## Deploy to Vercel

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd web-app
vercel
```

4. **Follow the prompts** - Vercel will guide you through the setup

### Deploy via GitHub

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Import in Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Environment Variables

No environment variables needed! The app works out of the box.

## After Deployment

1. Your app will be live at `https://your-project.vercel.app`
2. Share the URL with others
3. No server maintenance needed!

## Important Notes

- **Function Timeout**: Vercel has a 60-second timeout for serverless functions (configured in `vercel.json`)
- **Course Extraction**: Limited to first 5 assignments on Vercel to avoid timeouts
- **Local Development**: No limits when running locally

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors
- Review build logs in Vercel dashboard

### Runtime Errors

- Check function logs in Vercel dashboard
- Verify Puppeteer/Chromium is working
- Test locally first with `pnpm dev`

### Timeout Issues

- Increase timeout in `vercel.json` (max 60s for Hobby plan)
- Consider upgrading to Pro plan for longer timeouts
- Optimize scraping to be faster

## Local Testing

Before deploying, test locally:

```bash
cd web-app
pnpm dev
```

Visit `http://localhost:3000` and test the full flow.

