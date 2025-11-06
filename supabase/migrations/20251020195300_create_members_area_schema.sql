/*
  # Create Petiscos Gordo Members Area Schema

  ## Overview
  This migration creates the complete database structure for the Petiscos Gordo members area,
  including course content, user progress tracking, and community features.

  ## New Tables
  
  ### 1. profiles
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. modules
  - `id` (uuid, primary key) - Unique module identifier
  - `title` (text) - Module name
  - `description` (text) - Module description
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 3. lessons
  - `id` (uuid, primary key) - Unique lesson identifier
  - `module_id` (uuid, foreign key) - References modules table
  - `title` (text) - Lesson name
  - `description` (text) - Lesson description
  - `content_type` (text) - Type: 'video', 'article', 'pdf', 'mixed'
  - `content_url` (text) - YouTube URL, Google link, etc.
  - `content_text` (text, nullable) - Additional text content
  - `order_index` (integer) - Display order within module
  - `duration_minutes` (integer, nullable) - Estimated duration
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 4. user_progress
  - `id` (uuid, primary key) - Unique progress record
  - `user_id` (uuid, foreign key) - References auth.users
  - `lesson_id` (uuid, foreign key) - References lessons table
  - `completed` (boolean) - Completion status
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `created_at` (timestamptz) - First access timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 5. extra_recipes
  - `id` (uuid, primary key) - Unique recipe identifier
  - `title` (text) - Recipe name
  - `description` (text) - Recipe description
  - `content_type` (text) - Type: 'pdf', 'link', 'article'
  - `content_url` (text) - Recipe URL or file
  - `category` (text) - Recipe category
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 6. support_tickets
  - `id` (uuid, primary key) - Unique ticket identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `subject` (text) - Ticket subject
  - `message` (text) - User's message
  - `status` (text) - Status: 'open', 'in_progress', 'resolved'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can view and update their own profile
  - Modules & Lessons: All authenticated users can read (course content)
  - User Progress: Users can view and update their own progress
  - Extra Recipes: All authenticated users can read
  - Support Tickets: Users can create and view their own tickets

  ## Important Notes
  - All timestamps use timezone-aware types
  - Foreign key constraints ensure data integrity
  - Indexes added for frequently queried columns
  - Default values set for status fields and timestamps
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  content_type text NOT NULL,
  content_url text NOT NULL,
  content_text text,
  order_index integer NOT NULL,
  duration_minutes integer,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create extra_recipes table
CREATE TABLE IF NOT EXISTS extra_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content_type text NOT NULL,
  content_url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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

-- Modules policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view modules"
  ON modules FOR SELECT
  TO authenticated
  USING (true);

-- Lessons policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- User progress policies
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Extra recipes policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view extra recipes"
  ON extra_recipes FOR SELECT
  TO authenticated
  USING (true);

-- Support tickets policies
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);