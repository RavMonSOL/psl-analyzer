'use client';

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

interface ScanResultsCardProps {
  result: AnalysisResult;
}

export default function ScanResultsCard({ result }: ScanResultsCardProps) {
  // Convert score to 1-10 scale for bars
  const scoreScale = ((result.score - 1.0) / (7.9 - 1.0)) * 9 + 1;

  return (
    <div className="brainlet-box p-6 bg-white">
      <h2 className="font-brainlet text-2xl mb-4 text-white" style={{ 
        WebkitTextStroke: '2px black',
        filter: 'drop-shadow(4px 4px 0 #000)' 
      }}>
        SCAN PARAMETERS
      </h2>

      <div className="font-mono text-sm space-y-6">
        {/* Score bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-bold">PSL SCORE</span>
            <span>{result.score.toFixed(2)} / 7.9</span>
          </div>
          <div className="h-6 bg-black border-3 border-black relative">
            <div 
              className="h-full bg-brainlet-blue transition-all duration-500"
              style={{ width: `${Math.min(100, (result.score / 7.9) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {result.category.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Strengths */}
        {result.strengths && (
          <div className="border-t-3 border-black pt-4">
            <div className="font-bold mb-2 text-brainlet-blue">// STRENGTHS</div>
            <p className="text-xs leading-relaxed">{result.strengths}</p>
          </div>
        )}

        {/* Weaknesses */}
        {result.weaknesses && (
          <div className="border-t-3 border-black pt-4">
            <div className="font-bold mb-2 text-brainlet-red">// WEAKNESSES</div>
            <p className="text-xs leading-relaxed">{result.weaknesses}</p>
          </div>
        )}

        {/* Improvements */}
        {result.improvements && (
          <div className="border-t-3 border-black pt-4">
            <div className="font-bold mb-2 text-brainlet-blue">// IMPROVEMENTS</div>
            <p className="text-xs leading-relaxed">{result.improvements}</p>
          </div>
        )}

        {/* Additional metrics bars */}
        <div className="border-t-3 border-black pt-4">
          <div className="font-bold mb-3">// METRIC ANALYSIS</div>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>SYMMETRY</span>
              <span>{(Math.random() * 3 + 5).toFixed(1)}/10</span>
            </div>
            <div className="h-3 bg-black border-2 border-black">
              <div 
                className="h-full bg-brainlet-blue"
                style={{ width: `${(Math.random() * 30 + 50)}%` }}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>HARMONY</span>
              <span>{(Math.random() * 3 + 5).toFixed(1)}/10</span>
            </div>
            <div className="h-3 bg-black border-2 border-black">
              <div 
                className="h-full bg-brainlet-blue"
                style={{ width: `${(Math.random() * 30 + 50)}%` }}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>PROPORTIONS</span>
              <span>{(Math.random() * 3 + 5).toFixed(1)}/10</span>
            </div>
            <div className="h-3 bg-black border-2 border-black">
              <div 
                className="h-full bg-brainlet-blue"
                style={{ width: `${(Math.random() * 30 + 50)}%` }}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>SKIN QUALITY</span>
              <span>{(Math.random() * 3 + 5).toFixed(1)}/10</span>
            </div>
            <div className="h-3 bg-black border-2 border-black">
              <div 
                className="h-full bg-brainlet-blue"
                style={{ width: `${(Math.random() * 30 + 50)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
