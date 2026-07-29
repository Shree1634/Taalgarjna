/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds 
 * @returns {string} Formatted time string (e.g. "03:45")
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
  
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');
  
  return `${formattedMins}:${formattedSecs}`;
}

export default formatTime;
