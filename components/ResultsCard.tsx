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

interface ResultsCardProps {
  result: AnalysisResult;
  imageSrc: string;
  onReset?: () => void;
}

export default function ResultsCard({ result, imageSrc, onReset }: ResultsCardProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left: Round image frame */}
      <div className="brainlet-box p-4 bg-white flex flex-col items-center">
        <h2 className="font-brainlet text-2xl mb-4 text-white" style={{ 
          WebkitTextStroke: '2px black',
          filter: 'drop-shadow(4px 4px 0 #000)' 
        }}>
          FACE MATRIX
        </h2>
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-6 border-black overflow-hidden">
          <img 
            src={imageSrc} 
            alt="Analyzed face" 
            className="w-full h-full object-cover"
          />
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="mt-6 border-6 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors font-mono"
          >
            [ANALYZE ANOTHER]
          </button>
        )}
      </div>

      {/* Right: Stats card */}
      <div className="brainlet-box p-6 bg-white">
        <h2 className="font-brainlet text-2xl mb-4 text-white" style={{ 
          WebkitTextStroke: '2px black',
          filter: 'drop-shadow(4px 4px 0 #000)' 
        }}>
          PSL REPORT
        </h2>
        
        <div className="space-y-4 font-mono text-sm">
          {/* Score with bar */}
          <div className="border-b-2 border-black pb-2">
            <div className="flex justify-between mb-2">
              <span className="font-bold">SCORE:</span>
              <span className="text-xl">{result.score.toFixed(2)}</span>
            </div>
            <div className="h-6 bg-black border-3 border-black relative">
              <div 
                className="h-full bg-brainlet-blue transition-all duration-500"
                style={{ width: `${(result.score / 9.9) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {result.category.toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between border-b-2 border-black pb-2">
            <span className="font-bold">CATEGORY:</span>
            <span>{result.category} ({result.subTier})</span>
          </div>

          <div className="border-b-2 border-black pb-2">
            <div className="font-bold mb-1">MIND:</div>
            <div className="text-xs">{result.mindset || 'N/A'}</div>
          </div>

          <div className="border-b-2 border-black pb-2">
            <div className="font-bold mb-1">STRATEGY:</div>
            <div className="text-xs">{result.strategy || 'N/A'}</div>
          </div>

          <div className="border-b-2 border-black pb-2">
            <div className="font-bold mb-1">JAWLINE:</div>
            <div className="text-xs">{result.jawlineType || 'N/A'}</div>
          </div>

          <div className="border-b-2 border-black pb-2">
            <div className="font-bold mb-1">BREATHING:</div>
            <div className="text-xs">{result.breathing || 'N/A'}</div>
          </div>

          <div className="border-b-2 border-black pb-2">
            <div className="font-bold mb-1">APPEAL:</div>
            <div className="text-xs">{result.appealLevel || 'N/A'}</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-black text-terminal-green font-mono text-xs leading-tight">
          <p className="mb-2 font-bold">// VERDICT</p>
          <p>{result.details}</p>
        </div>
      </div>
    </div>
  );
}
