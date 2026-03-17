# Solana PSL Analyzer

A brutalist, brainletcoin.fun-style facial analysis web app that scores faces on the PSL (Physical Socket Level) scale from **0.5 to 9.9**. Built with Next.js 14, Tailwind CSS, and Google Gemini 2.5 Flash AI.

**Live Demo:** https://psl-analyzer.vercel.app

## Features

- **Image Upload**: Drag & drop or click to upload facial images (PNG, JPG, WEBP)
- **Results Card**: Displays score with animated loading bar, category, sub-tier, and detailed metrics
- **Scan Results Card**: Clean terminal-style summary with strengths, weaknesses, improvements, and metric analysis bars
- **AI-Powered Scoring**: Uses Gemini 2.5 Flash to analyze facial features and return comprehensive results
- **Brainlet Aesthetic**: White background, 3-6px hard black borders, drop shadows, bold fonts (Luckiest Guy, Fira Code), video background
- **Round Image Frame**: Uploaded face displayed in a circular frame with border

## Scoring System (0.5 - 9.9)

| Category | Score Range | Description |
|----------|-------------|-------------|
| Subhuman | < 0.5 | Extremely undesirable, deemed considerably unattractive by society at large |
| Sub 5 | 0.5 - 3.3 | Generally unattractive to society at large |
| Normie/Becky | 3.4 - 6.2 | Ranging from below average to slightly above average attractiveness; majority of people |
| Chadlite/Stacylite | 6.3 - 8.5 | Attractive by societal standards |
| Chad/Stacy | 8.6 - 9.3 | Upper echelons of attractiveness; highly attractive facial features |
| Adamlite/Evelite | 9.4 - 9.6 | Near-perfect level of physical attractiveness |
| True Adam/True Eve | 9.7 - 9.9 | Pinnacle of attractiveness; idealized, symmetrical, genetically superior; largely unattainable |

## AI Analysis Fields

Gemini returns the following data for each image:
- **PSL Score** (0.5 - 9.9)
- **Category & Sub-Tier**
- **Details** - one-sentence description
- **Strengths** - key attractive features
- **Weaknesses** - areas for improvement
- **Improvements** - actionable suggestions
- **Mindset** - psychological classification
- **Strategy** - recommended social/physical strategy
- **Jawline Type** - e.g., Mogger, Chiseled, Square, Oval
- **Breathing** - Nose Breather, Mouth Breather, Mixed
- **Appeal Level** - celebrity comparable or appeal level

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash via `@google/generative-ai` SDK
- **Deployment**: Vercel
- **Design**: Brainletcoin.fun inspired (brutalist, hard borders, drop shadows)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_STUDIO_KEY` | Yes (for real scoring) | Your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) |

### Setting Up Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and add your Gemini API key:
   ```bash
   GOOGLE_AI_STUDIO_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

### Deploying to Vercel

1. Push to GitHub
2. Create a new project on Vercel
3. Add environment variable `GOOGLE_AI_STUDIO_KEY` in Vercel dashboard
4. Deploy

## Project Structure

```
psl-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts       # Gemini API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Main page component
├── components/
│   ├── FacialOverlay.tsx      # Canvas-based image display (no overlay)
│   ├── ImageUpload.tsx
│   ├── ResultsCard.tsx        # Main results display with score bar
│   ├── ScanResultsCard.tsx    # Terminal-style summary card
│   └── TerminalOutput.tsx    # Legacy terminal output (deprecated)
├── public/
│   ├── grok-video-90b41809...mp4  # Background video
│   └── ... (other assets)
├── tailwind.config.ts
├── package.json
└── README.md
```

## API Integration

The `/api/analyze` endpoint accepts a base64-encoded image and returns JSON:

```json
{
  "score": 6.5,
  "category": "Chadlite",
  "subTier": "Mid Chadlite",
  "details": "Strong jawline and symmetrical features place this individual firmly in the Chadlite tier.",
  "strengths": "Strong bone structure, high facial symmetry, masculine proportions",
  "weaknesses": "Slight skin texture, minor forehead-to-jaw ratio deviation",
  "improvements": "Maintain grooming, focus on skin hydration",
  "mindset": "Confident",
  "strategy": "Social Dominance",
  "jawlineType": "Chiseled",
  "breathing": "Nose Breather",
  "appealLevel": "Chris Evans",
  "timestamp": "2025-03-17T14:06:00.000Z"
}
```

If the Gemini API is unavailable or the key is missing, the endpoint falls back to a mock scoring engine based on image dimensions.

## Design Specifications

- **Background**: Pure white (#FFFFFF)
- **Borders**: 3px and 6px solid black (#000000)
- **Drop Shadows**: Hard offset shadows (no blur) for 3D effect
- **Accent Colors**: Electric Blue (#0000FF), Terminal Green (#00FF00)
- **Fonts**:
  - Headers: Luckiest Guy
  - Body: Comic Neue
  - Code/Terminal: Fira Code
- **Video Background**: grok-video (autoplay, muted, loop, low opacity)

## Notes

- Images are sent as base64 to Gemini; they are not stored on the server
- The app uses a deterministic mock scoring fallback when no API key is configured
- All borders are sharp (no radius) to maintain the brainlet aesthetic
- The score bar animates from left to right on card load

## Credits

Built for the Brainletcoin aesthetic. PSL scoring system based on community standards.

**License**: MIT
