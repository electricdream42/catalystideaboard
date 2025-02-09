import { useEffect, useState } from 'react';
import { Vote } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';
import { supabase } from '../lib/supabase';
import { Comment, Idea } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function VoteIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [voterId] = useState(() => {
    // Get or create a unique voter ID
    const storedId = localStorage.getItem('voterId');
    if (storedId) return storedId;
    const newId = uuidv4();
    localStorage.setItem('voterId', newId);
    return newId;
  });
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('votedIdeas');
    return new Set(stored ? JSON.parse(stored) : []);
  });

  useEffect(() => {
    fetchIdeas();
    fetchVotedIdeas();
  }, []);

  const fetchVotedIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_votes')
        .select('idea_id')
        .eq('voter_id', voterId);

      if (error) throw error;

      const votedSet = new Set(data.map(vote => vote.idea_id));
      setVotedIdeas(votedSet);
      localStorage.setItem('votedIdeas', JSON.stringify(Array.from(votedSet)));
    } catch (error) {
      console.error('Error fetching voted ideas:', error);
    }
  };

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*, comments(*)');

      if (error) throw error;

      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      alert('Failed to load ideas. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (votedIdeas.has(id)) {
      alert('You have already voted for this idea');
      return;
    }

    try {
      const { error } = await supabase.rpc('increment_votes', { 
        idea_id: id,
        voter_id: voterId
      });

      if (error) {
        if (error.message === 'Already voted') {
          alert('You have already voted for this idea');
          return;
        }
        throw error;
      }
      
      // Update local state
      const newVotedIdeas = new Set(votedIdeas);
      newVotedIdeas.add(id);
      setVotedIdeas(newVotedIdeas);
      localStorage.setItem('votedIdeas', JSON.stringify(Array.from(newVotedIdeas)));

      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleComment = async (ideaId: string, text: string, author: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ idea_id: ideaId, text, author }])
        .select()
        .single();

      if (error) throw error;

      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId
            ? { ...idea, comments: [...(idea.comments || []), data] }
            : idea
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('Failed to delete idea. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
          <Vote className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-black dark:text-white">Vote on Ideas</h1>
        <p className="mt-2 text-gray-300">
          Support the ideas you believe will make our community better
        </p>
        {loading ? (
          <p className="mt-8 text-gray-400 text-center">Loading ideas...</p>
        ) : ideas.length === 0 && (
          <p className="mt-8 text-gray-400 text-center">
            No ideas have been submitted yet. Be the first to share your idea!
          </p>
        )}
      </div>

      <div className="space-y-6">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onVote={handleVote}
            onComment={handleComment}
            hasVoted={votedIdeas.has(idea.id)}
          />
        ))}
      </div>
    </div>
  );
}