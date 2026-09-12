import React, { useState } from 'react';
import { MessageSquare, MessageSquareWarning, Trash2, Flag, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Copy, Check } from 'lucide-react';
import { MessageRecord } from '../types';
import { StatusBadge } from './StatusBadge';

interface MessageCardProps {
  message: MessageRecord;
  onReport: (message: MessageRecord) => void;
  onDelete: (message: MessageRecord) => void;
  onMarkSafe: (message: MessageRecord) => void;
  onInspect: (message: MessageRecord) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onReport,
  onDelete,
  onMarkSafe,
  onInspect
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(message.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSpam = message.status === 'spam';
  const isSuspicious = message.status === 'suspicious';
  const isSafe = message.status === 'safe';

  return (
    <div 
      id={`msg-card-${message.id}`}
      className={`rounded-2xl p-4 transition-all duration-200 border ${
        isSpam 
          ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-800' 
          : isSuspicious
          ? 'bg-slate-900/80 hover:bg-slate-850 border-amber-900/30'
          : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
      }`}
    >
      {/* Header row: Sender + Badge + Time */}
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
              isSpam 
                ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' 
                : isSuspicious 
                ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
            }`}
          >
            {isSpam ? (
              <MessageSquareWarning className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white truncate">
                {message.senderName ? `${message.senderName}` : message.sender}
              </span>
              {message.senderName && (
                <span className="text-[11px] text-slate-400 font-mono">({message.sender})</span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <span>{message.relativeTime}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{message.category}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1 shrink-0">
          <StatusBadge status={message.status} size="sm" />
          <span className="text-[10px] font-bold font-mono text-slate-400">
            {message.confidence}% conf.
          </span>
        </div>
      </div>

      {/* Message Preview Body */}
      <div className="mt-2.5 bg-slate-950/60 rounded-xl p-3 border border-slate-800/60">
        <p className={`text-xs text-slate-300 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
          "{message.body}"
        </p>

        {message.reasons && message.reasons.length > 0 && expanded && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Detection Reasons:
            </p>
            {message.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-1.5 text-xs text-rose-300">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {message.recommendedAction && expanded && (
          <div className="mt-2.5 p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 flex items-start space-x-1.5 text-xs text-blue-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
            <span><strong className="text-white font-semibold">Recommended Action:</strong> {message.recommendedAction}</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Report Spam, Delete, Mark Safe */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <button
            id={`report-msg-btn-${message.id}`}
            onClick={() => onReport(message)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <Flag className="w-3 h-3 text-amber-400" />
            <span>Report Spam</span>
          </button>

          <button
            id={`delete-msg-btn-${message.id}`}
            onClick={() => onDelete(message)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>

          {!isSafe && (
            <button
              id={`mark-safe-msg-btn-${message.id}`}
              onClick={() => onMarkSafe(message)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-800/50 text-xs font-semibold flex items-center space-x-1 transition-colors"
            >
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Mark Safe</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            title="Copy message text"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
