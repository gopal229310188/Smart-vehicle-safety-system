import React from 'react';
import { Activity, AlertTriangle, AlertOctagon, BatteryMedium } from 'lucide-react';

const StatusPanel = ({ status, fatigueScore }) => {
  
  // Determine styles and icons based on status
  let statusColor = "text-emerald-400";
  let bgGradient = "from-emerald-900/40 to-emerald-800/10";
  let Icon = Activity;
  
  if (status === 'Warning' || status === 'Driver Distracted') {
    statusColor = "text-amber-400";
    bgGradient = "from-amber-900/40 to-amber-800/10";
    Icon = AlertTriangle;
  } else if (status === 'Drowsiness Detected' || status === 'Alert') {
    statusColor = "text-red-500";
    bgGradient = "from-red-900/40 to-red-800/10";
    Icon = AlertOctagon;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className={`rounded-xl border border-slate-700 bg-gradient-to-b ${bgGradient} p-6 shadow-lg`}>
        <h2 className="text-slate-400 font-medium text-sm tracking-wider uppercase mb-4">Driver Status</h2>
        
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-slate-800/80 border border-slate-600 ${statusColor}`}>
            <Icon size={32} />
          </div>
          <div>
            <div className={`text-2xl font-bold ${statusColor}`}>{status}</div>
            <div className="text-slate-400 text-sm mt-1">Real-time driver monitoring</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-slate-400 font-medium text-sm tracking-wider uppercase">Fatigue Score</h2>
          <BatteryMedium size={20} className="text-slate-500" />
        </div>
        
        <div className="flex items-end space-x-2 mb-2">
          <span className="text-4xl font-bold font-mono text-slate-100">{Math.round(fatigueScore)}</span>
          <span className="text-slate-400 text-lg mb-1">%</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-3 mb-2 relative overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              fatigueScore >= 70 ? 'bg-red-500' : fatigueScore >= 40 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, fatigueScore))}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-500">
          <span>0 (Alert)</span>
          <span>100 (Exhausted)</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
