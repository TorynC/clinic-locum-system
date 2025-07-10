/**
 * Converts 24-hour time format to 12-hour AM/PM format
 * @param time24 - Time in 24-hour format (e.g., "14:30" or "14:30:00")
 * @returns Time in 12-hour AM/PM format (e.g., "2:30 PM")
 */
export function formatTo12Hour(time24: string): string {
  if (!time24) return '';
  
  // Handle both HH:MM and HH:MM:SS formats
  const [hours, minutes] = time24.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time24; // Return original if invalid
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Formats a time range from 24-hour to 12-hour AM/PM format
 * @param startTime - Start time in 24-hour format
 * @param endTime - End time in 24-hour format
 * @returns Formatted time range (e.g., "9:00 AM - 5:30 PM")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const start = formatTo12Hour(startTime);
  const end = formatTo12Hour(endTime);
  return `${start} - ${end}`;
}
