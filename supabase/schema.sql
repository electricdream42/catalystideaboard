-- This file documents the required database schema for the Catalyst Group Ideaboard
-- You can run these commands in the Supabase SQL Editor to set up your database

-- Ideas table to store all submitted ideas
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  organization TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table to store comments on ideas
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track votes to prevent duplicate voting
CREATE TABLE IF NOT EXISTS public.idea_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, voter_id)
);

-- Function to increment votes safely
CREATE OR REPLACE FUNCTION increment_votes(idea_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ideas
  SET votes = votes + 1
  WHERE id = idea_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
-- Ideas can be read by anyone
CREATE POLICY "Ideas are viewable by everyone" 
ON public.ideas FOR SELECT 
USING (true);

-- Ideas can be inserted by anyone
CREATE POLICY "Ideas can be created by anyone" 
ON public.ideas FOR INSERT 
WITH CHECK (true);

-- Ideas can only be deleted by the creator (would require auth)
-- For now, we'll allow deletion without auth for demo purposes
CREATE POLICY "Ideas can be deleted by anyone" 
ON public.ideas FOR DELETE 
USING (true);

-- Comments can be read by anyone
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

-- Comments can be inserted by anyone
CREATE POLICY "Comments can be created by anyone" 
ON public.comments FOR INSERT 
WITH CHECK (true);

-- Votes can be read by anyone
CREATE POLICY "Votes are viewable by everyone" 
ON public.idea_votes FOR SELECT 
USING (true);

-- Votes can be inserted by anyone
CREATE POLICY "Votes can be created by anyone" 
ON public.idea_votes FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ideas_organization_idx ON public.ideas(organization);
CREATE INDEX IF NOT EXISTS comments_idea_id_idx ON public.comments(idea_id);
CREATE INDEX IF NOT EXISTS idea_votes_idea_id_idx ON public.idea_votes(idea_id);
CREATE INDEX IF NOT EXISTS idea_votes_voter_id_idx ON public.idea_votes(voter_id); 