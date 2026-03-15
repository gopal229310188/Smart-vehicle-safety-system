import React from 'react';

const VideoFeed = () => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-200">Live Camera Feed</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-700 px-2 py-1 rounded">Camera 01</span>
        </div>
      </div>
      <div className="relative aspect-video bg-black flex items-center justify-center">
        <img 
          src="http://localhost:5050/video_feed" 
          alt="Video Feed" 
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 pointer-events-none border-[1px] border-slate-700/50 m-4 rounded">
          {/* subtle viewfinder overlay */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
