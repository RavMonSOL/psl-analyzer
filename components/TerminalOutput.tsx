'use client';

import { useEffect, useState } from 'react';

interface AnalysisResult {
  score: number;
  category: string;
  subTier: string;
  details: string;
  strengths?: string;
  weaknesses?: string;
  improvements?: string;
}

interface TerminalOutputProps {
  result: AnalysisResult;
}

export default function TerminalOutput({ result }: TerminalOutputProps) {
  const [displayText, setDisplayText] = useState('');
  
  let fullText = `
╔══════════════════════════════════════════╗
║         PSL NEURAL NET v3.1             ║
║        BIOMETRIC SCAN COMPLETE          ║
╚══════════════════════════════════════════╝

> Loading facial recognition model... OK
> Detecting landmarks... DONE (2,437 points)
> Computing golden ratio indices... DONE
> Consulting chad_matrix_elite.bin... CONNECTED

┌─ SCORE CALCULATION ──────────────────────────────────────┐
│ Base Score:      ${result.score.toFixed(2)}                        │
│ Category:        ${result.category.padEnd(15)} │
│ Sub-Tier:        ${result.subTier.padEnd(15)} │
│ Confidence:      99.7%                                     │
└──────────────────────────────────────────────────────────┘

> Interpreting results against population norm...
> Cross-referencing with PSL 2025 dataset...

┌─ VERDICT ────────────────────────────────────────────────┐
│                                                            │
│  YOU ARE: ${result.category.toUpperCase().padEnd(30)}            │
│                                                            │
│  ${result.details}                                          │
│                                                            │
└──────────────────────────────────────────────────────────┘
`;

  if (result.strengths || result.weaknesses || result.improvements) {
    fullText += `
┌─ ANALYSIS REPORT ─────────────────────────────────────────┐
│                                                            │
`;
    if (result.strengths && typeof result.strengths === 'string') {
      fullText += `│  STRENGTHS:          ${result.strengths.padEnd(35)} │\n`;
    }
    if (result.weaknesses && typeof result.weaknesses === 'string') {
      fullText += `│  WEAKNESSES:         ${result.weaknesses.padEnd(35)} │\n`;
    }
    if (result.improvements && typeof result.improvements === 'string') {
      fullText += `│  IMPROVEMENTS:       ${result.improvements.padEnd(35)} │\n`;
    }
    fullText += `│                                                            │
└──────────────────────────────────────────────────────────┘
`;
  }

  fullText += `
> Generating improvement recommendations...
> Upload another face for comparative analysis.

╔══════════════════════════════════════════╗
║  SYSTEM READY FOR NEXT SCAN             ║
╚══════════════════════════════════════════╝
  `;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index += 1;
      if (index > fullText.length) clearInterval(interval);
    }, 8);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="brainlet-box bg-terminal-black text-terminal-green p-4 font-mono text-sm leading-tight overflow-x-auto border-3 border-black w-full max-w-none">
      <pre className="whitespace-pre">{displayText}</pre>
    </div>
  );
}