import { useState } from 'react';
import { Habit } from '../types';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habits');
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    }
  };

  const addHabit = async (name: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchHabits();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding habit:', error);
      return false;
    }
  };

  const toggleHabit = async (id: number, date: string) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      await fetchHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const updateHabit = async (id: number, name: string) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      await fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: 'DELETE',
      });
      await fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const updateStreak = async (id: number, newStreak: number) => {
    if (newStreak < 0) return;

    try {
      await fetch(`http://localhost:5000/api/habits/${id}/streak`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streak: newStreak }),
      });
      setHabits(habits.map(habit =>
        habit.id === id ? { ...habit, manualStreak: newStreak } : habit
      ));
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  return {
    habits,
    fetchHabits,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    updateStreak
  };
}; 