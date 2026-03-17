import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PSL_SCORING_GUIDE = `
CATEGORY           PSL SCORE RANGE       SUB-TIER LABELS
Subhuman          Below 1.3             <0.5: Low Subhuman
                                        0.8-1.3: High Subhuman
Sub 5             1.4 - 2.7             1.4-1.8: LTN-/LTB-
                                        1.9-2.3: LTN/LTB
                                        2.4-2.7: LTN+/LTB+
Normie            2.8 - 5.0             2.8-3.2: MTN-/MTB-
                                        3.3-4.5: MTN/MTB
                                        4.6-5.0: MTN+/MTB+
High Tier         5.1 - 5.9             5.1-5.3: HTN-/HTB-
                                        5.4-5.6: HTN/HTB
                                        5.7-5.9: HTN+/HTB+
Lite              6.0 - 6.8             6.0-6.3: Low CL/SL
                                        6.4-6.5: CL/SL
                                        6.6-6.8: High CL/SL
Elite (Chad)      6.9 - 7.4             6.9-7.0: Low Chad/Stacy
                                        7.1-7.2: Chad/Stacy
                                        7.3-7.4: High Chad/High Stacy
Pinnacle          7.5 - 7.9             7.5-7.7: Adamlite/Evelite
                                        7.8-7.9: True Adam/True Eve
`;

function getCategory(score: number): { category: string; subTier: string; details: string } {
  if (score < 1.3) {
    return {
      category: 'Subhuman',
      subTier: score < 0.5 ? 'Low Subhuman' : 'High Subhuman',
      details: 'Facial congruence below acceptable thresholds. Significant structural deviations detected.'
    };
  } else if (score >= 1.4 && score <= 2.7) {
    const subTier = score <= 1.8 ? 'LTN-/LTB-' : score <= 2.3 ? 'LTN/LTB' : 'LTN+/LTB+';
    return {
      category: 'Sub 5',
      subTier,
      details: subTier.includes('+') ? 'Approaching normie threshold with minor optimizations.' : 'Requires substantial aesthetic intervention.'
    };
  } else if (score >= 2.8 && score <= 5.0) {
    const subTier = score <= 3.2 ? 'MTN-/MTB-' : score <= 4.5 ? 'MTN/MTB' : 'MTN+/MTB+';
    return {
      category: 'Normie',
      subTier,
      details: subTier.includes('+') ? 'Above-average facial harmony. Decent bone structure.' : 'Average population range. Functional but not striking.'
    };
  } else if (score >= 5.1 && score <= 5.9) {
    const subTier = score <= 5.3 ? 'HTN-/HTB-' : score <= 5.6 ? 'HTN/HTB' : 'HTN+/HTB+';
    return {
      category: 'High Tier',
      subTier,
      details: subTier.includes('+') ? 'Strong aesthetic indicators. Near elite territory.' : 'Attractive with minor asymmetries.'
    };
  } else if (score >= 6.0 && score <= 6.8) {
    const subTier = score <= 6.3 ? 'Low CL/SL' : score <= 6.5 ? 'CL/SL' : 'High CL/SL';
    return {
      category: 'Lite',
      subTier,
      details: 'Chadlite bone structure. Excellent jawline-to-forehead ratio.'
    };
  } else if (score >= 6.9 && score <= 7.4) {
    const subTier = score <= 7.0 ? 'Low Chad/Stacy' : score <= 7.2 ? 'Chad/Stacy' : 'High Chad/High Stacy';
    return {
      category: 'Elite',
      subTier,
      details: subTier.includes('High') ? 'Top 0.1% facial symmetry. Elite genetics manifest.' : 'Clear Chad/Stacy indicators. Superior canthal tilt.'
    };
  } else {
    const subTier = score <= 7.7 ? 'Adamlite/Evelite' : 'True Adam/True Eve';
    return {
      category: 'Pinnacle',
      subTier,
      details: 'Near-flawless biometrics. Pinnacle of human aesthetic convergence.'
    };
  }
}

