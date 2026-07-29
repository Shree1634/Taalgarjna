import React from 'react';
import { motion } from 'framer-motion';
import { RiPlayFill, RiVolumeUpFill } from 'react-icons/ri';
import { formatTime } from '../utils/formatTime';
import { useAudio } from '../context/AudioContext';
import { useNavigate } from 'react-router-dom';

export const SongCard = ({ song, index }) => {
  const { currentSong, isPlaying, playSong } = useAudio();
  const navigate = useNavigate();

  const isSelected = currentSong?.id === song.id;

  const handleCardClick = () => {
    playSong(song);
    navigate('/player');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`group relative cursor-pointer rounded-2xl p-3 sm:p-4 transition-all duration-300 ${
        isSelected
          ? 'glass-panel border-accent-violet/60 shadow-xl shadow-accent-violet/20 bg-accent-violet/[0.12]'
          : 'glass-card'
      }`}
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-dark-900 shadow-md">
        <img
          src={song.cover}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-violet text-white shadow-xl shadow-accent-violet/50 transition-transform duration-300 transform scale-75 group-hover:scale-100">
            <RiPlayFill className="h-6 w-6 ml-0.5" />
          </div>
        </div>

        {/* Active Track Playing Badge */}
        {isSelected && (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 rounded-full bg-accent-violet/95 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
            <RiVolumeUpFill className={`h-3.5 w-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
        )}
      </div>

      {/* Track Information */}
      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-1.5">
          <h3 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
            isSelected ? 'text-accent-pink' : 'text-slate-100 group-hover:text-white'
          }`}>
            {song.title}
          </h3>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 shrink-0">
            {formatTime(song.duration)}
          </span>
        </div>
        <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate group-hover:text-slate-300">
          {song.artist}
        </p>
      </div>
    </motion.div>
  );
};

export default SongCard;
