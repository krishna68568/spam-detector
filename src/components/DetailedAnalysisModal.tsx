import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Ban, Flag, CheckCircle2, X, Users, Copy, Check } from 'lucide-react';
import { CallRecord, MessageRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { ConfidenceScore } from './ConfidenceScore';

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CallRecord | MessageRecord | null;
  itemType: 'call' | 'message';
  onBlock?: (phoneNumber: string) => void;
  onReport?: (identifier: string) => void;
  onMarkSafe?: (id: string, type: 'call' | 'message') => void;
}

export const DetailedAnalysisModal: React.FC<DetailedAnalysisModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
  onBlock,
  onReport,
  onMarkSafe
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const isCall = itemType === 'call';
  const callItem = isCall ? (item as CallRecord) : null;
  const msgItem = !isCall ? (item as MessageRecord) : null;

  const targetIdentifier = isCall ? callItem!.phoneNumber : msgItem!.sender;
  const title = isCall ? (callItem!.callerName || callItem!.phoneNumber) : (msgItem!.senderName || msgItem!.sender);

  const copyDetails = () => {
    const text = `SpamShield Security Report:
Target: ${targetIdentifier}
Type: ${isCall ? 'Call' : 'SMS'}
Status: ${item.status.toUpperCase()} (${item.confidence}% confidence)
Category: ${item.category}
Timestamp: ${item.timestamp}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md max-h-[88vh] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              {isCall ? 'Call Threat Intelligence' : 'SMS Phishing Analysis'}
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">{title}</h3>
            <p className="font-mono text-xs text-slate-400">{targetIdentifier}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status & Confidence Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Security Verdict</span>
              <p className="text-base font-extrabold text-white capitalize">{item.status} Verdict</p>
            </div>
            <StatusBadge status={item.status} size="lg" />
          </div>

          <ConfidenceScore score={item.confidence} status={item.status} />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Category</span>
              <span className="font-bold text-slate-200">{item.category}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Time Detected</span>
              <span className="font-bold text-slate-200">{item.relativeTime}</span>
            </div>
          </div>
        </div>

        {/* Message Content or Call Notes */}
        {!isCall && msgItem && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Original Quarantined Message:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              "{msgItem.body}"
            </p>
          </div>
        )}

        {/* Reasons for classification (Section 8) */}
        {msgItem && msgItem.reasons && msgItem.reasons.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Reasons for Classification:
            </span>
            <div className="space-y-1.5">
              {msgItem.reasons.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-rose-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call Specific Reports count */}
        {isCall && callItem && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Users className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                <strong>{callItem.reportsCount}</strong> national user complaints registered for this number.
              </span>
            </div>
            {callItem.notes && (
              <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                {callItem.notes}
              </p>
            )}
          </div>
        )}

        {/* Recommended Action (Section 8) */}
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200">
          <span className="font-bold text-white block">Recommended Action:</span>
          <p className="mt-0.5 leading-relaxed">
            {msgItem?.recommendedAction || 'Block number and avoid answering further incoming calls.'}
          </p>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-2 flex flex-wrap gap-2">
          {onBlock && (
            <button
              onClick={() => {
                onBlock(targetIdentifier);
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Block Number</span>
            </button>
          )}

          {onReport && (
            <button
              onClick={() => {
                onReport(targetIdentifier);
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Report</span>
            </button>
          )}

          <button
            onClick={copyDetails}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
