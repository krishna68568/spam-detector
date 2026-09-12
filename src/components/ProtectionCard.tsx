import React from 'react';
import { ShieldCheck, ShieldAlert, PhoneOff, MessageSquareWarning, Ban, RefreshCw, Zap } from 'lucide-react';

interface ProtectionCardProps {
  isProtectionActive: boolean;
  onToggleProtection: () => void;
  spamCallsBlocked: number;
  spamMessagesDetected: number;
  blockedCount: number;
  onViewBlocked: () => void;
  onViewCalls: () => void;
  onViewMessages: () => void;
  onManualScan: () => void;
}

export const ProtectionCard: React.FC<ProtectionCardProps> = ({
  isProtectionActive,
  onToggleProtection,
  spamCallsBlocked,
  spamMessagesDetected,
  blockedCount,
  onViewBlocked,
  onViewCalls,
  onViewMessages,
  onManualScan
}) => {
  return (
    <div className="space-y-4">
      {/* Main Protection Hero Card */}
      <div 
        id="main-protection-card"
        className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 border ${
          isProtectionActive 
            ? 'bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 border-blue-600/30 shadow-2xl shadow-blue-950/50' 
            : 'bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border-rose-600/30'
        }`}
      >
        {/* Background glow orb */}
        <div 
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isProtectionActive ? 'bg-blue-500/15' : 'bg-rose-500/10'
          }`} 
        />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1 pr-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800/80 border border-slate-700/60 mb-2.5">
              <span 
                className={`w-2 h-2 rounded-full ${
                  isProtectionActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              />
              <span className={isProtectionActive ? 'text-emerald-300' : 'text-rose-300'}>
                {isProtectionActive ? 'Active Protection' : 'Protection Paused'}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {isProtectionActive ? "You're Protected" : "Protection Disabled"}
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-[240px] leading-relaxed">
              {isProtectionActive 
                ? 'AI Caller ID & Real-Time SMS filter are actively monitoring incoming traffic.'
                : 'Spam calls and phishing SMS may bypass screening. Tap to activate.'}
            </p>
          </div>

          {/* Large Shield Security Icon with pulse ring */}
          <div className="relative flex items-center justify-center">
            <div 
              className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${
                isProtectionActive 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-500/20' 
                  : 'bg-slate-800 text-slate-400 ring-4 ring-rose-500/20'
              }`}
            >
              {isProtectionActive ? (
                <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
              ) : (
                <ShieldAlert className="w-9 h-9 text-rose-400 stroke-[2.2]" />
              )}
            </div>
          </div>
        </div>

        {/* Protection Metrics Overview */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
            <p className="text-[11px] font-medium text-slate-400">Spam calls blocked</p>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-white font-mono">{spamCallsBlocked}</span>
              <span className="text-[10px] font-semibold text-rose-400">Blocked</span>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60">
            <p className="text-[11px] font-medium text-slate-400">Spam SMS detected</p>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-white font-mono">{spamMessagesDetected}</span>
              <span className="text-[10px] font-semibold text-amber-400">Quarantined</span>
            </div>
          </div>
        </div>

        {/* Card bottom action controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>Database: v2026.09 (Synced)</span>
          </div>

          <button
            id="toggle-protection-btn"
            onClick={onToggleProtection}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ${
              isProtectionActive 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isProtectionActive ? 'Pause Shield' : 'Turn On Shield'}</span>
          </button>
        </div>
      </div>

      {/* Today's Activity Section */}
      <div id="todays-activity-section" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Today's Activity
          </h3>
          <span className="text-[11px] text-blue-400 font-semibold">Real-Time</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Spam Calls Card */}
          <button
            id="today-spam-calls-card"
            onClick={onViewCalls}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400 mb-2 group-hover:scale-105 transition-transform">
              <PhoneOff className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white font-mono">14</span>
            <span className="text-[11px] font-medium text-slate-400 mt-0.5">Spam Calls</span>
          </button>

          {/* Spam SMS Card */}
          <button
            id="today-spam-sms-card"
            onClick={onViewMessages}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
              <MessageSquareWarning className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white font-mono">21</span>
            <span className="text-[11px] font-medium text-slate-400 mt-0.5">Spam SMS</span>
          </button>

          {/* Blocked Numbers Card */}
          <button
            id="today-blocked-numbers-card"
            onClick={onViewBlocked}
            className="flex flex-col items-start p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-105 transition-transform">
              <Ban className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white font-mono">{blockedCount}</span>
            <span className="text-[11px] font-medium text-slate-400 mt-0.5">Blocked List</span>
          </button>
        </div>
      </div>
    </div>
  );
};
