import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import IdeaCard from '../components/IdeaCard';
import { supabase } from '../lib/supabase';
import { Idea } from '../types';

export default function Leaderboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopIdeas();
  }, []);

  const fetchTopIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*, comments(*)')
        .order('votes', { ascending: false });

      if (error) throw error;

      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching top ideas:', error);
      alert('Failed to load leaderboard. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
          <Trophy className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Top Ideas</h1>
        <p className="mt-2 text-gray-300">
          Click the arrow to view full descriptions
        </p>
        {loading ? (
          <p className="mt-8 text-gray-400 text-center">Loading leaderboard...</p>
        ) : ideas.length === 0 && (
          <p className="mt-8 text-gray-400 text-center">
            No ideas have been submitted yet. Share your ideas to see them here!
          </p>
        )}
      </div>

      <div className="space-y-6">
        {ideas.map((idea, index) => (
          <div key={idea.id} className="relative">
            {index < 3 && (
              <div className="absolute -left-4 top-6 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-bold">
                {index + 1}
              </div>
            )}
            <IdeaCard idea={idea} showVoteButton={false} />
          </div>
        ))}
      </div>
    </div>
  );
}