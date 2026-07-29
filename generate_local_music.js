import fs from 'fs';
import path from 'path';

function createWavTrack(filename, durationSec, rootFreq, bpm, chordProgression) {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const bufferSize = 44 + dataSize;

  const buffer = Buffer.alloc(bufferSize);

  // RIFF Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt Subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data Subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const beatLength = 60 / bpm;
  let offset = 44;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const currentBeat = Math.floor(t / beatLength);
    const chordIndex = Math.floor(currentBeat / 4) % chordProgression.length;
    const chordMultiplier = chordProgression[chordIndex];

    // Main Melody Synth
    const baseFreq = rootFreq * chordMultiplier;
    const melodyPattern = [1, 1.25, 1.5, 1.875, 2, 1.5, 1.25, 1];
    const melodyMult = melodyPattern[Math.floor(t * 4) % melodyPattern.length];
    const melFreq = baseFreq * melodyMult;

    // Oscillators
    const synth1 = Math.sin(2 * Math.PI * melFreq * t);
    const synth2 = Math.sin(2 * Math.PI * (baseFreq * 0.5) * t) * 0.6; // Sub bass
    const pad = (Math.sin(2 * Math.PI * baseFreq * t) + Math.sin(2 * Math.PI * baseFreq * 1.498 * t)) * 0.3; // Warm chord fifth

    // Envelope & Beat Kick/Snare pulse
    const beatPos = (t % beatLength) / beatLength;
    const kickEnvelope = Math.exp(-beatPos * 12);
    const kick = Math.sin(2 * Math.PI * (60 * (1 - beatPos * 0.8)) * t) * kickEnvelope * 0.8;

    const snareEnvelope = (Math.floor(currentBeat) % 2 === 1) ? Math.exp(-beatPos * 20) : 0;
    const snareNoise = (Math.random() * 2 - 1) * snareEnvelope * 0.3;

    // Fade in and out
    const fadeIn = Math.min(1, t / 1.5);
    const fadeOut = Math.min(1, (durationSec - t) / 1.5);
    const masterEnv = fadeIn * fadeOut;

    const leftSample = (synth1 * 0.25 + synth2 * 0.3 + pad * 0.2 + kick * 0.4 + snareNoise * 0.2) * masterEnv;
    const rightSample = (synth1 * 0.25 + synth2 * 0.3 + pad * 0.2 + kick * 0.4 + snareNoise * 0.2) * masterEnv;

    const left16 = Math.max(-32768, Math.min(32767, Math.floor(leftSample * 28000)));
    const right16 = Math.max(-32768, Math.min(32767, Math.floor(rightSample * 28000)));

    buffer.writeInt16LE(left16, offset);
    buffer.writeInt16LE(right16, offset + 2);
    offset += 4;
  }

  fs.writeFileSync(filename, buffer);
  console.log(`Created audio file: ${filename} (${durationSec}s)`);
}

const outputDir = path.join(process.cwd(), 'src', 'assets', 'chaal');

const tracks = [
  { name: 'Antigravity - Midnight Horizon.wav', duration: 140, root: 220, bpm: 110, chord: [1, 1.2, 1.5, 1.33] },
  { name: 'Kavya - Astral Glow.wav', duration: 165, root: 196, bpm: 120, chord: [1, 1.33, 1.5, 1.125] },
  { name: 'Aarav - Velvet Echoes.wav', duration: 130, root: 246.94, bpm: 95, chord: [1, 1.25, 1.498, 1.189] },
  { name: 'TG Collective - Neon Cybernetics.wav', duration: 155, root: 174.61, bpm: 128, chord: [1, 1.5, 1.33, 1.125] },
  { name: 'Rohan - Solar Breeze.wav', duration: 145, root: 261.63, bpm: 105, chord: [1, 1.2, 1.33, 1.5] },
  { name: 'Elysian Sound - Cosmic Resonance.wav', duration: 180, root: 207.65, bpm: 100, chord: [1, 1.25, 1.33, 1.498] },
  { name: 'Ananya - Pulsar Drift.wav', duration: 150, root: 233.08, bpm: 115, chord: [1, 1.33, 1.2, 1.5] },
  { name: 'TG Collective - Quantum Waves.wav', duration: 160, root: 220, bpm: 124, chord: [1, 1.5, 1.25, 1.33] }
];

tracks.forEach(track => {
  createWavTrack(path.join(outputDir, track.name), track.duration, track.root, track.bpm, track.chord);
});
