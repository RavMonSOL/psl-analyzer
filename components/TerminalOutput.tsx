'use client';

import { useEffect, useState } from 'react';

interface AnalysisResult {
  score: number;
  category: string;
  subTier: string;
  details: string;
  strengths?: string | string[];
  weaknesses?: string | string[];
  improvements?: string | string[];
}

interface TerminalOutputProps {
  result: AnalysisResult;
}

// Helper to wrap text to a maximum width, preserving words
function wrapText(text: string, maxWidth: number): string[] {
  if (text.length <= maxWidth) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxWidth) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += ' ' + word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  
  return lines;
}

// Helper to normalize field to string
function normalizeField(value: string | string[] | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export default function TerminalOutput({ result }: TerminalOutputProps) {
  const [displayText, setDisplayText] = useState('');
  
  const boxWidth = 54; // inner width of the box (between borders)
  
  // Build the terminal output with proper wrapping
  const lines: string[] = [];
  
  // Header
  lines.push('╔══════════════════════════════════════════╗');
  lines.push('║         PSL NEURAL NET v3.1             ║');
  lines.push('║        BIOMETRIC SCAN COMPLETE          ║');
  lines.push('╚══════════════════════════════════════════╝');
  lines.push('');
  lines.push('> Loading facial recognition model... OK');
  lines.push('> Detecting landmarks... DONE (2,437 points)');
  lines.push('> Computing golden ratio indices... DONE');
  lines.push('> Consulting chad_matrix_elite.bin... CONNECTED');
  lines.push('');
  
  // Score calculation
  lines.push('┌─ SCORE CALCULATION ──────────────────────────────────────┐');
  lines.push(`│ Base Score:      ${result.score.toFixed(2).padEnd(47)} │`);
  lines.push(`│ Category:        ${result.category.padEnd(47)} │`);
  lines.push(`│ Sub-Tier:        ${result.subTier.padEnd(47)} │`);
  lines.push(`│ Confidence:      99.7%${''.padEnd(41)} │`);
  lines.push('└──────────────────────────────────────────────────────────┘');
  lines.push('');
  lines.push('> Interpreting results against population norm...');
  lines.push('> Cross-referencing with PSL 2025 dataset...');
  lines.push('');
  
  // Verdict
  lines.push('┌─ VERDICT ────────────────────────────────────────────────┐');
  lines.push('│                                                            │');
  const categoryLine = `YOU ARE: ${result.category.toUpperCase()}`;
  lines.push(`│  ${categoryLine.padEnd(62)}  │`);
  lines.push('│                                                            │');
  
  // Wrap details
  const detailLines = wrapText(result.details, boxWidth - 4);
  for (const detail of detailLines) {
    lines.push(`│  ${detail.padEnd(62)}  │`);
  }
  lines.push('│                                                            │');
  lines.push('└──────────────────────────────────────────────────────────┘');
  lines.push('');
  
  // Analysis Report
  const hasStrengths = result.strengths !== undefined && result.strengths !== '';
  const hasWeaknesses = result.weaknesses !== undefined && result.weaknesses !== '';
  const hasImprovements = result.improvements !== undefined && result.improvements !== '';
  
  if (hasStrengths || hasWeaknesses || hasImprovements) {
    lines.push('┌─ ANALYSIS REPORT ─────────────────────────────────────────┐');
    lines.push('│                                                            │');
    
    if (hasStrengths) {
      lines.push('│  STRENGTHS:');
      const strengthText = normalizeField(result.strengths);
      const strengthLines = wrapText(strengthText, boxWidth - 4);
      for (const line of strengthLines) {
        lines.push(`│    ${line.padEnd(60)} │`);
      }
      lines.push('│                                                            │');
    }
    
    if (hasWeaknesses) {
      lines.push('│  WEAKNESSES:');
      const weaknessText = normalizeField(result.weaknesses);
      const weaknessLines = wrapText(weaknessText, boxWidth - 4);
      for (const line of weaknessLines) {
        lines.push(`│    ${line.padEnd(60)} │`);
      }
      lines.push('│                                                            │');
    }
    
    if (hasImprovements) {
      lines.push('│  IMPROVEMENTS:');
      const improvementsText = normalizeField(result.improvements);
      const improvementsLines = wrapText(improvementsText, boxWidth - 4);
      for (const line of improvementsLines) {
        lines.push(`│    ${line.padEnd(60)} │`);
      }
      lines.push('│                                                            │');
    }
    
    lines.push('└──────────────────────────────────────────────────────────┘');
    lines.push('');
  }
  
  lines.push('> Generating improvement recommendations...');
  lines.push('> Upload another face for comparative analysis.');
  lines.push('');
  lines.push('╔══════════════════════════════════════════╗');
  lines.push('║  SYSTEM READY FOR NEXT SCAN             ║');
  lines.push('╚══════════════════════════════════════════╝');
  
  const fullText = lines.join('\n');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index += 3; // speed up typewriter effect
      if (index >= fullText.length) clearInterval(interval);
    }, 5);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="brainlet-box bg-terminal-black text-terminal-green p-4 font-mono text-sm leading-tight overflow-x-auto border-3 border-black w-full max-w-none">
      <pre className="whitespace-pre">{displayText}</pre>
    </div>
  );
}
