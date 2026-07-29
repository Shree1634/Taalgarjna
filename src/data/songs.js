/**
 * Dynamic Local Song & Cover Asset Loader for TG Chaal Player
 * 
 * Uses Vite's `import.meta.glob` to automatically discover all local music files 
 * inside `/src/assets/chaal` and cover images inside `/src/assets/cover`.
 * 
 * Includes case-insensitive extension matching and natural numeric sorting 
 * (e.g. 1.JPG, 2.JPG, 3.jpg) for reliable rotating cover assignment:
 * `cover = coverList[index % coverList.length]`
 */

// 1. Eagerly glob import all audio files from /src/assets/chaal (matching all case variations)
const musicModules = import.meta.glob('/src/assets/chaal/*', { eager: true });

// 2. Eagerly glob import all cover artwork images from /src/assets/cover (matching all case variations)
const coverModules = import.meta.glob('/src/assets/cover/*', { eager: true });

// Filter valid audio extensions (.mp3, .wav, .m4a, .ogg, .flac, .aac)
const validAudioExts = /\.(mp3|wav|m4a|ogg|flac|aac)$/i;
const sortedAudioPaths = Object.keys(musicModules)
  .filter((path) => validAudioExts.test(path))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

// Filter valid image extensions (.jpg, .jpeg, .png, .webp, .svg)
const validImageExts = /\.(jpg|jpeg|png|webp|svg)$/i;
const sortedCoverPaths = Object.keys(coverModules)
  .filter((path) => validImageExts.test(path))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

// Extract cover image URLs array in natural sorted order (e.g. 1.JPG, 2.JPG, 3.jpg)
const coverUrls = sortedCoverPaths.map((key) => {
  const mod = coverModules[key];
  return typeof mod === 'string' ? mod : mod.default || mod;
});

// Fallback cover artwork generator (SVG glassmorphism gradient fallback)
const defaultCoverFallback = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#311b92" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="circle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0.6" />
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)" />
  <circle cx="300" cy="300" r="180" fill="url(#circle)" />
  <circle cx="300" cy="300" r="60" fill="#0f172a" />
  <circle cx="300" cy="300" r="20" fill="#8b5cf6" />
</svg>
`);

// Helper to parse filename into Artist & Song Title
function parseTrackDetails(filePath, index) {
  const rawFileName = filePath.split('/').pop().replace(/\.[^/.]+$/, "");

  if (rawFileName.includes(' - ')) {
    const parts = rawFileName.split(' - ');
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim(),
    };
  }

  return {
    artist: 'TG Chaal',
    title: rawFileName || `Chaal Track ${index + 1}`,
  };
}

// 3. Build array of song objects with rotating cover assignment
export const songs = sortedAudioPaths.map((filePath, index) => {
  const audioModule = musicModules[filePath];
  const audioUrl = typeof audioModule === 'string' ? audioModule : audioModule.default || audioModule;

  const { artist, title } = parseTrackDetails(filePath, index);

  // Rotating cover assignment system:
  // Song 1 -> Cover 1, Song 2 -> Cover 2, Song 3 -> Cover 3, Song 4 -> Cover 1...
  const assignedCover = coverUrls.length > 0
    ? coverUrls[index % coverUrls.length]
    : defaultCoverFallback;

  return {
    id: `song-${index + 1}`,
    title,
    artist,
    cover: assignedCover,
    audio: audioUrl,
    duration: 0,
  };
});

export default songs;
