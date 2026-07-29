import React from 'react';
import { formatTime } from '../utils/formatTime';
import { useAudio } from '../context/AudioContext';

export const ProgressBar = () => {
  const { currentTime, duration, isMetadataLoaded, seek } = useAudio();

  const handleSliderChange = (e) => {
    if (!isMetadataLoaded || duration <= 0) return;
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full space-y-1.5">
      {/* Interactive Touch-Friendly Seek Bar */}
      <div className={`relative group flex items-center h-7 ${isMetadataLoaded ? 'cursor-pointer' : 'cursor-wait'} touch-none`}>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          disabled={!isMetadataLoaded || duration <= 0}
          value={currentTime || 0}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Custom Track Background */}
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative backdrop-blur-md">
          {/* Progress Fill Gradient */}
          {isMetadataLoaded ? (
            <div
              className="h-full bg-gradient-to-r from-accent-violet via-accent-pink to-accent-cyan rounded-full transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          ) : (
            <div className="h-full w-full bg-accent-violet/30 animate-pulse rounded-full" />
          )}
        </div>

        {/* Custom Glowing Handle */}
        {isMetadataLoaded && (
          <div
            className="absolute h-5 w-5 rounded-full bg-white shadow-lg shadow-accent-pink/50 pointer-events-none transform -translate-x-1/2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 border border-accent-violet"
            style={{ left: `${progressPercent}%` }}
          />
        )}
      </div>

      {/* Timestamps Display */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
        <span>{formatTime(currentTime)}</span>
        <span>
          {isMetadataLoaded && duration > 0 ? (
            formatTime(duration)
          ) : (
            <span className="text-accent-pink animate-pulse text-[10px]">LOADING...</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
