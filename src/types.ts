export interface Habit {
  id: number;
  name: string;
  created_at: string;
  best_streak: number;
  completedDates: string[];
}