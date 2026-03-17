# PSL Brainlet Analyzer

A brutalist, MS Paint-style facial analysis web app that scores faces on the PSL (Physical Socket Level) scale from 1.0 to 7.9.

## Features

- **Image Upload**: Drag & drop or click to upload facial images (PNG, JPG, WEBP)
- **Facial Overlay**: Canvas-based red alignment lines showing eye, jaw, and midface markers
- **AI-Powered Scoring**: Uses Gemini 1.5 Flash to analyze facial features against the PSL scale
- **Terminal Output**: Hacker-style typewriter animation in a black box with lime-green text
- **Brainlet Aesthetic**: Bold "Luckiest Guy" headers, Comic Neue body, Gochi Hand accents, 3px hard borders

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **AI**: Google Gemini API (via REST)
- **Deployment**: Vercel

## Environment Variables

The app requires a Google Gemini API key for real scoring. Without it, the app falls back to a mock scoring engine (based on image dimensions).

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes (for real scoring) | Your Gemini API key from Google AI Studio |
| `GEMINI_MODEL` | No | Model ID to use (default: `gemini-1.5-flash-latest`) |

### Setting Env Vars on Vercel

```bash
# Add via CLI
vercel env add GOOGLE_API_KEY production
# Enter your API key

vercel env add GEMINI_MODEL production
# Enter model ID (optional)
```

Or use the Vercel dashboard: Project Settings → Environment Variables.

## Local Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in `GOOGLE_API_KEY`
4. Run dev server: `npm run dev`
5. Open http://localhost:3000

## PSL Scoring System

The app uses the master PSL scoring guide:

| Category | Score Range | Sub-Tiers |
|----------|-------------|-----------|
| Subhuman | < 1.3 | Low Subhuman (<0.5), High Subhuman (0.8-1.3) |
| Sub 5 | 1.4 - 2.7 | LTN-/LTB-, LTN/LTB, LTN+/LTB+ |
| Normie | 2.8 - 5.0 | MTN-/MTB-, MTN/MTB, MTN+/MTB+ |
| High Tier | 5.1 - 5.9 | HTN-/HTB-, HTN/HTB, HTN+/HTB+ |
| Lite | 6.0 - 6.8 | Low CL/SL, CL/SL, High CL/SL |
| Elite (Chad) | 6.9 - 7.4 | Low Chad/Stacy, Chad/Stacy, High Chad/Stacy |
| Pinnacle | 7.5 - 7.9 | Adamlite/Evelite, True Adam/True Eve |

## Design Spec

- **Background**: Pure white (#FFFFFF)
- **Borders**: 3px solid black, 0 border radius
- **Accent Colors**: Electric Blue (#0000FF), Warning Red (#FF0000)
- **Header Font**: Luckiest Guy (Google Font)
- **Body Font**: Comic Neue
- **Handwritten**: Gochi Hand
- **Code/Terminal**: Fira Code

## Project Structure

```
psl-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts   # Gemini API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── FacialOverlay.tsx
│   ├── ImageUpload.tsx
│   └── TerminalOutput.tsx
├── tailwind.config.ts
└── package.json
```

## Notes

- Images are converted to Base64 and sent directly to Gemini (no server storage)
- The facial overlay is drawn on HTML5 Canvas client-side
- For production, ensure your Gemini API key has sufficient quota

## Credits

Built for the Brainletcoin aesthetic. Based on the PSL scoring system.