// Mock scoring based on image dimensions (fallback when no API key)
function mockScoreFromBase64(base64: string): number {
  const header = base64.substring(0, 30);
  let width = 640, height = 480;

  if (header.startsWith('data:image/png')) {
    const binary = atob(base64.split(',')[1]);
    width = binary.charCodeAt(16) * 256 + binary.charCodeAt(17);
    height = binary.charCodeAt(20) * 256 + binary.charCodeAt(21);
  } else if (header.startsWith('data:image/jpeg')) {
    width = 640; height = 480;
  }

  const seed = width * height;
  const randomness = Math.sin(seed) * 10000;
  const fractional = randomness - Math.floor(randomness);
  const baseScore = 2.0 + fractional * 5.5;

  return Math.min(Math.max(baseScore, 1.0), 7.9);
}

async function callGeminiAPI(base64Image: string): Promise<{ 
  score: number; 
  category: string; 
  subTier: string; 
  details: string; 
  strengths?: string; 
  weaknesses?: string; 
  improvements?: string;
  mindset?: string;
  strategy?: string;
  jawlineType?: string;
  breathing?: string;
  appealLevel?: string;
} | null> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) {
    console.error('[Gemini] API key not configured');
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Parse data URL to get base64 data and mime type
  const commaIndex = base64Image.indexOf(',');
  if (commaIndex === -1) return null;

  const header = base64Image.substring(0, commaIndex);
  const base64Data = base64Image.substring(commaIndex + 1);
  const mimeType = header.includes('image/') ? header.split(';')[0].split(':')[1] || 'image/jpeg' : 'image/jpeg';

  const prompt = `You are a PSL (Physical Socket Level) scoring engine. Analyze the provided facial image with extreme scrutiny and assign a score from 1.0 to 7.9.

PSL Scoring Guide:
${PSL_SCORING_GUIDE}

Scoring dimensions (weighted):
- Symmetry
- Harmony
- Proportions
- Skin Quality
- Facial Structure
- Averageness
- Sexual Dimorphism
- Memorable Features

Additional fields to determine based on the face:
- Mindset: (e.g., "Confident", "Reserved", "Assertive", "Analytical")
- Strategy: (e.g., "Social Dominance", "Intellectual Appeal", "Aesthetic Optimization")
- Jawline Type: (e.g., "Mogger", "Chiseled", "Soft", "Square", "Oval")
- Breathing: (e.g., "Nose Breather", "Mouth Breather", "Mixed")
- Appeal Level: (e.g., "Brad Pitt", "George Clooney", "Tom Hardy", "Chris Evans", "Jordan Barrett", "David Gandy", or other celebrity comparables)

INSTRUCTIONS (CRITICAL):
1. Examine the face objectively using established attractiveness metrics.
2. Choose the EXACT score within the appropriate range (one decimal place).
3. Determine category and sub-tier from the score.
4. Write a 1-sentence detail that matches the sub-tier's tone.
5. Provide strengths, weaknesses, and improvement suggestions as separate fields.
6. Determine the additional fields (mindset, strategy, jawlineType, breathing, appealLevel) based on facial analysis.

RESPONSE FORMAT RULES:
- Respond ONLY with valid JSON.
- No markdown fences, no extra text.
- ALL FIELDS ARE MANDATORY. Do not omit any.

JSON SCHEMA (follow exactly):
{
  "score": <number between 1.0 and 7.9>,
  "category": "<Subhuman | Sub 5 | Normie | High Tier | Lite | Elite | Pinnacle>",
  "subTier": "<exact sub-tier label from the PSL guide>",
  "details": "<concise one-sentence description>",
  "strengths": "<brief strengths list, 2-4 items>",
  "weaknesses": "<brief weaknesses list, 2-4 items>",
  "improvements": "<brief actionable suggestions>",
  "mindset": "<mindset classification>",
  "strategy": "<recommended strategy>",
  "jawlineType": "<jawline classification>",
  "breathing": "<breathing pattern>",
  "appealLevel": "<celebrity comparable or appeal level>"
}

EXAMPLE (do not copy, just format):
{
  "score": 6.5,
  "category": "Lite",
  "subTier": "CL/SL",
  "details": "Strong jawline and symmetrical features place this individual in Chadlite territory.",
  "strengths": "Strong bone structure, high facial symmetry, masculine proportions",
  "weaknesses": "Slight skin texture, minor forehead-to-jaw ratio deviation",
  "improvements": "Maintain grooming, focus on skin hydration",
  "mindset": "Confident",
  "strategy": "Social Dominance",
  "jawlineType": "Chiseled",
  "breathing": "Nose Breather",
  "appealLevel": "Chris Evans"
}

REMEMBER: ALL 12 FIELDS MUST BE PRESENT. If you cannot determine a field, use "Unclear" or "Unable to determine" but DO NOT OMIT IT.`;

  try {
    console.log('[Gemini] Starting analysis with model: gemini-2.5-flash');
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('[Gemini] Raw response:', text.substring(0, 500));
    
    // Clean up response
    let jsonText = text.replace(/^```json\n?|\n?```$/g, '').trim();
    // If response starts with { and ends with }, assume it's JSON
    if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
      // Good
    } else {
      // Try to extract JSON object - find first { and last }
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      } else {
        console.error('[Gemini] No JSON object found in response');
        return null;
      }
    }
    
    const parsed = JSON.parse(jsonText);
    
    if (typeof parsed.score !== 'number') {
      console.error('[Gemini] Invalid score in response:', parsed);
      return null;
    }
    
    // Ensure all required fields exist (Gemini might still omit, but we've emphasized)
    const requiredFields = ['category', 'subTier', 'details', 'strengths', 'weaknesses', 'improvements', 'mindset', 'strategy', 'jawlineType', 'breathing', 'appealLevel'];
    for (const field of requiredFields) {
      if (!(field in parsed)) {
        console.warn(`[Gemini] Missing field '${field}', will set to default`);
        (parsed as any)[field] = 'Unable to determine';
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('[Gemini] API error:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
    let result;

    if (apiKey) {
      console.log('[API] GOOGLE_AI_STUDIO_KEY found, calling Gemini');
      const geminiResult = await callGeminiAPI(image);
      if (geminiResult && typeof geminiResult.score === 'number') {
        result = geminiResult;
        console.log('[API] Gemini analysis complete, score:', result.score);
      } else {
        console.log('[API] Gemini failed, falling back to mock');
      }
    } else {
      console.log('[API] GOOGLE_AI_STUDIO_KEY not set, using mock');
    }

    // Fallback to mock if no real result
    if (!result) {
      const score = mockScoreFromBase64(image);
      const categoryData = getCategory(score);
      result = {
        score,
        ...categoryData,
        strengths: 'Mock analysis - no API key',
        weaknesses: 'Mock analysis - no API key',
        improvements: 'Set GOOGLE_AI_STUDIO_KEY for real AI scoring',
        mindset: 'Unknown (mock)',
        strategy: 'Unknown (mock)',
        jawlineType: 'Unknown (mock)',
        breathing: 'Unknown (mock)',
        appealLevel: 'Unknown (mock)'
      };
    } else {
      // Ensure all new fields exist (should be present due to prompt, but safety net)
      if (!result.mindset) result.mindset = 'Unable to determine';
      if (!result.strategy) result.strategy = 'Unable to determine';
      if (!result.jawlineType) result.jawlineType = 'Unable to determine';
      if (!result.breathing) result.breathing = 'Unable to determine';
      if (!result.appealLevel) result.appealLevel = 'Unable to determine';
    }

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
