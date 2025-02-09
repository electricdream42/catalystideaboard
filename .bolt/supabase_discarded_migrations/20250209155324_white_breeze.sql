/*
  # Remove vote restrictions

  1. Changes
    - Drop idea_votes table since we no longer need to track individual votes
    - Update increment_votes function to allow multiple votes
*/

-- Drop the idea_votes table since we don't need to track individual votes anymore
DROP TABLE IF EXISTS idea_votes;

-- Update the increment_votes function to simply increment votes without restrictions
CREATE OR REPLACE FUNCTION increment_votes(idea_id uuid, voter_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ideas
  SET votes = votes + 1
  WHERE id = idea_id;
END;
$$;