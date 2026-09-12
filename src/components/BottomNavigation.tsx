import React from 'react';
import { Shield, PhoneCall, MessageSquare, SearchCode, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  spamCallCount?: number;
  spamMsgCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  spamCallCount = 0,
  spamMsgCount = 0
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'calls', label: 'Calls', icon: PhoneCall, badge: spamCallCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: spamMsgCount },
    { id: 'check', label: 'Check', icon: SearchCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 sticky bottom-0 z-40"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCheck = tab.id === 'check';

          if (isCheck) {
            // Prominent center button for Manual Spam Check (User Prompt: "Create the most important manual detection feature")
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-blue-500/40 scale-105 ring-4 ring-slate-950' 
                      : 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white hover:brightness-110 ring-4 ring-slate-950'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span 
                  className={`text-[11px] font-bold mt-1 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex-1 flex flex-col items-center py-1 group focus:outline-none transition-transform active:scale-95"
            >
              {/* Active pill background effect */}
              <div 
                className={`relative px-3 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'}`} />
                
                {/* Optional notification badge for unread calls/SMS */}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-slate-950">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span 
                className={`text-[10px] tracking-wide mt-1 transition-colors ${
                  isActive ? 'font-bold text-blue-400' : 'font-medium text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {tab.label}
              </span>

              {/* Bottom active dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
