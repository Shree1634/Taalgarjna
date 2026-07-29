import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import defaultSongs from '../data/songs';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [songsList] = useState(defaultSongs);
  const [currentSong, setCurrentSong] = useState(defaultSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'one' | 'all'

  // Singleton HTML5 Audio instance
  const audioRef = useRef(null);

  if (!audioRef.current) {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.8;
    audioRef.current = audio;
  }

  // Bind event listeners to the Audio element safely with complete cleanup per track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Helper to safely extract and validate audio duration
    const syncDuration = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        setDuration(audio.duration);
        setIsMetadataLoaded(true);
      }
    };

    const handleLoadedMetadata = () => {
      syncDuration();
    };

    const handleDurationChange = () => {
      syncDuration();
    };

    const handleCanPlay = () => {
      syncDuration();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Continuous check in case duration resolves late during VBR streaming
      if (!isMetadataLoaded && audio.duration > 0) {
        syncDuration();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleError = (e) => {
      console.error("HTML5 Audio Error:", e);
      setIsPlaying(false);
      setIsMetadataLoaded(false);
    };

    // Attach robust HTML5 Audio event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Initial check if metadata was already cached
    syncDuration();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong]);

  // Handle track ending auto-advance logic safely
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNextTrack();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentSong, isShuffle, repeatMode, songsList]);

  // Helper to get current song index
  const getCurrentIndex = () => {
    if (!currentSong) return 0;
    return songsList.findIndex((s) => s.id === currentSong.id);
  };

  // Play specific song safely resetting metadata state
  const playSong = (song) => {
    if (!song) return;
    const audio = audioRef.current;

    // If clicking the same song that is already loaded
    if (currentSong?.id === song.id && audio.src) {
      if (audio.paused) {
        audio.play().catch(console.error);
      }
      return;
    }

    // Reset track state
    setCurrentSong(song);
    setIsMetadataLoaded(false);
    setDuration(0);
    setCurrentTime(0);

    audio.pause();
    audio.src = song.audio;
    audio.currentTime = 0;
    audio.load();

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Playback start error:", err);
        setIsPlaying(false);
      });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!currentSong && songsList.length > 0) {
      playSong(songsList[0]);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  // Seek to target time in seconds (safely bounded)
  const seek = (targetTime) => {
    const audio = audioRef.current;
    if (!audio || isNaN(targetTime)) return;
    
    const boundedTime = Math.max(0, Math.min(targetTime, duration || audio.duration || targetTime));
    audio.currentTime = boundedTime;
    setCurrentTime(boundedTime);
  };

  // Change volume
  const setVolume = (val) => {
    const audio = audioRef.current;
    const newVol = Math.max(0, Math.min(1, val));
    if (audio) {
      audio.volume = newVol;
    }
    setVolumeState(newVol);
    if (newVol > 0 && isMuted) {
      if (audio) audio.muted = false;
      setIsMuted(false);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const audio = audioRef.current;
    const newMuteState = !isMuted;
    if (audio) {
      audio.muted = newMuteState;
    }
    setIsMuted(newMuteState);
  };

  // Play Next Song logic
  const playNextTrack = () => {
    if (songsList.length === 0) return;
    const currentIndex = getCurrentIndex();
    let nextIndex;

    if (isShuffle && songsList.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * songsList.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = (currentIndex + 1) % songsList.length;
    }

    playSong(songsList[nextIndex]);
  };

  // Play Previous Song logic
  const playPreviousTrack = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (songsList.length === 0) return;
    const currentIndex = getCurrentIndex();
    let prevIndex;

    if (isShuffle && songsList.length > 1) {
      do {
        prevIndex = Math.floor(Math.random() * songsList.length);
      } while (prevIndex === currentIndex);
    } else {
      prevIndex = (currentIndex - 1 + songsList.length) % songsList.length;
    }

    playSong(songsList[prevIndex]);
  };

  // Toggle Shuffle
  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  // Toggle Repeat Mode ('off' -> 'all' -> 'one' -> 'off')
  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const value = {
    songsList,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMetadataLoaded,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    playSong,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    playNextTrack,
    playPreviousTrack,
    toggleShuffle,
    toggleRepeat,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default useAudio;
