export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: number
          name: string
          created_at: string
          best_streak: number
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
          best_streak?: number
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
          best_streak?: number
        }
      }
      habit_completions: {
        Row: {
          habit_id: number
          completion_date: string
        }
        Insert: {
          habit_id: number
          completion_date: string
        }
        Update: {
          habit_id?: number
          completion_date?: string
        }
      }
    }
  }
} 