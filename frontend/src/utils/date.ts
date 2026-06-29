/**
 * Converts a Date object to a YYYY-MM-DD string using local timezone.
 * Using .toISOString().split('T')[0] causes timezone shift bugs depending on local time.
 */
export const getLocalDateString = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
