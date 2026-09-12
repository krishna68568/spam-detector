import React, { useState } from 'react';
import { Phone, PhoneOff, ShieldAlert, ShieldCheck, Ban, Flag, CheckCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { CallRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { ConfidenceScore } from './ConfidenceScore';

interface CallCardProps {
  call: CallRecord;
  onBlock: (call: CallRecord) => void;
  onUnblock: (call: CallRecord) => void;
  onReport: (call: CallRecord) => void;
  onMarkSafe: (call: CallRecord) => void;
  onInspect: (call: CallRecord) => void;
}

export const CallCard: React.FC<CallCardProps> = ({
  call,
  onBlock,
  onUnblock,
  onReport,
  onMarkSafe,
  onInspect
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(call.phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBlocked = call.status === 'blocked';
  const isSafe = call.status === 'safe';

  return (
    <div 
      id={`call-card-${call.id}`}
      className={`rounded-2xl p-4 transition-all duration-200 border ${
        call.status === 'spam' || call.status === 'blocked'
          ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-800'
          : call.status === 'suspicious'
          ? 'bg-slate-900/80 hover:bg-slate-850 border-amber-900/30'
          : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
      }`}
    >
      {/* Primary Card Row */}
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Call icon with type indicator */}
          <div 
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
              call.status === 'spam' || call.status === 'blocked'
                ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                : call.status === 'suspicious'
                ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
            }`}
          >
            {call.status === 'spam' || call.status === 'blocked' ? (
              <PhoneOff className="w-5 h-5 stroke-[2.2]" />
            ) : call.status === 'suspicious' ? (
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Phone className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-2">
            {/* Caller Name or Category */}
            <div className="flex items-center space-x-2">
              <h4 className="font-extrabold text-sm text-white truncate">
                {call.callerName || 'Unknown Caller'}
              </h4>
            </div>

            {/* Phone Number */}
            <div className="flex items-center space-x-1.5 mt-0.5">
              <p className="font-mono text-xs font-semibold text-slate-300">
                {call.phoneNumber}
              </p>
              <button 
                onClick={handleCopy}
                title="Copy number"
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Time & Category */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
              <span>{call.relativeTime}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{call.category}</span>
              {call.reportsCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-rose-400 font-medium">{call.reportsCount} reports</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side status badge and expand arrow */}
        <div className="flex flex-col items-end space-y-1.5 shrink-0">
          <StatusBadge status={call.status} size="sm" />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
        <ConfidenceScore score={call.confidence} status={call.status} size="sm" />
      </div>

      {/* Expanded Actions Tray */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 animate-fadeIn">
          {call.notes && (
            <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
              <span className="text-slate-400 font-semibold">Security Note: </span>
              {call.notes}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {isBlocked ? (
              <button
                id={`unblock-call-btn-${call.id}`}
                onClick={() => onUnblock(call)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5 text-blue-400" />
                <span>Unblock Number</span>
              </button>
            ) : (
              <button
                id={`block-call-btn-${call.id}`}
                onClick={() => onBlock(call)}
                className="w-full py-2 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5 text-rose-400" />
                <span>Block Number</span>
              </button>
            )}

            <button
              id={`report-call-btn-${call.id}`}
              onClick={() => onReport(call)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Spam</span>
            </button>

            {!isSafe && (
              <button
                id={`mark-safe-call-btn-${call.id}`}
                onClick={() => onMarkSafe(call)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-800/50 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark as Safe</span>
              </button>
            )}

            <button
              id={`inspect-call-btn-${call.id}`}
              onClick={() => onInspect(call)}
              className="w-full py-2 px-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/70 text-blue-300 border border-blue-800/50 font-semibold flex items-center justify-center space-x-1.5 transition-colors col-span-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Full Analysis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
