import { useEffect, useState } from 'react';
import { Filter, Trophy } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';
import { fetchIdeas } from '../lib/supabaseUtils';
import { Idea, ORGANIZATIONS } from '../types';

export default function Leaderboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadIdeas();
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
      // Sort by votes (highest first)
      const sortedIdeas = [...data].sort((a, b) => b.votes - a.votes);
      setIdeas(sortedIdeas);
      setFilteredIdeas(sortedIdeas);
    } catch (err) {
      console.error('Error loading ideas:', err);
      setError('Failed to load ideas. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Leaderboard</h1>
          <p className="text-slate-600 mt-1">Top ideas ranked by community votes</p>
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
        <div className="p-4 mb-6 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-lg border border-red-200/50 animate-fadeIn">
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
          {filteredIdeas.map((idea, index) => (
            <div key={idea.id} className="relative">
              {index < 3 && (
                <div className={`absolute -left-4 -top-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 ${
                  index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900' : 
                  index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-700' : 
                  'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100'
                } animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                  <Trophy className="w-6 h-6" />
                </div>
              )}
              <IdeaCard idea={idea} showVoteButton={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-morphism rounded-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-100/30 opacity-70 animate-pulse-custom"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-teal-100/30 opacity-70 animate-pulse-custom" style={{ animationDelay: '1.5s' }}></div>
          
          <Trophy className="w-16 h-16 text-slate-400/80 mx-auto mb-4" />
          <h3 className="text-2xl font-medium gradient-text mb-2">No ideas found</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            {selectedOrg 
              ? `There are no ideas for ${selectedOrg} yet.` 
              : 'There are no ideas yet.'}
          </p>
        </div>
      )}
    </div>
  );
}