import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RiSearchLine, RiMusic2Line, RiShuffleFill } from 'react-icons/ri';
import SongCard from '../components/SongCard';
import { useAudio } from '../context/AudioContext';
import { useNavigate } from 'react-router-dom';

export const MusicLibrary = () => {
  const { songsList, playSong, toggleShuffle } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter songs based on search query
  const filteredSongs = songsList.filter((song) => {
    const query = searchTerm.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );
  });

  const handleShufflePlayAll = () => {
    if (songsList.length === 0) return;
    toggleShuffle();
    const randomIndex = Math.floor(Math.random() * songsList.length);
    playSong(songsList[randomIndex]);
    navigate('/player');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 sm:pb-32"
    >
      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
        {/* Background Decorative Mesh Glow */}
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-accent-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-cyan text-xs font-semibold border border-white/10 backdrop-blur-md">
            <RiMusic2Line className="w-3.5 h-3.5" />
            <span>Local Asset Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            TG Chaal Library
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium max-w-xl">
            Explore your curated local chaal tracks with automated rotating artwork and high fidelity sound.
          </p>
        </div>

        {/* Quick Actions & Track Count */}
        <div className="flex items-center justify-between md:justify-end gap-4 z-10 shrink-0 pt-2 md:pt-0">
          <div className="text-left md:text-right mr-2">
            <span className="block text-xl sm:text-2xl font-black text-white">{songsList.length}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Tracks Total</span>
          </div>

          <button
            onClick={handleShufflePlayAll}
            className="flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-accent-violet via-accent-violet to-accent-pink text-white font-bold text-xs sm:text-sm shadow-xl shadow-accent-violet/30 hover:shadow-accent-violet/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RiShuffleFill className="w-5 h-5" />
            <span>Shuffle Play All</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 min-h-[44px] rounded-2xl bg-white/[0.04] border border-white/[0.1] text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-accent-violet/60 focus:bg-white/[0.07] backdrop-blur-xl transition-all"
          />
        </div>

        <div className="text-xs font-semibold text-slate-400 px-1 text-right sm:text-left">
          Showing {filteredSongs.length} of {songsList.length} tracks
        </div>
      </div>

      {/* Songs Cards Grid */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-6">
          {filteredSongs.map((song, index) => (
            <SongCard key={song.id} song={song} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-16 sm:py-20 text-center glass-panel rounded-3xl space-y-3 px-4">
          <RiMusic2Line className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-slate-200">No tracks match your search</h3>
          <p className="text-xs text-slate-400">Try clearing your search query or add more music files to /src/assets/chaal</p>
        </div>
      )}
    </motion.div>
  );
};

export default MusicLibrary;
