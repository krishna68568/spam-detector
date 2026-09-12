import React from 'react';
import { ShieldCheck, PhoneCall, PhoneOff, MessageSquare, MessageSquareWarning, X, TrendingUp, BarChart2 } from 'lucide-react';
import { ProtectionStats } from '../types';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ProtectionStats;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  stats
}) => {
  if (!isOpen) return null;

  // Find max value in weekly activity for chart scaling
  const maxWeeklyCalls = Math.max(...stats.weeklyActivity.map(d => d.spamCalls), 10);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Protection Statistics</h3>
              <p className="text-[11px] text-slate-400">Overall security & filter performance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protection Score Banner (Section 10) */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blue-950/90 via-slate-900 to-indigo-950/80 border border-blue-600/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Security Health
            </span>
            <h4 className="text-xl font-extrabold text-white">
              Protection Score: {stats.protectionScore}%
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Excellent protection against telecom phishing & spam syndicates.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Metrics Grid Cards (Section 10) */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1 mb-1">
              <PhoneCall className="w-3 h-3 text-blue-400" />
              <span>Total calls checked</span>
            </span>
            <p className="text-xl font-extrabold text-white font-mono">{stats.totalCallsChecked}</p>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">100% screened</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1 mb-1">
              <PhoneOff className="w-3 h-3 text-rose-400" />
              <span>Spam calls detected</span>
            </span>
            <p className="text-xl font-extrabold text-rose-400 font-mono">{stats.spamCallsDetected}</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Flagged by community</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1 mb-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>Spam calls blocked</span>
            </span>
            <p className="text-xl font-extrabold text-white font-mono">{stats.spamCallsBlocked}</p>
            <span className="text-[10px] text-blue-400 font-semibold mt-0.5 block">Zero ringing disturbance</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center space-x-1 mb-1">
              <MessageSquare className="w-3 h-3 text-amber-400" />
              <span>Messages analyzed</span>
            </span>
            <p className="text-xl font-extrabold text-white font-mono">{stats.messagesAnalyzed}</p>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Scanned on arrival</span>
          </div>
        </div>

        {/* Full row for Spam messages detected */}
        <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Spam messages detected</p>
              <p className="text-[11px] text-slate-400">Quarantined phishing and fake lottery SMS</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-400">
            {stats.spamMessagesDetected}
          </span>
        </div>

        {/* Weekly Activity Chart (Section 10) */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Weekly Spam Activity
              </h4>
              <p className="text-[11px] text-slate-400">Spam calls intercepted per day</p>
            </div>
            <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/40">
              Past 7 Days
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-32 flex items-end justify-between gap-2 pt-2 px-1">
            {stats.weeklyActivity.map((item, idx) => {
              const heightPercent = Math.round((item.spamCalls / maxWeeklyCalls) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <span className="text-[10px] font-mono font-bold text-slate-400 mb-1 group-hover:text-white transition-colors">
                    {item.spamCalls}
                  </span>
                  <div className="w-full bg-slate-800/80 rounded-t-lg overflow-hidden h-20 flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-700 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1.5">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary text */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Peak spam activity: <strong>Friday (10 calls)</strong></span>
            <span className="text-emerald-400 font-semibold">100% intercepted</span>
          </div>
        </div>

        {/* Top Spam Categories */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Top Spam Threat Categories
          </h4>
          <div className="space-y-2">
            {stats.topCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{cat.count} attacks ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
