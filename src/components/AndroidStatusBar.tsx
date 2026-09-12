import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('10:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="android-status-bar"
      className="w-full px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold tracking-tight text-slate-300 select-none bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800/40"
    >
      <span className="font-medium text-slate-200 tracking-normal pl-0.5">{time}</span>

      {/* Center camera punch-hole styling */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/90 ring-1 ring-slate-800/60 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ring-1 ring-blue-900/40"></div>
      </div>

      <div className="flex items-center space-x-2 text-slate-300">
        <span className="text-[10px] font-bold tracking-wider text-blue-400 bg-blue-950/70 px-1 py-0.2 rounded border border-blue-800/50">
          5G
        </span>
        <SignalHigh className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <span className="text-[10px] text-slate-300">92%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
        </div>
      </div>
    </div>
  );
};
