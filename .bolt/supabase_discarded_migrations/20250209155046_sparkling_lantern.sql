/*
  # Update voting system to use IP addresses

  1. Changes
    - Add IP address column to idea_votes table
    - Update increment_votes function to use IP instead of voter_id
    - Add unique constraint on idea_id and ip_address

  2. Security
    - Maintain RLS policies
    - Ensure IP addresses are properly handled
*/

-- Add IP address column and update unique constraint
ALTER TABLE idea_votes
DROP CONSTRAINT idea_votes_idea_id_voter_id_key,
ADD COLUMN ip_address text NOT NULL,
ADD CONSTRAINT idea_votes_idea_id_ip_key UNIQUE(idea_id, ip_address);

-- Update the increment_votes function to use IP address
CREATE OR REPLACE FUNCTION increment_votes(idea_id uuid, ip_address text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the vote record first (will fail if already voted from this IP)
  INSERT INTO idea_votes (idea_id, ip_address, voter_id)
  VALUES (idea_id, ip_address, 'ip-' || ip_address);
  
  -- If successful, increment the vote count
  UPDATE ideas
  SET votes = votes + 1
  WHERE id = idea_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Already voted';
END;
$$;