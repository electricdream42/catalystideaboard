/*
  # Add vote tracking table

  1. New Tables
    - `idea_votes`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `voter_id` (text, to store user identifier)
      - `created_at` (timestamp)

  2. Changes
    - Add unique constraint to prevent multiple votes
    - Enable RLS
    - Add policies for vote access
*/

CREATE TABLE idea_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  voter_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, voter_id)
);

ALTER TABLE idea_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on idea_votes"
  ON idea_votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on idea_votes"
  ON idea_votes FOR INSERT
  TO public
  WITH CHECK (true);

-- Update the increment_votes function to use the votes table
CREATE OR REPLACE FUNCTION increment_votes(idea_id uuid, voter_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the vote record first (will fail if already voted)
  INSERT INTO idea_votes (idea_id, voter_id)
  VALUES (idea_id, voter_id);
  
  -- If successful, increment the vote count
  UPDATE ideas
  SET votes = votes + 1
  WHERE id = idea_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Already voted';
END;
$$;