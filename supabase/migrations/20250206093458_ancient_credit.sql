/*
  # Create ideas and comments tables

  1. New Tables
    - `ideas`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `author` (text)
      - `votes` (integer)
      - `created_at` (timestamp)
    - `comments`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, foreign key)
      - `text` (text)
      - `author` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (read/write)
*/

CREATE TABLE ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  author text NOT NULL,
  votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  text text NOT NULL,
  author text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on ideas"
  ON ideas FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on ideas"
  ON ideas FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access on ideas"
  ON ideas FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on comments"
  ON comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on comments"
  ON comments FOR INSERT
  TO public
  WITH CHECK (true);