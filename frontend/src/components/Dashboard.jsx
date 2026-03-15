import React, { useState, useEffect, useRef } from 'react';
import VideoFeed from './VideoFeed';
import StatusPanel from './StatusPanel';
import LogsPanel from './LogsPanel';

const Dashboard = () => {
  const [systemState, setSystemState] = useState({
    status: 'Driver Active',
    fatigue_score: 0,
    logs: []
  });

  const alarmAudio = useRef(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  useEffect(() => {
  alarmAudio.current = new Audio('/alarm.wav');
  alarmAudio.current.loop = true;

  const unlockAudio = () => {
    if (alarmAudio.current) {
      alarmAudio.current.play()
        .then(() => {
          alarmAudio.current.pause();
          alarmAudio.current.currentTime = 0;
        })
        .catch(() => {});
    }
  };

  window.addEventListener('click', unlockAudio);

  return () => {
    window.removeEventListener('click', unlockAudio);
  };
}, []);

  useEffect(() => {
    // Poll the backend for the latest status
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:5050/status');
        if (response.ok) {
          const data = await response.json();
          setSystemState(data);
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    const interval = setInterval(fetchStatus, 500); // 2 times a second
    return () => clearInterval(interval);
  }, []);

  // Handle Alarm
  useEffect(() => {
    if (systemState.fatigue_score >= 70) {
      if (!isAlarmPlaying && alarmAudio.current) {
        alarmAudio.current.play().catch(e => console.log('Audio play failed:', e));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAlarmPlaying(true);
      }
    } else {
      if (isAlarmPlaying && alarmAudio.current) {
        alarmAudio.current.pause();
        alarmAudio.current.currentTime = 0;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAlarmPlaying(false);
      }
    }
  }, [systemState.fatigue_score, isAlarmPlaying]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Video Feed and Main Alerts */}
      <div className="lg:col-span-8 space-y-6">
        {systemState.status === 'Drowsiness Detected' && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-4 animate-pulse">
            <div className="bg-red-500 text-white rounded-full p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-500 font-bold text-lg">CRITICAL ALERT</h3>
              <p className="text-red-200">Drowsiness detected. Please pull over and rest immediately.</p>
            </div>
          </div>
        )}

        {(systemState.status === 'Warning' || systemState.status === 'Driver Distracted') && (
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 flex items-start space-x-4">
            <div className="bg-amber-500 text-white rounded-full p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-amber-500 font-bold text-lg">
                {systemState.status === 'Driver Distracted' ? 'DRIVER DISTRACTED' : 'WARNING'}
              </h3>
              <p className="text-amber-200">
                {systemState.status === 'Driver Distracted' 
                  ? 'Please keep your eyes on the road.' 
                  : 'Signs of fatigue detected. Maintain focus on the road.'}
              </p>
            </div>
          </div>
        )}

        <VideoFeed />
      </div>

      {/* Right Column: Status and Logs */}
      <div className="lg:col-span-4 space-y-6">
        <StatusPanel status={systemState.status} fatigueScore={systemState.fatigue_score} />
        <LogsPanel logs={systemState.logs} />
      </div>

    </div>
  );
};

export default Dashboard;
