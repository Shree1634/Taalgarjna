import React from 'react';
import { motion } from 'framer-motion';

export const AudioVisualGlow = ({ cover, isPlaying }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Dynamic Ambient Background Glow */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.08, 1] : 1,
          opacity: isPlaying ? [0.4, 0.6, 0.4] : 0.2,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent-violet via-accent-pink to-accent-cyan opacity-50 blur-3xl"
      />

      {/* Blurred Artwork Reflection */}
      {cover && (
        <div
          className="absolute inset-0 rounded-3xl cover-glow pointer-events-none"
          style={{ backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}
    </div>
  );
};

export default AudioVisualGlow;
