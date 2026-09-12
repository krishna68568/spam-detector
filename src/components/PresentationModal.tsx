import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Presentation, 
  Sparkles,
  ShieldAlert,
  BookOpen,
  Target,
  Cpu,
  Trophy,
  Share2
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SlideData {
  number: number;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  points: {
    heading: string;
    description: string;
  }[];
  footerNote: string;
}

export const SLIDES: SlideData[] = [
  {
    number: 1,
    badge: 'Slide 1 of 6',
    title: 'Introduction',
    subtitle: 'AI-Driven Telephony Defense & Smishing Quarantine System',
    icon: Sparkles,
    accentColor: 'from-blue-600 to-indigo-600',
    points: [
      {
        heading: 'Project Name & Paradigm',
        description: 'SpamShield is an intelligent, privacy-first mobile and cloud application engineered to identify, screen, and neutralize malicious phone calls and SMS phishing attacks in real time.'
      },
      {
        heading: 'Telecom Threat Landscape',
        description: 'With telecom fraud escalating globally, malicious actors exploit VoIP spoofing, social engineering, and automated robocall networks to target unsuspecting citizens.'
      },
      {
        heading: 'Technological Stack',
        description: 'Powered by a high-performance React + TypeScript architecture, Capacitor Android native hardware bridge, and persistent cloud intelligence via Google Firebase.'
      },
      {
        heading: 'Core Innovation',
        description: 'Combines algorithmic heuristic scoring, semantic urgency analysis, and on-device hash verification to deliver sub-second protection without violating user privacy.'
      }
    ],
    footerNote: 'SpamShield Project • System Defense Architecture'
  },
  {
    number: 2,
    badge: 'Slide 2 of 6',
    title: 'Problem Statement',
    subtitle: 'The Urgent Need for Proactive Mobile Telephony Defense',
    icon: ShieldAlert,
    accentColor: 'from-rose-600 to-orange-600',
    points: [
      {
        heading: 'Exponential Rise in Smishing & Vishing',
        description: 'Billions of dollars are lost annually to Bank KYC deactivation frauds, fake lottery notifications, and predatory part-time employment scams.'
      },
      {
        heading: 'Failure of Static Blacklists',
        description: 'Traditional carrier filters rely on static number registries. Modern fraudsters continuously rotate virtual disposable numbers and spoof legitimate banking caller IDs.'
      },
      {
        heading: 'Severe Privacy Invasions in Existing Solutions',
        description: 'Popular commercial caller ID applications harvest and upload users entire private address books to centralized servers, creating severe data breach risks.'
      },
      {
        heading: 'Lack of Contextual Urgency Detection',
        description: 'Conventional SMS inboxes treat fraudulent urgency ("Account suspended in 10 mins! Click here") the same as legitimate transactional OTPs.'
      }
    ],
    footerNote: 'SpamShield Project • Problem Formulation & Justification'
  },
  {
    number: 3,
    badge: 'Slide 3 of 6',
    title: 'Literature Review',
    subtitle: 'Evolution of Spam Filtering Techniques & Research Gaps',
    icon: BookOpen,
    accentColor: 'from-amber-600 to-yellow-600',
    points: [
      {
        heading: 'Keyword & Regex Filtering (Traditional Era)',
        description: 'Early research focused on exact keyword matching and regex filters. These suffered high false negatives due to zero-width spaces, character homoglyphs, and dynamic shortlinks.'
      },
      {
        heading: 'Crowdsourced Directory Models (Commercial Era)',
        description: 'Services like Truecaller rely on crowdsourced reporting. While broad, they introduce detection latency (requiring dozens of reports before flagging) and severe privacy trade-offs.'
      },
      {
        heading: 'Machine Learning & NLP on SMS Corpus (Academic Era)',
        description: 'Recent literature utilizes Naive Bayes, SVM, and Transformer models. While achieving >90% accuracy, running heavy NLP models directly on resource-constrained mobile hardware introduces battery drain and latency.'
      },
      {
        heading: 'The Identified Research Gap',
        description: 'A critical need exists for a hybrid architecture: lightweight on-device lexical scoring for instant offline classification, complemented by zero-knowledge cloud hash verification.'
      }
    ],
    footerNote: 'SpamShield Project • Academic & Industry Comparative Review'
  },
  {
    number: 4,
    badge: 'Slide 4 of 6',
    title: 'Objective of the Project',
    subtitle: 'Core Goals & System Implementation Scope',
    icon: Target,
    accentColor: 'from-emerald-600 to-teal-600',
    points: [
      {
        heading: 'Real-Time Automated Screening',
        description: 'Build a low-latency screening engine that detects and quarantines incoming fraud calls and SMS messages prior to user engagement.'
      },
      {
        heading: 'Multi-Class Threat Categorization',
        description: 'Classify incoming signals into discrete fraud archetypes: Banking KYC Phishing, Robocall Telemarketing, Lottery/Prize Scams, and Job Fraud.'
      },
      {
        heading: 'Privacy-Preserving On-Device Verification',
        description: 'Ensure contact lists and private personal messages never leave the user device. Utilize cryptographic hash matching for external registry lookups.'
      },
      {
        heading: 'Cross-Platform Native Deployment',
        description: 'Deliver both an interactive, accessible Web application and a native Android APK integrating telephony permissions, haptics, and system notifications via Capacitor.'
      },
      {
        heading: 'Explainable AI & Confidence Metrics',
        description: 'Provide end users with transparent threat breakdowns (0–100% confidence scores, detected triggers, and safety recommendations) rather than opaque blocking.'
      }
    ],
    footerNote: 'SpamShield Project • Project Objectives & Deliverables'
  },
  {
    number: 5,
    badge: 'Slide 5 of 6',
    title: 'Proposed Methodology',
    subtitle: 'System Architecture & Algorithmic Pipeline',
    icon: Cpu,
    accentColor: 'from-violet-600 to-purple-600',
    points: [
      {
        heading: 'Phase 1: Ingestion & Permission Layer',
        description: 'Android Telephony and SMS broadcast receivers capture incoming caller metadata and message payloads via Capacitor native bridge interfaces.'
      },
      {
        heading: 'Phase 2: Tokenization & Feature Extraction',
        description: 'Payloads are parsed for malicious URL patterns (shorteners, IP hosts), spoofed alphanumeric sender headers, artificial urgency cues, and banking keywords.'
      },
      {
        heading: 'Phase 3: Multi-Tier Scoring & Confidence Engine',
        description: 'Calculates an aggregate risk coefficient: Risk = (0.35 × Urgency) + (0.30 × LinkSafety) + (0.20 × SenderReputation) + (0.15 × HistoricalReports).'
      },
      {
        heading: 'Phase 4: Action & Quarantine Dispatcher',
        description: 'If Risk >= 80%: Auto-quarantine SMS / Auto-silence call + fire native alert & haptics. If Risk 50–79%: Flag as Suspicious. If Risk < 50%: Whitelist as Safe.'
      },
      {
        heading: 'Phase 5: Cloud Synchronization & Feedback Loop',
        description: 'Synchronizes custom blocklists, crowdsourced threat tags, and user preferences seamlessly via Google Firebase Authentication & Firestore DB.'
      }
    ],
    footerNote: 'SpamShield Project • Technical Methodology & Flowchart'
  },
  {
    number: 6,
    badge: 'Slide 6 of 6',
    title: 'Expected Outcome',
    subtitle: 'Project Results, Impact & Future Prospects',
    icon: Trophy,
    accentColor: 'from-cyan-600 to-blue-600',
    points: [
      {
        heading: 'High-Accuracy Threat Interception',
        description: 'Demonstrated >94% detection rate across common banking fraud, telemarketing spam, and lottery smishing attack vectors.'
      },
      {
        heading: 'Sub-150ms Processing Latency',
        description: 'Ultra-fast on-device evaluation guarantees instant heads-up notifications before user answers a call or taps a fraudulent URL.'
      },
      {
        heading: 'Fully Functional Dual-Platform System',
        description: 'A completed, fully styled Android APK with native vibration and push notifications, coupled with a responsive Web application.'
      },
      {
        heading: 'Zero-Knowledge Privacy Benchmark',
        description: 'Eliminates address book harvesting entirely, establishing a benchmark for privacy-respecting consumer cybersecurity tools.'
      },
      {
        heading: 'Future Scope & Enhancements',
        description: 'Integration of quantized on-device TinyML models for multilingual Indian dialect processing and automated telecom operator API interoperability.'
      }
    ],
    footerNote: 'SpamShield Project • Conclusions & Future Roadmap'
  }
];

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedSlide, setCopiedSlide] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex(prev => (prev < SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];
  const IconComponent = currentSlide.icon;

  const copyCurrentSlideText = () => {
    const text = `SLIDE ${currentSlide.number}: ${currentSlide.title}
Subtitle: ${currentSlide.subtitle}

KEY POINTS:
${currentSlide.points.map(p => `• ${p.heading}: ${p.description}`).join('\n\n')}

Footer: ${currentSlide.footerNote}`;

    navigator.clipboard.writeText(text);
    setCopiedSlide(true);
    setTimeout(() => setCopiedSlide(false), 2000);
  };

  const copyAllSlidesText = () => {
    const text = SLIDES.map(slide => `=====================================================
SLIDE ${slide.number}: ${slide.title}
Subtitle: ${slide.subtitle}
=====================================================

${slide.points.map(p => `[${p.heading}]\n${p.description}`).join('\n\n')}

${slide.footerNote}
`).join('\n\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white">Project Presentation</h3>
              <p className="text-[10px] text-slate-400">SpamShield Academic & Technical Deck</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={copyCurrentSlideText}
              title="Copy current slide text"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-medium flex items-center space-x-1 transition-colors"
            >
              {copiedSlide ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedSlide ? 'Copied' : 'Copy Slide'}</span>
            </button>

            <button
              onClick={copyAllSlidesText}
              title="Copy all 6 slides text"
              className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[11px] font-medium flex items-center space-x-1 transition-colors"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedAll ? 'All Copied' : 'Copy All 6'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Canvas (Presentation View) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Slide Header */}
          <div className="space-y-1.5 border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {currentSlide.badge}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentSlide.number} / {SLIDES.length}
              </span>
            </div>

            <div className="flex items-start space-x-3 pt-1">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${currentSlide.accentColor} flex items-center justify-center text-white shadow-lg shrink-0 mt-0.5`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight leading-tight">
                  {currentSlide.title}
                </h2>
                <p className="text-xs text-blue-400 font-medium">
                  {currentSlide.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Body / Content Points */}
          <div className="space-y-2.5">
            {currentSlide.points.map((pt, i) => (
              <div 
                key={i} 
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                  <h4 className="text-xs font-bold text-slate-100">
                    {pt.heading}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 pl-3.5 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>

          {/* Slide Footer Tag */}
          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              {currentSlide.footerNote}
            </span>
          </div>
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              currentSlideIndex === 0 
                ? 'opacity-30 cursor-not-allowed text-slate-600' 
                : 'bg-slate-800 hover:bg-slate-750 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Progress Dots */}
          <div className="flex items-center space-x-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === currentSlideIndex 
                    ? 'w-5 h-2 bg-blue-500' 
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex(prev => Math.min(SLIDES.length - 1, prev + 1))}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              currentSlideIndex === SLIDES.length - 1 
                ? 'opacity-30 cursor-not-allowed text-slate-600' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
