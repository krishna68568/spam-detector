import React, { useState } from 'react';
import { ShieldCheck, Cpu, Sliders, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const screens = [
    {
      icon: ShieldCheck,
      iconColor: 'from-blue-600 to-indigo-600 text-white',
      title: 'Stay Protected from Spam',
      description: 'SpamShield helps identify suspicious calls and messages before they become a problem for you and your family.',
      badge: 'Step 1 of 3'
    },
    {
      icon: Cpu,
      iconColor: 'from-indigo-600 to-purple-600 text-white',
      title: 'Smart Spam Detection',
      description: 'Analyze calls and messages using intelligent spam detection technology and real-time community fraud alerts.',
      badge: 'Step 2 of 3'
    },
    {
      icon: Sliders,
      iconColor: 'from-blue-500 to-emerald-600 text-white',
      title: 'Take Control',
      description: 'Block unwanted callers and manage suspicious messages easily with one-tap security actions and personal rules.',
      badge: 'Step 3 of 3'
    }
  ];

  const current = screens[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < screens.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top step badge */}
        <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/40 mb-6">
          {current.badge}
        </span>

        {/* Feature Icon Hero */}
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${current.iconColor} flex items-center justify-center shadow-xl shadow-blue-600/30 mb-6 ring-4 ring-slate-800/80`}>
          <Icon className="w-10 h-10 stroke-[2.2]" />
        </div>

        {/* Screen Title & Description */}
        <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug mb-2">
          {current.title}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-8">
          {current.description}
        </p>

        {/* Pagination Dots */}
        <div className="flex items-center space-x-2 mb-6">
          {screens.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === idx ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full space-y-2">
          <button
            id="onboarding-action-btn"
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <span>{currentStep === screens.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {currentStep < screens.length - 1 && (
            <button
              id="onboarding-skip-btn"
              onClick={onComplete}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 py-1 transition-colors"
            >
              Skip Introduction
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
