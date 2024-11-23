// Simple date formatting without timezone complications
export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get day index (0-6) where Monday is 0 and Sunday is 6
  export const getDayIndex = (date: Date): number => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Get dates for current week starting from Monday
  export const getWeekDates = (baseDate: Date = new Date()): string[] => {
    const current = new Date(baseDate);
    const dayIndex = getDayIndex(current);

    // Adjust to Monday
    current.setDate(current.getDate() - dayIndex);

    // Generate dates starting from Monday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      date.setDate(current.getDate() + i);
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
