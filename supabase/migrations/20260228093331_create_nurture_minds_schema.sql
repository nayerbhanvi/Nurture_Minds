/*
  # Nurture Minds - Complete Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `role` (text) - 'parent' or 'child'
      - `full_name` (text)
      - `child_name` (text, nullable) - for parent profiles
      - `age` (integer, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `assessments`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references profiles)
      - `assessment_type` (text) - 'cognitive', 'memory', 'focus', 'reading'
      - `questions` (jsonb) - array of questions and answers
      - `score` (integer)
      - `support_level` (text) - 'mild', 'moderate', 'high'
      - `recommendations` (jsonb)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
    
    - `game_sessions`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references profiles)
      - `game_type` (text) - 'memory', 'focus', 'pattern', 'language'
      - `difficulty_level` (integer)
      - `score` (integer)
      - `time_spent_seconds` (integer)
      - `completed` (boolean)
      - `performance_data` (jsonb)
      - `created_at` (timestamp)
    
    - `progress_tracking`
      - `id` (uuid, primary key)
      - `child_id` (uuid, references profiles)
      - `date` (date)
      - `focus_score` (integer)
      - `memory_score` (integer)
      - `reading_score` (integer)
      - `emotional_stability` (integer)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
    
    - `forum_posts`
      - `id` (uuid, primary key)
      - `author_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `category` (text) - 'autism', 'dyslexia', 'adhd', 'general'
      - `is_anonymous` (boolean, default false)
      - `upvotes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `forum_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references forum_posts)
      - `author_id` (uuid, references profiles)
      - `content` (text)
      - `is_anonymous` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chatbot_conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `question` (text)
      - `answer` (text)
      - `sources` (jsonb, nullable)
      - `helpful` (boolean, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Forum posts readable by all authenticated users
    - Parents can only access their child's data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('parent', 'child')),
  full_name text NOT NULL,
  child_name text,
  age integer,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_type text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer DEFAULT 0,
  support_level text,
  recommendations jsonb DEFAULT '[]'::jsonb,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (child_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (child_id = auth.uid());

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_type text NOT NULL,
  difficulty_level integer DEFAULT 1,
  score integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  performance_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game sessions"
  ON game_sessions FOR SELECT
  TO authenticated
  USING (child_id = auth.uid());

CREATE POLICY "Users can insert own game sessions"
  ON game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (child_id = auth.uid());

CREATE POLICY "Users can update own game sessions"
  ON game_sessions FOR UPDATE
  TO authenticated
  USING (child_id = auth.uid())
  WITH CHECK (child_id = auth.uid());

-- Create progress_tracking table
CREATE TABLE IF NOT EXISTS progress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  focus_score integer DEFAULT 0,
  memory_score integer DEFAULT 0,
  reading_score integer DEFAULT 0,
  emotional_stability integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(child_id, date)
);

ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON progress_tracking FOR SELECT
  TO authenticated
  USING (child_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON progress_tracking FOR INSERT
  TO authenticated
  WITH CHECK (child_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON progress_tracking FOR UPDATE
  TO authenticated
  USING (child_id = auth.uid())
  WITH CHECK (child_id = auth.uid());

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('autism', 'dyslexia', 'adhd', 'general')),
  is_anonymous boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum posts"
  ON forum_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forum posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum comments"
  ON forum_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forum comments"
  ON forum_comments FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own comments"
  ON forum_comments FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own comments"
  ON forum_comments FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sources jsonb,
  helpful boolean,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON chatbot_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own conversations"
  ON chatbot_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON chatbot_conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_child_id ON assessments(child_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_child_id ON game_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_child_id ON progress_tracking(child_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);