import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Ban, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Copy,
  Check
} from 'lucide-react';
import { DetectionResult } from '../types';
import { spamShieldService } from '../services/spamShieldService';
import { StatusBadge } from './StatusBadge';
import { ConfidenceScore } from './ConfidenceScore';

interface ManualCheckViewProps {
  onBlockNumber: (number: string) => void;
  onReportNumber: (number: string) => void;
  initialTarget?: string;
  initialMode?: 'phone' | 'message';
}

export const ManualCheckView: React.FC<ManualCheckViewProps> = ({
  onBlockNumber,
  onReportNumber,
  initialTarget = '',
  initialMode = 'phone'
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'message'>(initialMode);
  const [phoneNumberInput, setPhoneNumberInput] = useState(initialTarget || '');
  const [messageInput, setMessageInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sample presets for quick testing
  const phonePresets = [
    { label: 'Telemarketer', number: '+91 98765 43210' },
    { label: 'Bank Phishing', number: '+91 87654 32109' },
    { label: 'Robocall IVR', number: '+91 99887 66554' },
    { label: 'Safe Doctor', number: '+91 91234 56789' }
  ];

  const messagePresets = [
    {
      label: 'Lottery Scam',
      text: 'Congratulations! You have won a ₹50,000 lottery prize under Digital India Scheme. Click http://bit.ly/claim-in-prize immediately to claim before expiry!'
    },
    {
      label: 'Bank KYC Threat',
      text: 'Dear SBI Customer, your YONO NetBanking account is suspended due to incomplete KYC! Update PAN card immediately to avoid permanent lock: https://sbi-kyc-reactivate.xyz/login'
    },
    {
      label: 'Part-Time Job Scam',
      text: 'Earn ₹5,000 daily from home by liking YouTube videos! No investment required. WhatsApp HR at +91 91234 00000 to start now.'
    },
    {
      label: 'Safe Bank OTP',
      text: 'Your OTP for Swiggy transaction of Rs. 450.00 is 584920. Valid for 10 mins. Do not share OTP with anyone including bank officials.'
    }
  ];

  const handleCheckPhone = async () => {
    if (!phoneNumberInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      if (simulateNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        throw new Error('Simulation of network connection timeout');
      }

      const res = await spamShieldService.checkPhoneNumber(phoneNumberInput);
      setResult(res);
    } catch (err) {
      setErrorMessage('Unable to complete analysis. Please check your internet or retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckMessage = async () => {
    if (!messageInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      if (simulateNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        throw new Error('Simulation of network connection timeout');
      }

      const res = await spamShieldService.analyzeMessage(messageInput);
      setResult(res);
    } catch (err) {
      setErrorMessage('Unable to complete analysis. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyResultDetails = () => {
    if (!result) return;
    const content = `SpamShield Analysis:
Target: ${result.target}
Verdict: ${result.status.toUpperCase()} (${result.confidence}% confidence)
Category: ${result.category}
Recommendation: ${result.recommendedAction}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="check-screen" className="space-y-4 pb-12 animate-fadeIn">
      {/* Title & subtitle */}
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <span>Check for Spam</span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Scan any unknown phone number or copy-pasted SMS against AI detection models.
        </p>
      </div>

      {/* Two Large Segmented Tabs */}
      <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center">
        <button
          id="tab-check-phone"
          onClick={() => {
            setActiveTab('phone');
            setResult(null);
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'phone'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Check Phone Number</span>
        </button>

        <button
          id="tab-check-message"
          onClick={() => {
            setActiveTab('message');
            setResult(null);
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'message'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Check Message / SMS</span>
        </button>
      </div>

      {/* Input Form Section */}
      <div className="rounded-3xl p-5 bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {activeTab === 'phone' ? (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Enter Phone Number (with country code)
            </label>
            <div className="relative">
              <input
                id="check-phone-input"
                type="text"
                value={phoneNumberInput}
                onChange={(e) => setPhoneNumberInput(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-24"
              />
              <button
                id="check-phone-submit-btn"
                type="button"
                disabled={isLoading || !phoneNumberInput.trim()}
                onClick={handleCheckPhone}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center space-x-1 shadow-md shadow-blue-600/30"
              >
                <span>Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Demo Test Presets */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Quick test numbers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {phonePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhoneNumberInput(preset.number);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition-colors"
                  >
                    <span className="text-blue-400 font-medium">{preset.label}:</span>{' '}
                    <span className="font-mono">{preset.number}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Paste an SMS or message here
            </label>
            <textarea
              id="check-message-textarea"
              rows={4}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Paste suspicious text message, lottery winning SMS, or bank alert here..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {messageInput.length} characters
              </span>
              <button
                id="check-message-submit-btn"
                type="button"
                disabled={isLoading || !messageInput.trim()}
                onClick={handleCheckMessage}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-blue-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Message</span>
              </button>
            </div>

            {/* Quick Demo Message Presets */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Quick test scam templates:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {messagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessageInput(preset.text)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-left transition-colors text-xs truncate"
                  >
                    <span className="font-bold text-slate-200 block truncate">{preset.label}</span>
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">Click to paste</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Optional simulation trigger for network error testing */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>Simulate network failure test:</span>
          <button
            type="button"
            onClick={() => setSimulateNetworkError(!simulateNetworkError)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              simulateNetworkError 
                ? 'bg-rose-950 text-rose-300 border-rose-800' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {simulateNetworkError ? 'Error Mode ON' : 'Normal Mode'}
          </button>
        </div>
      </div>

      {/* Loading State Animation (Section 16 requirement) */}
      {isLoading && (
        <div 
          id="detection-loading-state"
          className="rounded-3xl p-8 bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center justify-center space-y-3 animate-pulse"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Analyzing...</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Checking for suspicious patterns, telecom spam reputation, and known fraudulent text signatures.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-indeterminate" />
          </div>
        </div>
      )}

      {/* Error State with Try Again (Section 16 requirement) */}
      {errorMessage && !isLoading && (
        <div 
          id="detection-error-state"
          className="rounded-3xl p-6 bg-rose-950/40 border border-rose-800/60 text-center flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Unable to complete analysis</h3>
            <p className="text-xs text-slate-300 mt-1">{errorMessage}</p>
          </div>
          <button
            id="detection-try-again-btn"
            type="button"
            onClick={activeTab === 'phone' ? handleCheckPhone : handleCheckMessage}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Result Card & Detailed Breakdown (Section 7 & Section 8 requirements) */}
      {result && !isLoading && (
        <div 
          id="detection-result-card"
          className={`rounded-3xl p-5 border shadow-2xl space-y-4 animate-fadeIn ${
            result.status === 'spam' || result.status === 'blocked'
              ? 'bg-gradient-to-b from-slate-900 to-rose-950/30 border-rose-800/70'
              : result.status === 'suspicious'
              ? 'bg-gradient-to-b from-slate-900 to-amber-950/30 border-amber-800/70'
              : 'bg-gradient-to-b from-slate-900 to-emerald-950/30 border-emerald-800/70'
          }`}
        >
          {/* Header info */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Detection Verdict
              </span>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">
                  {result.status === 'spam' && '🚨 Spam Detected'}
                  {result.status === 'blocked' && '🛑 Known Blocked Fraud'}
                  {result.status === 'suspicious' && '⚠️ Suspicious Activity'}
                  {result.status === 'safe' && '🛡️ Safe & Verified'}
                </h3>
              </div>
              <p className="text-xs font-mono text-slate-300 break-all max-w-[280px]">
                {result.target}
              </p>
            </div>

            <StatusBadge status={result.status} size="lg" />
          </div>

          {/* Confidence Meter Bar */}
          <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800/80">
            <ConfidenceScore score={result.confidence} status={result.status} />
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Category</span>
                <span className="font-bold text-white text-xs">{result.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Risk Level</span>
                <span className={`font-bold text-xs ${
                  result.riskLevel === 'Critical' || result.riskLevel === 'High' 
                    ? 'text-rose-400' 
                    : result.riskLevel === 'Moderate' 
                    ? 'text-amber-400' 
                    : 'text-emerald-400'
                }`}>
                  {result.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Reports & History */}
          {result.reportsCount !== undefined && (
            <div className="flex items-center space-x-3 text-xs bg-slate-950/50 p-3 rounded-2xl border border-slate-800/60">
              <Users className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1">
                <p className="text-slate-200 font-semibold">
                  {result.reportsCount} users reported this number
                </p>
                {result.previousHistory && (
                  <p className="text-[11px] text-slate-400 mt-0.5">{result.previousHistory}</p>
                )}
              </div>
            </div>
          )}

          {/* Reasons List (Section 8) */}
          {result.reasons && result.reasons.length > 0 && (
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/70 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Analysis Breakdown & Reasons:
              </h4>
              <div className="space-y-1.5">
                {result.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action (Section 8) */}
          <div className="rounded-2xl p-3.5 bg-blue-950/40 border border-blue-800/50 flex items-start space-x-2.5 text-xs text-blue-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Recommended Action:</span>
              <p className="text-blue-100 font-medium mt-0.5 leading-relaxed">
                {result.recommendedAction}
              </p>
            </div>
          </div>

          {/* Action Buttons: Block Number, Report Number, Copy (Section 7) */}
          <div className="pt-2 flex flex-wrap gap-2">
            {result.type === 'phone' && (
              <>
                <button
                  id="result-block-btn"
                  onClick={() => onBlockNumber(result.target)}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-600/30"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block Number</span>
                </button>

                <button
                  id="result-report-btn"
                  onClick={() => onReportNumber(result.target)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Report Number</span>
                </button>
              </>
            )}

            <button
              onClick={copyResultDetails}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              title="Copy analysis details"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
