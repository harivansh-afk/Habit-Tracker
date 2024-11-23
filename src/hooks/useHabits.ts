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

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // Fetch all completions for user's habits
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id);

      if (completionsError) throw completionsError;

      // Combine habits with their completions
      const habitsWithCompletions = habitsData.map(habit => ({
        ...habit,
        completedDates: completionsData
          .filter(completion => completion.habit_id === habit.id)
          .map(completion => completion.completion_date)
      }));

      setHabits(habitsWithCompletions);
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for habits and completions
  useEffect(() => {
    if (!user) return;

    // Subscribe to habits changes
    const habitsSubscription = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchHabits();
        }
      )
      .subscribe();

    // Subscribe to habit completions changes
    const completionsSubscription = supabase
      .channel('completions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habit_completions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchHabits();
        }
      )
      .subscribe();

    // Initial fetch
    fetchHabits();

    // Cleanup subscriptions
    return () => {
      habitsSubscription.unsubscribe();
      completionsSubscription.unsubscribe();
    };
  }, [user]);

  const addHabit = async (name: string): Promise<boolean> => {
    if (!user || !name.trim()) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .insert([{
          name: name.trim(),
          user_id: user.id,
          created_at: new Date().toISOString(),
          best_streak: 0
        }])
        .select();

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
      const habit = habits.find(h => h.id === id);
      if (!habit) throw new Error('Habit not found');

      const isCompleted = habit.completedDates.includes(date);

      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', id)
          .eq('completion_date', date)
          .eq('user_id', user.id);

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

    } catch (err) {
      console.error('Error toggling habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle habit');
      // Refresh habits to ensure consistency
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
    addHabit,
    toggleHabit,
    updateHabit,
    deleteHabit,
    fetchHabits
  };
};
