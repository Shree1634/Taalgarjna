import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiPlayFill, RiPauseFill, RiSkipForwardFill, RiDiscLine } from 'react-icons/ri';
import { useAudio } from '../context/AudioContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const StickyMiniPlayer = () => {
  const { currentSong, isPlaying, togglePlayPause, playNextTrack, currentTime, duration } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();

  // Do not render mini player on the full Player page or if no song is loaded
  if (location.pathname === '/player' || !currentSong) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 z-40 max-w-4xl mx-auto"
      >
        <div
          onClick={() => navigate('/player')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel border border-white/15 p-2.5 sm:p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl bg-dark-900/90 transition-all active:scale-[0.99]"
        >
          {/* Subtle Top Progress Fill Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-accent-violet to-accent-pink transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Artwork & Details */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-dark-950 shadow-md">
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-dark-950/40 flex items-center justify-center">
                    <RiDiscLine className="w-6 h-6 text-accent-pink animate-spin-slow" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-accent-pink transition-colors">
                  {currentSong.title}
                </h4>
                <p className="text-xs font-medium text-slate-400 truncate">
                  {currentSong.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={togglePlayPause}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-accent-violet text-white flex items-center justify-center shadow-lg shadow-accent-violet/30 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <RiPauseFill className="w-6 h-6" />
                ) : (
                  <RiPlayFill className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <button
                onClick={playNextTrack}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl glass-button text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                title="Next Track"
              >
                <RiSkipForwardFill className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyMiniPlayer;
