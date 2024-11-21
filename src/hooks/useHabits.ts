import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Habit } from '../types';
import { calculateStreak } from '../utils/streakCalculator';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('habits')
        .select(`
          id,
          name,
          created_at,
          best_streak,
          habit_completions (
            completion_date
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHabits = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        created_at: habit.created_at,
        best_streak: habit.best_streak,
        completedDates: habit.habit_completions?.map(
          (completion: { completion_date: string }) => completion.completion_date
        ) || []
      }));

      setHabits(formattedHabits);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (name: string): Promise<boolean> => {
    if (!user || !name.trim()) return false;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ 
          name: name.trim(), 
          user_id: user.id,
          created_at: new Date().toISOString(),
          best_streak: 0
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchHabits();
      return true;
    } catch (err) {
      console.error('Error adding habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to add habit');
      return false;
    }
  };

  const toggleHabit = async (id: number, date: string): Promise<void> => {
    if (!user) return;
    
    try {
      const isCompleted = habits
        .find(h => h.id === id)
        ?.completedDates.includes(date);

      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', id)
          .eq('completion_date', date);

        if (error) throw error;
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: id,
            completion_date: date,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Update local state optimistically
      setHabits(prevHabits =>
        prevHabits.map(h => {
          if (h.id !== id) return h;
          return {
            ...h,
            completedDates: isCompleted
              ? h.completedDates.filter(d => d !== date)
              : [...h.completedDates, date]
          };
        })
      );

      // Fetch updated data to ensure consistency
      await fetchHabits();
    } catch (err) {
      console.error('Error toggling habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle habit');
      await fetchHabits();
    }
  };

  const updateHabit = async (id: number, name: string): Promise<void> => {
    if (!user || !name.trim()) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .update({ name: name.trim() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state optimistically
      setHabits(prevHabits =>
        prevHabits.map(h =>
          h.id === id ? { ...h, name: name.trim() } : h
        )
      );
    } catch (err) {
      console.error('Error updating habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update habit');
      // Revert optimistic update on error
      await fetchHabits();
    }
  };

  const deleteHabit = async (id: number): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state optimistically
      setHabits(prevHabits => prevHabits.filter(h => h.id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
      // Revert optimistic update on error
      await fetchHabits();
    }
  };

  return {
    habits,
    loading,
    error,
    fetchHabits,
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit
  };
}; 