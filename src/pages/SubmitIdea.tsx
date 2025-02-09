import { LightbulbIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IdeaFormData } from '../types';

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    author: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('ideas')
        .insert([{ ...formData, votes: 0 }]);

      if (error) throw error;

      setFormData({ title: '', description: '', author: '' });
      navigate('/vote');
    } catch (error) {
      console.error('Error submitting idea:', error);
      alert('Failed to submit idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 mb-4">
          <LightbulbIcon className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Share Your Ideas</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-200">
            Idea
          </label>
          <input
            type="text"
            id="idea"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-200">
            Your Name
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  );
}