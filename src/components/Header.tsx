import React from 'react';
import { Shield, Bell, User, Presentation } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenStats: () => void;
  onOpenPresentation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenStats,
  onOpenPresentation
}) => {
  return (
    <header 
      id="spamshield-header"
      className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-[31px] z-30"
    >
      {/* Brand logo & title */}
      <div className="flex items-center space-x-2.5">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-600/25 ring-1 ring-blue-400/30">
            <Shield className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          {/* Active green pulse dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">
              Spam Shield
            </h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              AI PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
            Real-Time Call & SMS Guard
          </p>
        </div>
      </div>

      {/* Right-side quick action buttons */}
      <div className="flex items-center space-x-2">
        {/* Quick stats indicator badge */}
        <button
          id="header-stats-btn"
          onClick={onOpenStats}
          aria-label="View security score"
          className="px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 text-[11px] font-semibold text-blue-300 transition-colors flex items-center space-x-1"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>94% Score</span>
        </button>

        {/* Presentation Deck button */}
        {onOpenPresentation && (
          <button
            id="header-presentation-btn"
            onClick={onOpenPresentation}
            aria-label="Project Presentation Slides"
            title="Project Presentation (6 Slides)"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 transition-colors"
          >
            <Presentation className="w-4 h-4 text-indigo-400" />
          </button>
        )}

        {/* Notification bell button */}
        <button
          id="header-notification-btn"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-950 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile / Account button */}
        <button
          id="header-profile-btn"
          onClick={onOpenProfile}
          aria-label="User profile"
          className={`p-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
            !user.isGuest 
              ? 'bg-blue-950/60 border-blue-600/40 text-blue-300 ring-1 ring-blue-500/30' 
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-6 h-6 rounded-lg object-cover ring-1 ring-blue-400"
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
              !user.isGuest 
                ? 'bg-blue-600 text-white' 
                : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300'
            }`}>
              {user.isGuest ? <User className="w-3.5 h-3.5" /> : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
            </div>
          )}
          {!user.isGuest && (
            <span className="text-[10px] font-bold text-blue-300 max-w-[65px] truncate hidden sm:inline">
              {user.name.split(' ')[0]}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
