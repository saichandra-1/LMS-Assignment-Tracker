# LMS Assignment Tracker - Web Application

A beautiful Next.js web application to automatically fetch and display your LMS assignments.

## Features

- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🔐 **Secure Login** - Enter credentials directly in the browser
- ⚡ **Real-time Scraping** - Fetches assignments dynamically
- 📊 **Clean Display** - Organized view of due and upcoming assignments
- 🚀 **Vercel Ready** - Deploy with one click

## Local Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Run development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Option 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/lms-assignment-tracker)

## Environment Variables

No environment variables needed! The app works out of the box.

## Project Structure

```
web-app/
├── app/
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts      # API endpoint for scraping
│   ├── components/
│   │   ├── CredentialsForm.tsx
│   │   ├── LoadingSteps.tsx
│   │   └── AssignmentsDisplay.tsx
│   ├── page.tsx              # Main page
│   └── layout.tsx
├── vercel.json               # Vercel configuration
└── package.json
```

## How It Works

1. User enters credentials in the web interface
2. Credentials are sent to `/api/scrape` endpoint
3. Server uses Puppeteer to:
   - Login to LMS
   - Navigate to calendar
   - Extract assignments
   - Get course information
4. Results are displayed in a beautiful UI

## Notes

- Credentials are never stored, only used for the current session
- For Vercel deployment, course extraction is limited to first 5 assignments (due to timeout limits)
- Local development has no limits

## Troubleshooting

### Puppeteer Issues

If you encounter Puppeteer errors locally:
```bash
pnpm exec puppeteer browsers install chrome
```

### Vercel Deployment Issues

- Make sure `@sparticuz/chromium` is in dependencies
- Check function timeout settings in `vercel.json`
- Review Vercel logs for specific errors

## License

MIT
