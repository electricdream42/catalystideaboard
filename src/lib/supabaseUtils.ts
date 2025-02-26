import { supabase } from './supabase';
import { Idea, Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch all ideas with their comments
 */
export async function fetchIdeas(): Promise<Idea[]> {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*, comments(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert comments to the right format
    return data.map((idea: any) => ({
      ...idea,
      comments: idea.comments || [],
    }));
  } catch (error) {
    console.error('Error fetching ideas:', error);
    throw error;
  }
}

/**
 * Fetch top ideas by votes
 */
export async function fetchTopIdeas(): Promise<Idea[]> {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('votes', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching top ideas:', error);
    throw error;
  }
}

/**
 * Fetch ideas for a specific organization
 */
export async function fetchIdeasByOrganization(organization: string): Promise<Idea[]> {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*, comments(*)')
      .eq('organization', organization)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert comments to the right format
    return data.map((idea: any) => ({
      ...idea,
      comments: idea.comments || [],
    }));
  } catch (error) {
    console.error(`Error fetching ideas for ${organization}:`, error);
    throw error;
  }
}

/**
 * Submit a new idea
 */
export async function submitIdea(idea: Omit<Idea, 'id' | 'votes' | 'created_at' | 'comments'>): Promise<Idea> {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .insert([{ ...idea, votes: 0 }])
      .select()
      .single();

    if (error) throw error;

    return { ...data, comments: [] };
  } catch (error) {
    console.error('Error submitting idea:', error);
    throw error;
  }
}

/**
 * Vote for an idea
 */
export async function voteForIdea(ideaId: string, voterId: string): Promise<void> {
  try {
    // Record the vote
    const { error: voteError } = await supabase
      .from('idea_votes')
      .insert([{ idea_id: ideaId, voter_id: voterId }]);

    if (voteError) throw voteError;

    // Increment the vote count
    const { error: updateError } = await supabase
      .rpc('increment_votes', { idea_id: ideaId });

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error voting for idea:', error);
    throw error;
  }
}

/**
 * Add a comment to an idea
 */
export async function addComment(
  ideaId: string, 
  text: string, 
  author: string
): Promise<Comment> {
  try {
    const newComment = {
      id: uuidv4(),
      idea_id: ideaId,
      text,
      author,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('comments')
      .insert([newComment]);

    if (error) throw error;

    return newComment as Comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

/**
 * Delete an idea
 */
export async function deleteIdea(ideaId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', ideaId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
}

/**
 * Fetch voted ideas for a user
 */
export async function fetchVotedIdeas(voterId: string): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from('idea_votes')
      .select('idea_id')
      .eq('voter_id', voterId);

    if (error) throw error;

    return new Set(data.map(vote => vote.idea_id));
  } catch (error) {
    console.error('Error fetching voted ideas:', error);
    throw error;
  }
} 