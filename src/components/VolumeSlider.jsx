import React from 'react';
import { RiVolumeMuteFill, RiVolumeDownFill, RiVolumeUpFill } from 'react-icons/ri';
import { useAudio } from '../context/AudioContext';

export const VolumeSlider = () => {
  const { volume, isMuted, setVolume, toggleMute } = useAudio();

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <RiVolumeMuteFill className="w-5 h-5 text-red-400" />;
    if (volume < 0.5) return <RiVolumeDownFill className="w-5 h-5 text-slate-300" />;
    return <RiVolumeUpFill className="w-5 h-5 text-slate-100" />;
  };

  const activeVol = isMuted ? 0 : volume;

  return (
    <div className="flex items-center gap-3 glass-panel px-3.5 sm:px-4 py-2 rounded-2xl border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
      <button
        onClick={toggleMute}
        className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>

      <div className="relative flex items-center flex-1 sm:w-32 h-6">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={activeVol}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-violet to-accent-pink rounded-full"
            style={{ width: `${activeVol * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VolumeSlider;
