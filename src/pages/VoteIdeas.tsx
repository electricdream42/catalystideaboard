import { useEffect, useState } from 'react';
import { Filter, Vote } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';
import { fetchIdeas, fetchVotedIdeas, voteForIdea, addComment, deleteIdea } from '../lib/supabaseUtils';
import { Idea, ORGANIZATIONS } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function VoteIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
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
    loadIdeas();
    loadVotedIdeas();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      setFilteredIdeas(ideas.filter(idea => idea.organization === selectedOrg));
    } else {
      setFilteredIdeas(ideas);
    }
  }, [selectedOrg, ideas]);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchIdeas();
      setIdeas(data);
      setFilteredIdeas(data);
    } catch (err) {
      console.error('Error loading ideas:', err);
      setError('Failed to load ideas. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadVotedIdeas = async () => {
    try {
      const votedSet = await fetchVotedIdeas(voterId);
      setVotedIdeas(votedSet);
      localStorage.setItem('votedIdeas', JSON.stringify(Array.from(votedSet)));
    } catch (err) {
      console.error('Error loading voted ideas:', err);
      // Non-critical error, don't show to user
    }
  };

  const handleVote = async (id: string) => {
    if (votedIdeas.has(id)) return;

    try {
      // Optimistically update UI
      setVotedIdeas(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
      localStorage.setItem('votedIdeas', JSON.stringify(Array.from(votedIdeas)));
      
      setIdeas(prev => 
        prev.map(idea => 
          idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
        )
      );

      // Update the database
      await voteForIdea(id, voterId);
    } catch (err) {
      console.error('Error voting for idea:', err);
      
      // Revert optimistic update on error
      setVotedIdeas(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      setIdeas(prev => 
        prev.map(idea => 
          idea.id === id ? { ...idea, votes: idea.votes - 1 } : idea
        )
      );
      
      setError('Failed to register vote. Please try again.');
    }
  };

  const handleComment = async (ideaId: string, text: string, author: string) => {
    try {
      const newComment = await addComment(ideaId, text, author);
      
      // Update local state
      setIdeas(prev => 
        prev.map(idea => 
          idea.id === ideaId 
            ? { 
                ...idea, 
                comments: [...(idea.comments || []), newComment] 
              } 
            : idea
        )
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIdea(id);
      
      // Update local state
      setIdeas(prev => prev.filter(idea => idea.id !== id));
      setFilteredIdeas(prev => prev.filter(idea => idea.id !== id));
    } catch (err) {
      console.error('Error deleting idea:', err);
      setError('Failed to delete idea. Please try again.');
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Vote on Ideas</h1>
          <p className="text-slate-600 mt-1">Support the innovations that inspire you</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-lg border border-red-200/50 animate-fadeIn relative">
          <button 
            onClick={clearError}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            &times;
          </button>
          {error}
        </div>
      )}

      {showFilters && (
        <div className="mb-8 glass-morphism p-6 rounded-xl relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-purple-100/30 opacity-70 animate-pulse-custom"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-teal-100/30 opacity-70 animate-pulse-custom" style={{ animationDelay: '1.5s' }}></div>
          
          <h2 className="text-lg font-medium text-slate-800 mb-4">Filter by Organization</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedOrg('')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedOrg === '' 
                  ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md' 
                  : 'bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/80 shadow-sm'
              }`}
            >
              All Organizations
            </button>
            {ORGANIZATIONS.map(org => (
              <button
                key={org}
                onClick={() => setSelectedOrg(org)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedOrg === org 
                    ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md' 
                    : 'bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/80 shadow-sm'
                }`}
              >
                {org}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 glass-morphism rounded-xl">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 animate-pulse-custom"></div>
            </div>
          </div>
        </div>
      ) : filteredIdeas.length > 0 ? (
        <div className="space-y-6">
          {filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onVote={handleVote}
              onComment={handleComment}
              onDelete={handleDelete}
              hasVoted={votedIdeas.has(idea.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-morphism rounded-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-100/30 opacity-70 animate-pulse-custom"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-teal-100/30 opacity-70 animate-pulse-custom" style={{ animationDelay: '1.5s' }}></div>
          
          <Vote className="w-16 h-16 text-slate-400/80 mx-auto mb-4" />
          <h3 className="text-2xl font-medium gradient-text mb-2">No ideas found</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {selectedOrg 
              ? `There are no ideas for ${selectedOrg} yet. Be the first to submit one!` 
              : 'There are no ideas yet. Be the first to submit one!'}
          </p>
        </div>
      )}
    </div>
  );
}