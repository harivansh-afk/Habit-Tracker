import { useState } from 'react';

export const useWeek = () => {
  const [currentWeek, setCurrentWeek] = useState<string[]>([]);

  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const firstDay = new Date(currentWeek[0]);
    const newFirstDay = new Date(firstDay.setDate(firstDay.getDate() + (direction === 'prev' ? -7 : 7)));
    setCurrentWeek(Array.from({ length: 7 }, (_, i) => {
      const date = new Date(newFirstDay);
      date.setDate(newFirstDay.getDate() + i);
      return date.toISOString().split('T')[0];
    }));
  };

  return {
    currentWeek,
    setCurrentWeek,
    getCurrentWeekDates,
    changeWeek
  };
}; 