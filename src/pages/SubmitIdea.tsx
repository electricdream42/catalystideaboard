import { LightbulbIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitIdea } from '../lib/supabaseUtils';
import { IdeaFormData, ORGANIZATIONS } from '../types';

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    author: '',
    organization: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await submitIdea(formData);
      setFormData({ title: '', description: '', author: '', organization: '' });
      navigate('/vote');
    } catch (err) {
      console.error('Error submitting idea:', err);
      setError('Failed to submit idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 mb-6 shadow-lg relative overflow-hidden animate-float">
          <div className="absolute inset-0 bg-white/20 animate-shimmer rounded-full"></div>
          <LightbulbIcon className="w-12 h-12 text-white relative z-10" />
          <Sparkles className="w-5 h-5 text-white absolute top-4 right-4 animate-pulse-custom" />
        </div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Share Your Ideas</h2>
        <p className="text-slate-600 max-w-md mx-auto">Contribute to innovation and make a difference with your creative solutions</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-morphism p-8 rounded-xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-purple-100/50 opacity-70 animate-pulse-custom"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-teal-100/50 opacity-70 animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
        
        {error && (
          <div className="p-4 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-lg border border-red-200/50 animate-fadeIn mb-6">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="idea" className="block text-sm font-medium text-slate-700">
              Idea Title
            </label>
            <input
              type="text"
              id="idea"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input focus:ring-2 focus:ring-purple-500/20"
              required
              placeholder="Enter a concise title for your idea"
            />
          </div>

          <div className="transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="organization" className="block text-sm font-medium text-slate-700">
              Organization
            </label>
            <select
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="input focus:ring-2 focus:ring-purple-500/20"
              required
            >
              <option value="">Select an organization</option>
              {ORGANIZATIONS.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>

          <div className="transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="input focus:ring-2 focus:ring-purple-500/20"
              required
              placeholder="Describe your idea in detail. What problem does it solve? How would it be implemented?"
            />
          </div>

          <div className="transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="author" className="block text-sm font-medium text-slate-700">
              Your Name
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="input focus:ring-2 focus:ring-purple-500/20"
              required
              placeholder="Enter your full name"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full flex justify-center py-3 px-4 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Idea'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}