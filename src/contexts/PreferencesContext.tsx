import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPreferences, PreferenceUpdate } from '../types/preferences';
import { useAuth } from './AuthContext';

interface PreferencesContextType {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: PreferenceUpdate) => Promise<void>;
  retryFetch: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Log the user and connection status
      console.log('Current user:', user);
      console.log('Supabase connection:', supabase);

      // First, try to fetch existing preferences
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        
        // If the error is that no rows were found, create default preferences
        if (fetchError.code === 'PGRST116') {
          const defaultPreferences = {
            user_id: user.id,
            show_streaks: true,
            daily_reminder: false,
            default_view: 'habits' as const,
            habit_sort: 'dateCreated' as const,
            theme: 'light' as const
          };

          console.log('Creating default preferences:', defaultPreferences);

          const { data: newData, error: insertError } = await supabase
            .from('user_preferences')
            .insert([defaultPreferences])
            .select()
            .single();

          if (insertError) {
            console.error('Insert error:', insertError);
            throw insertError;
          }

          console.log('Created preferences:', newData);
          setPreferences(newData);
          return;
        }

        throw fetchError;
      }

      console.log('Fetched preferences:', data);
      setPreferences(data);

    } catch (err) {
      console.error('Error in fetchPreferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: PreferenceUpdate) => {
    if (!user || !preferences) return;

    try {
      console.log('Updating preferences:', updates);
      
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Updated preferences:', data);
      setPreferences(data);
    } catch (err) {
      console.error('Error in updatePreferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    }
  };

  const retryFetch = async () => {
    await fetchPreferences();
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      loading, 
      error, 
      updatePreferences,
      retryFetch 
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 