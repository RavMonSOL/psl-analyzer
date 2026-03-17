'use client';

import { useState, useRef } from 'react';
import ImageUpload from '@/components/ImageUpload';
import FacialOverlay from '@/components/FacialOverlay';
import TerminalOutput from '@/components/TerminalOutput';

interface AnalysisResult {
  score: number;
  category: string;
  subTier: string;
  details: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (base64: string) => {
    setImage(base64);
    setAnalysis(null);
  };

  const analyzeFace = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 relative">
      <header className="max-w-4xl mx-auto mb-8 brainlet-box p-6 bg-white relative overflow-visible">
        <h1 className="font-brainlet text-4xl md:text-6xl mb-2 text-white text-center mt-4" style={{ 
          WebkitTextStroke: '3px black',
          filter: 'drop-shadow(6px 6px 0 #000)' 
        }}>
          Solana PSL Analyzer
        </h1>
        <p className="font-mono text-xs text-black text-center mt-1">
          Token: SoLanaPSLxYz8...9abc (Mock)
        </p>
        <p className="font-mono text-sm text-black text-center mt-2">
          [Precision Facial Scoring System v3.1]
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {!image ? (
          <ImageUpload onUpload={handleImageUpload} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brainlet-box p-4 bg-white">
              <h2 className="font-brainlet text-2xl mb-4 text-white" style={{ 
                WebkitTextStroke: '2px black',
                filter: 'drop-shadow(4px 4px 0 #000)' 
              }}>
                FACE MATRIX
              </h2>
              <FacialOverlay
                ref={canvasRef}
                imageSrc={image}
                className="w-full border-3 border-black"
              />
              <button
                onClick={() => setImage(null)}
                className="mt-4 border-6 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors font-mono"
              >
                [UPLOAD NEW FACE]
              </button>
            </div>

            <div className="brainlet-box p-4 bg-white md:col-span-2">
              <h2 className="font-brainlet text-2xl mb-4 text-white" style={{ 
                WebkitTextStroke: '2px black',
                filter: 'drop-shadow(4px 4px 0 #000)' 
              }}>
                SCAN PARAMETERS
              </h2>
              {loading ? (
                <p className="font-mono animate-pulse">Processing biometric data...</p>
              ) : analysis ? (
                <TerminalOutput result={analysis} />
              ) : (
                <button
                  onClick={analyzeFace}
                  className="bg-brainlet-blue text-white px-6 py-3 border-6 border-black hover:bg-black hover:text-white transition-colors font-mono text-lg"
                  style={{ boxShadow: '6px 6px 0 #000' }}
                >
                  RUN_PSL_ANALYSIS.EXE
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-8 brainlet-box p-4 bg-white text-center">
        <p className="font-mono text-xs text-black">
          WARNING: This system employs advanced AI algorithms. Results are mathematically derived but may induce existential dread.
        </p>
      </footer>
    </div>
  );
}
