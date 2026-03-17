import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PSL_SCORING_GUIDE = `
CATEGORY (SCALE 0.5 - 9.9)

Subhuman          < 0.5               Extremely undesirable, deemed considerably unattractive by society at large.
Sub 5             0.5 - 3.3           Generally unattractive to society at large.
Normie/Becky      3.4 - 6.2           Ranging from below average attractiveness to slightly above average attractiveness. The majority of people fall within this range.
Chadlite/Stacylite 6.3 - 8.5           Attractive by societal standards.
Chad/Stacy        8.6 - 9.3           Upper echelons of attractiveness in society. Highly attractive facial features and a high physical score.
Adamlite/Evelite  9.4 - 9.6           Near-perfect level of physical attractiveness.
True Adam/True Eve 9.7 - 9.9          Pinnacle of attractiveness with idealized features such as symmetrical and genetically superior bone structure. Largely unattainable.
`;

function getCategory(score: number): { category: string; subTier: string; details: string } {
  if (score < 0.5) {
    return {
      category: 'Subhuman',
      subTier: 'Extremely Low',
      details: 'Extremely undesirable, deemed considerably unattractive by society at large.'
    };
  } else if (score >= 0.5 && score <= 3.3) {
    // Sub 5 tier
    if (score < 1.4) {
      return {
        category: 'Sub 5',
        subTier: 'Low Sub 5',
        details: 'Generally unattractive to society at large. Requires substantial aesthetic intervention.'
      };
    } else if (score < 2.4) {
      return {
        category: 'Sub 5',
        subTier: 'Mid Sub 5',
        details: 'Generally unattractive to society at large. Some redeeming features present.'
      };
    } else {
      return {
        category: 'Sub 5',
        subTier: 'High Sub 5',
        details: 'Generally unattractive to society at large. Approaching normie threshold.'
      };
    }
  } else if (score >= 3.4 && score <= 6.2) {
    // Normie/Becky tier
    if (score < 4.1) {
      return {
        category: 'Normie',
        subTier: 'Below Average',
        details: 'Ranging from below average attractiveness to slightly above average. The majority of people fall within this range.'
      };
    } else if (score < 5.2) {
      return {
        category: 'Normie',
        subTier: 'Average',
        details: 'Ranging from below average attractiveness to slightly above average. The majority of people fall within this range.'
      };
    } else {
      return {
        category: 'Normie',
        subTier: 'Above Average',
        details: 'Ranging from below average attractiveness to slightly above average. The majority of people fall within this range.'
      };
    }
  } else if (score >= 6.3 && score <= 8.5) {
    // Chadlite/Stacylite tier
    if (score < 7.1) {
      return {
        category: 'Chadlite',
        subTier: 'Low Chadlite',
        details: 'Attractive by societal standards. Solid bone structure and good proportions.'
      };
    } else if (score < 7.8) {
      return {
        category: 'Chadlite',
        subTier: 'Mid Chadlite',
        details: 'Attractive by societal standards. Strong facial features and good symmetry.'
      };
    } else {
      return {
        category: 'Chadlite',
        subTier: 'High Chadlite',
        details: 'Attractive by societal standards. Near-elite bone structure and excellent proportions.'
      };
    }
  } else if (score >= 8.6 && score <= 9.3) {
    // Chad/Stacy tier
    if (score < 8.9) {
      return {
        category: 'Chad',
        subTier: 'Low Chad',
        details: 'Upper echelons of attractiveness in society. Highly attractive facial features and a high physical score.'
      };
    } else if (score < 9.1) {
      return {
        category: 'Chad',
        subTier: 'Mid Chad',
        details: 'Upper echelons of attractiveness in society. Highly attractive facial features and a high physical score.'
      };
    } else {
      return {
        category: 'Chad',
        subTier: 'High Chad',
        details: 'Upper echelons of attractiveness in society. Highly attractive facial features and a high physical score.'
      };
    }
  } else if (score >= 9.4 && score <= 9.6) {
    // Adamlite/Evelite tier
    return {
      category: 'Adamlite',
      subTier: 'Adamlite',
      details: 'Near-perfect level of physical attractiveness. Exceptional bone structure and harmony.'
    };
  } else if (score >= 9.7) {
    // True Adam/True Eve
    return {
      category: 'True Adam',
      subTier: 'True Adam',
      details: 'Pinnacle of attractiveness with idealized features such as symmetrical and genetically superior bone structure. Largely unattainable.'
    };
  } else {
    // Fallback for any score between 6.3-8.5 that didn't match? Actually we covered all.
    return {
      category: 'Chadlite',
      subTier: 'Mid Chadlite',
      details: 'Attractive by societal standards.'
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
  // Generate score between 0.5 and 9.9
  const baseScore = 0.5 + fractional * 9.4;

  return Math.min(Math.max(baseScore, 0.5), 9.9);
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

  const prompt = `You are a PSL (Physical Socket Level) scoring engine. Analyze the provided facial image with extreme scrutiny and assign a score from 0.5 to 9.9.

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
  "score": <number between 0.5 and 9.9>,
  "category": "<Subhuman | Sub 5 | Normie | Chadlite | Chad | Adamlite | True Adam>",
  "subTier": "<specific sub-tier classification>",
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
    
    // Ensure all required fields exist
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
      // Ensure all new fields exist
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
