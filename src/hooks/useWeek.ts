import { useState } from 'react';
import { getWeekDates, formatDate } from '../utils/dateUtils';

export const useWeek = () => {
  const [currentWeek, setCurrentWeek] = useState<string[]>(getWeekDates());

  const getCurrentWeekDates = () => getWeekDates();

  const changeWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prevWeek => {
      const firstDay = new Date(prevWeek[0]);
      firstDay.setDate(firstDay.getDate() + (direction === 'prev' ? -7 : 7));
      return getWeekDates(firstDay);
    });
  };

  return {
    currentWeek,
    setCurrentWeek,
    getCurrentWeekDates,
    changeWeek
  };
}; 