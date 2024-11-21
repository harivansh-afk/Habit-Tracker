import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Habit } from '../types';
import { calculateStreak } from '../utils/streakCalculator';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select(`
          id,
          name,
          created_at,
          best_streak,
          habit_completions (completion_date)
        `);

      if (error) throw error;

      const formattedHabits = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        created_at: habit.created_at,
        best_streak: habit.best_streak,
        completedDates: habit.habit_completions.map(
          (completion: { completion_date: string }) => completion.completion_date
        )
      }));

      setHabits(formattedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    }
  };

  const addHabit = async (name: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .insert([{ 
          name, 
          best_streak: 0,
          created_at: new Date().toISOString() 
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchHabits();
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      return false;
    }
  };

  const toggleHabit = async (id: number, date: string) => {
    try {
      const { data: existing } = await supabase
        .from('habit_completions')
        .select()
        .eq('habit_id', id)
        .eq('completion_date', date)
        .single();

      if (existing) {
        await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', id)
          .eq('completion_date', date);
      } else {
        await supabase
          .from('habit_completions')
          .insert([{ habit_id: id, completion_date: date }]);
      }

      // After toggling, recalculate streak
      const habit = habits.find(h => h.id === id);
      if (habit) {
        const newCompletedDates = existing
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        const { bestStreak } = calculateStreak(newCompletedDates);
        
        // Update best_streak if the new streak is higher
        if (bestStreak > habit.best_streak) {
          await supabase
            .from('habits')
            .update({ best_streak: bestStreak })
            .eq('id', id);
        }
      }

      await fetchHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const updateHabit = async (id: number, name: string) => {
    try {
      await supabase
        .from('habits')
        .update({ name })
        .eq('id', id);
      await fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (id: number) => {
    try {
      await supabase
        .from('habits')
        .delete()
        .eq('id', id);
      await fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  return {
    habits,
    fetchHabits,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit
  };
}; 