import { useState } from 'react';

export const useWeek = () => {
  const [currentWeek, setCurrentWeek] = useState<string[]>([]);

  const getCurrentWeekDates = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    if (currentWeek.length === 0) return;
    
    const firstDay = new Date(currentWeek[0]);
    firstDay.setHours(0, 0, 0, 0);
    const newFirstDay = new Date(firstDay);
    newFirstDay.setDate(firstDay.getDate() + (direction === 'prev' ? -7 : 7));
    
    setCurrentWeek(Array.from({ length: 7 }, (_, i) => {
      const date = new Date(newFirstDay);
      date.setDate(newFirstDay.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }));
  };

  return {
    currentWeek,
    setCurrentWeek,
    getCurrentWeekDates,
    changeWeek
  };
}; 