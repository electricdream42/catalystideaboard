/*
  # Add delete policy for ideas table

  1. Changes
    - Add policy to allow public deletion of ideas
*/

CREATE POLICY "Allow public delete access on ideas"
  ON ideas FOR DELETE
  TO public
  USING (true);