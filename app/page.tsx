'use client';

import { useState, useRef } from 'react';
import ImageUpload from '@/components/ImageUpload';
import FacialOverlay from '@/components/FacialOverlay';
import ResultsCard from '@/components/ResultsCard';
import ScanResultsCard from '@/components/ScanResultsCard';

interface AnalysisResult {
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

  const reset = () => {
    setImage(null);
    setAnalysis(null);
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
        ) : analysis ? (
          <>
            <ResultsCard result={analysis} imageSrc={image} onReset={reset} />
            <ScanResultsCard result={analysis} />
          </>
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
            </div>

            <div className="brainlet-box p-4 bg-white flex items-center justify-center">
              <button
                onClick={analyzeFace}
                disabled={loading}
                className="bg-brainlet-blue text-white px-6 py-3 border-6 border-black hover:bg-black hover:text-white transition-colors font-mono text-lg"
                style={{ boxShadow: '6px 6px 0 #000' }}
              >
                {loading ? 'PROCESSING...' : 'RUN_PSL_ANALYSIS.EXE'}
              </button>
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
