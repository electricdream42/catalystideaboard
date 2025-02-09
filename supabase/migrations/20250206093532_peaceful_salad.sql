/*
  # Create function to increment votes

  1. New Function
    - `increment_votes`: Safely increments the votes count for an idea
*/

CREATE OR REPLACE FUNCTION increment_votes(idea_id uuid)
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