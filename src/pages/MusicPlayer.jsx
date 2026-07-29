import React from 'react';
import { motion } from 'framer-motion';
import {
  RiPlayFill as PlayIcon,
  RiPauseFill as PauseIcon,
  RiSkipBackFill as PrevIcon,
  RiSkipForwardFill as NextIcon,
  RiShuffleLine as ShuffleIcon,
  RiRepeatLine as RepeatIcon,
  RiRepeatOneLine as RepeatOneIcon,
  RiArrowLeftLine as BackIcon,
  RiMusic2Fill as MusicIcon
} from 'react-icons/ri';
import { useAudio } from '../context/AudioContext';
import ProgressBar from '../components/ProgressBar';
import VolumeSlider from '../components/VolumeSlider';
import AudioVisualGlow from '../components/AudioVisualGlow';
import { useNavigate } from 'react-router-dom';

export const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    isShuffle,
    repeatMode,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
    toggleShuffle,
    toggleRepeat,
  } = useAudio();

  const navigate = useNavigate();

  if (!currentSong) {
    return (
      <div className="max-w-md mx-auto my-16 sm:my-20 p-6 sm:p-8 glass-panel rounded-3xl text-center space-y-4">
        <MusicIcon className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg sm:text-xl font-bold text-white">No Track Selected</h2>
        <p className="text-xs sm:text-sm text-slate-400">Please choose a song from your library to start playing.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 min-h-[44px] rounded-xl bg-accent-violet text-white font-semibold text-sm"
        >
          Go to Library
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-[calc(100dvh-90px)] flex flex-col justify-between"
    >
      {/* Dynamic Ambient Background Glow Container */}
      <AudioVisualGlow cover={currentSong.cover} isPlaying={isPlaying} />

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[44px] rounded-xl glass-button text-slate-300 hover:text-white text-xs font-semibold"
        >
          <BackIcon className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-300">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent-emerald animate-pulse' : 'bg-slate-500'}`} />
          <span>{isPlaying ? 'NOW PLAYING' : 'PAUSED'}</span>
        </div>
      </div>

      {/* Main Center Player Card */}
      <div className="relative z-10 my-auto flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 py-4 sm:py-6 w-full">
        
        {/* Large Album Artwork with Subtle Glow */}
        <motion.div
          animate={{ scale: isPlaying ? 1.02 : 0.98 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative group w-56 h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 shrink-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/15"
        >
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dynamic Playing Overlay Ring */}
          {isPlaying && (
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
          )}
        </motion.div>

        {/* Track Info & Full Controls Suite */}
        <div className="w-full max-w-lg space-y-5 sm:space-y-6 text-center md:text-left">
          
          {/* Metadata Title & Artist */}
          <div className="space-y-1.5 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight truncate">
              {currentSong.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-300 truncate">
              {currentSong.artist}
            </p>
          </div>

          {/* Progress Bar & Timestamps */}
          <div className="pt-1 sm:pt-2">
            <ProgressBar />
          </div>

          {/* Main Audio Controls Bar */}
          <div className="flex flex-col gap-5 sm:gap-6 pt-1 sm:pt-2">
            <div className="flex items-center justify-between sm:justify-center md:justify-between gap-2 sm:gap-6">
              
              {/* Shuffle Button (Minimum 44x44px touch target) */}
              <button
                onClick={toggleShuffle}
                className={`w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center transition-all ${
                  isShuffle
                    ? 'bg-accent-violet/30 text-accent-cyan border border-accent-cyan/40 shadow-lg shadow-accent-cyan/20'
                    : 'glass-button text-slate-400 hover:text-white'
                }`}
                title={isShuffle ? 'Shuffle Enabled' : 'Shuffle Disabled'}
              >
                <ShuffleIcon className="w-5 h-5" />
              </button>

              {/* Previous Track Button */}
              <button
                onClick={playPreviousTrack}
                className="w-12 h-12 sm:w-14 sm:h-14 min-h-[48px] min-w-[48px] rounded-2xl glass-button text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
                title="Previous Song"
              >
                <PrevIcon className="w-6 h-6" />
              </button>

              {/* Play / Pause Toggle Hero Button */}
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 sm:w-20 sm:h-20 min-h-[64px] min-w-[64px] rounded-3xl bg-gradient-to-tr from-accent-violet via-accent-violet to-accent-pink text-white flex items-center justify-center shadow-2xl shadow-accent-violet/50 hover:shadow-accent-violet/70 hover:scale-105 active:scale-95 transition-all shrink-0"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8 sm:w-9 sm:h-9" />
                ) : (
                  <PlayIcon className="w-8 h-8 sm:w-9 sm:h-9 ml-1" />
                )}
              </button>

              {/* Next Track Button */}
              <button
                onClick={playNextTrack}
                className="w-12 h-12 sm:w-14 sm:h-14 min-h-[48px] min-w-[48px] rounded-2xl glass-button text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition-all"
                title="Next Song"
              >
                <NextIcon className="w-6 h-6" />
              </button>

              {/* 3-Mode Repeat Button */}
              <button
                onClick={toggleRepeat}
                className={`w-11 h-11 sm:w-12 sm:h-12 min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center relative transition-all ${
                  repeatMode !== 'off'
                    ? 'bg-accent-violet/30 text-accent-pink border border-accent-pink/40 shadow-lg shadow-accent-pink/20'
                    : 'glass-button text-slate-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode.toUpperCase()}`}
              >
                {repeatMode === 'one' ? (
                  <RepeatOneIcon className="w-5 h-5" />
                ) : (
                  <RepeatIcon className="w-5 h-5" />
                )}

                {repeatMode !== 'off' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase tracking-tighter text-accent-pink">
                    {repeatMode === 'one' ? '1' : 'ALL'}
                  </span>
                )}
              </button>

            </div>

            {/* Volume Control Bar */}
            <div className="flex items-center justify-center md:justify-start pt-1">
              <VolumeSlider />
            </div>

          </div>

        </div>

      </div>

      <div className="h-2"></div>
    </motion.div>
  );
};

export default MusicPlayer;
