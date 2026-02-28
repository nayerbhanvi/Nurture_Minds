import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  role: 'parent' | 'child';
  full_name: string;
  child_name?: string;
  age?: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Assessment = {
  id: string;
  child_id: string;
  assessment_type: string;
  questions: any[];
  score: number;
  support_level?: string;
  recommendations: any[];
  completed_at: string;
  created_at: string;
};

export type GameSession = {
  id: string;
  child_id: string;
  game_type: string;
  difficulty_level: number;
  score: number;
  time_spent_seconds: number;
  completed: boolean;
  performance_data: any;
  created_at: string;
};

export type ForumPost = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'autism' | 'dyslexia' | 'adhd' | 'general';
  is_anonymous: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
};

export type ProgressTracking = {
  id: string;
  child_id: string;
  date: string;
  focus_score: number;
  memory_score: number;
  reading_score: number;
  emotional_stability: number;
  notes?: string;
  created_at: string;
};
