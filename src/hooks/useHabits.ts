import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Habit } from '../types';
import { calculateStreak } from '../utils/streakCalculator';
import { useAuth } from '../contexts/AuthContext';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user } = useAuth();

  // Automatically fetch habits when user changes
  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]); // Clear habits when user logs out
    }
  }, [user?.id]); // Depend on user.id to prevent unnecessary rerenders

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      return;
    }
    
    try {
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

      const formattedHabits = (data || []).map(habit => ({
        id: habit.id,
        name: habit.name,
        created_at: habit.created_at,
        best_streak: habit.best_streak,
        completedDates: habit.habit_completions?.map(
          (completion: { completion_date: string }) => completion.completion_date
        ) || []
      }));

      setHabits(formattedHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    }
  };

  const addHabit = async (name: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ 
          name, 
          best_streak: 0,
          created_at: new Date().toISOString(),
          user_id: user.id
        }])
        .select('id')
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
    if (!user) return;
    
    try {
      // First verify this habit belongs to the user
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (habitError || !habitData) {
        throw new Error('Unauthorized access to habit');
      }

      // Keep the original date string without any timezone conversion
      const formattedDate = date;

      console.log('Toggling habit:', { id, date, formattedDate });

      // Check for existing completion
      const { data: existing, error: existingError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', id)
        .eq('completion_date', formattedDate)
        .eq('user_id', user.id)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      if (existing) {
        const { error: deleteError } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', id)
          .eq('completion_date', formattedDate)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from('habit_completions')
          .insert([{ 
            habit_id: id, 
            completion_date: formattedDate,
            user_id: user.id
          }]);

        if (insertError) throw insertError;
      }

      await fetchHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  };

  const updateHabit = async (id: number, name: string) => {
    if (!user) return;
    
    try {
      // First verify this habit belongs to the user
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (habitError || !habitData) {
        throw new Error('Unauthorized access to habit');
      }

      await supabase
        .from('habits')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id);

      await fetchHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (id: number) => {
    if (!user) return;
    
    try {
      // First verify this habit belongs to the user
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (habitError || !habitData) {
        throw new Error('Unauthorized access to habit');
      }

      await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

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