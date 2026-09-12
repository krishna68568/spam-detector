import React from 'react';
import { DetectionStatus } from '../types';

interface ConfidenceScoreProps {
  score: number; // 0 - 100
  status: DetectionStatus;
  showBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  score,
  status,
  showBar = true,
  size = 'md'
}) => {
  // Determine color based on status and score
  const getColor = () => {
    if (status === 'safe') {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500',
        track: 'bg-emerald-950/70',
        border: 'border-emerald-500/30'
      };
    }
    if (status === 'suspicious') {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500',
        track: 'bg-amber-950/70',
        border: 'border-amber-500/30'
      };
    }
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500',
      track: 'bg-rose-950/70',
      border: 'border-rose-500/30'
    };
  };

  const theme = getColor();
  const label = status === 'safe' ? 'Trust Score' : 'Spam Confidence';

  return (
    <div className="flex flex-col space-y-1 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className={`font-bold font-mono ${theme.text}`}>
          {score}% {status === 'spam' || status === 'blocked' ? 'Spam' : status === 'safe' ? 'Safe' : 'Risk'}
        </span>
      </div>
      {showBar && (
        <div className={`w-full rounded-full h-1.5 overflow-hidden ${theme.track} border ${theme.border}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${theme.bg}`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};
