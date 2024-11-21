export interface UserPreferences {
  id: string;
  user_id: string;
  show_streaks: boolean;
  daily_reminder: boolean;
  default_view: 'habits' | 'calendar';
  habit_sort: 'dateCreated' | 'alphabetical';
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export type PreferenceUpdate = Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>; 