import React from 'react';
import { AlignLeft, Clock } from 'lucide-react';

const LogsPanel = ({ logs }) => {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 shadow-lg flex flex-col h-64 lg:h-[calc(100%-21rem)]">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-slate-200 font-semibold flex items-center">
          <AlignLeft size={18} className="mr-2 text-blue-400" />
          Detection Logs
        </h2>
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{logs.length} Events</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Clock size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No recent anomalies detected.</p>
          </div>
        ) : (
          logs.map((log, index) => {
            let time = "";
            let message = "";
            
            if (typeof log === 'object' && log !== null) {
              time = log.timestamp || "";
              message = log.event || "";
            } else {
              // Fallback for older string logs if any persist
              const match = String(log).match(/\[(.*?)\] (.*)/);
              if (match) {
                time = match[1];
                message = match[2];
              } else {
                message = String(log);
              }
            }
            
            const isAlert = message.toLowerCase().includes('drowsiness') || 
                            message.toLowerCase().includes('tilt') || 
                            message.toLowerCase().includes('distracted');
            
            return (
              <div key={index} className="flex items-start space-x-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-colors relative">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 rounded-full border-2 border-slate-800 ${isAlert ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                
                <div className="text-xs font-mono text-slate-400 mt-1 whitespace-nowrap min-w-[65px]">{time}</div>
                <div className={`text-sm tracking-wide ${isAlert ? 'text-amber-400 font-medium' : 'text-slate-300'}`}>
                  {message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LogsPanel;
