// Simple date formatting without timezone complications
export const formatDate = (date: Date): string => {
  // Create a new date object at midnight UTC
  const d = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));
  return d.toISOString().split('T')[0];
};

  // Get day index (0-6) where Monday is 0 and Sunday is 6
  export const getDayIndex = (date: Date): number => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Get dates for current week starting from Monday
  export const getWeekDates = (baseDate: Date = new Date()): string[] => {
    // Create date at midnight UTC
    const current = new Date(Date.UTC(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate()
    ));
    const dayIndex = getDayIndex(current);

    // Adjust to Monday
    current.setUTCDate(current.getUTCDate() - dayIndex);

    // Generate dates starting from Monday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      date.setUTCDate(current.getUTCDate() + i);
      dates.push(formatDate(date));
    }

    return dates;
  };

  // Get the first day of the month adjusted for Monday start
  export const getFirstDayOfMonth = (year: number, month: number): number => {
    const date = new Date(year, month, 1);
    return getDayIndex(date);
  };

  // Check if two dates are the same day
  export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Add helper function to convert local date to UTC midnight
  export const getUTCMidnight = (date: Date): Date => {
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
  };
