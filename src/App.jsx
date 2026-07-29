import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/Navbar';
import StickyMiniPlayer from './components/StickyMiniPlayer';
import MusicLibrary from './pages/MusicLibrary';
import MusicPlayer from './pages/MusicPlayer';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MusicLibrary />} />
        <Route path="/player" element={<MusicPlayer />} />
        {/* Fallback to Library for any unknown route */}
        <Route path="*" element={<MusicLibrary />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-accent-violet selection:text-white">
          <Navbar />
          <main className="flex-1 relative">
            <AnimatedRoutes />
          </main>
          <StickyMiniPlayer />
        </div>
      </BrowserRouter>
    </AudioProvider>
  );
}

export default App;
