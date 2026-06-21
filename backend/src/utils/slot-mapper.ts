/**
 * Maps a date to the corresponding Availability Cycle name.
 * Example: '2026-07-15' -> 'July - 2026'
 */
export const getCycleNameFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[date.getMonth()]} - ${date.getFullYear()}`;
};

/**
 * Maps a date and a slot (e.g., slot1) to the Availability Slot Key (e.g., Monday-slot1)
 * @param dateString YYYY-MM-DD
 * @param classSlot slot1, slot2, etc.
 */
export const getAvailabilitySlotKey = (dateString: string, classSlot: string): string => {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  
  // Normalize slot string to match DB format (slot1, slot2)
  const normalizedSlot = classSlot.toLowerCase();

  return `${dayName}-${normalizedSlot}`;
};
