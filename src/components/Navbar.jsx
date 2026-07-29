import React from 'react';
import { NavLink } from 'react-router-dom';
import { RiDiscLine, RiMusic2Fill, RiPlayList2Fill } from 'react-icons/ri';
import { useAudio } from '../context/AudioContext';

export const Navbar = () => {
  const { currentSong, isPlaying } = useAudio();

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 sm:py-4 backdrop-blur-xl bg-dark-950/80 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-accent-violet to-accent-pink shadow-lg shadow-accent-violet/25">
            <RiMusic2Fill className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-pink"></span>
              </span>
            )}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
              TG <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">CHAAL</span>
            </h1>
            <p className="hidden xs:block text-[11px] sm:text-xs text-slate-400 font-medium">Local Chaal Suite</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-accent-violet to-accent-violet/80 text-white shadow-lg shadow-accent-violet/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`
            }
          >
            <RiPlayList2Fill className="w-4 h-4" />
            <span>Chaal Library</span>
          </NavLink>

          <NavLink
            to="/player"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-accent-violet to-accent-violet/80 text-white shadow-lg shadow-accent-violet/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`
            }
          >
            <RiDiscLine className={`w-4 h-4 ${isPlaying ? 'animate-spin-slow text-accent-pink' : ''}`} />
            <span>Player</span>
          </NavLink>
        </nav>

        {/* Desktop Current Playing Badge */}
        {currentSong ? (
          <NavLink
            to="/player"
            className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all min-h-[44px]"
          >
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0"
            />
            <div className="text-left pr-1 max-w-[130px] truncate">
              <p className="text-xs font-semibold text-white truncate">{currentSong.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentSong.artist}</p>
            </div>
          </NavLink>
        ) : (
          <div className="w-4 sm:w-8"></div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
