export function calculateStreak(completedDates: string[]) {
    if (!completedDates.length) return { currentStreak: 0, bestStreak: 0 };
  
    const sortedDates = [...completedDates].sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
  
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;
  
    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr);
      currentDate.setHours(0, 0, 0, 0);
  
      if (lastDate) {
        const dayDifference = (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
        if (dayDifference === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
  
      bestStreak = Math.max(bestStreak, tempStreak);
      lastDate = currentDate;
    }
  
    if (lastDate) {
      const lastDateTime = lastDate.getTime();
      const isToday = lastDateTime === today.getTime();
      const isYesterday = lastDateTime === yesterday.getTime();
  
      if (isToday || isYesterday) {
        currentStreak = tempStreak;
      }
    }
  
    return { currentStreak, bestStreak };
  }