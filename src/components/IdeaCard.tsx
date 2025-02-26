import { ArrowBigUpIcon, ChevronDown, ChevronUp, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onVote?: (id: string) => void;
  onComment?: (id: string, text: string, author: string) => void;
  onDelete?: (id: string) => void;
  showVoteButton?: boolean;
  hasVoted?: boolean;
}

export default function IdeaCard({ 
  idea, 
  onVote, 
  onComment, 
  onDelete,
  showVoteButton = true,
  hasVoted = false
}: IdeaCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState({ text: '', author: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showVoteButton);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.text && comment.author && onComment) {
      onComment(idea.id, comment.text, comment.author);
      setComment({ text: '', author: '' });
      setIsCommenting(false);
    }
  };

  // Function to get organization badge color
  const getOrgColor = (org: string) => {
    const colors = {
      "Swasti": "bg-purple-100/80 text-purple-800",
      "Vrutti": "bg-teal-100/80 text-teal-800",
      "Fuzhio": "bg-purple-100/80 text-purple-800",
      "Green Foundation": "bg-teal-100/80 text-teal-800",
      "Catalyst Foundation": "bg-purple-100/80 text-purple-800",
      "Solvist Financial Services": "bg-teal-100/80 text-teal-800",
      "Impact Catalysts Foundation": "bg-purple-100/80 text-purple-800"
    };
    
    return colors[org as keyof typeof colors] || "bg-slate-100/80 text-slate-800";
  };

  return (
    <div className="glass-morphism p-6 rounded-xl relative overflow-hidden transition-all hover:shadow-lg">
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-purple-100/20 opacity-50 animate-pulse-custom"></div>
      <div className="absolute -bottom-12 -left-12 w-20 h-20 rounded-full bg-teal-100/20 opacity-50 animate-pulse-custom" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${getOrgColor(idea.organization)}`}>
              {idea.organization}
            </span>
          </div>
          <h3 className={`text-lg font-semibold text-slate-800 ${!showVoteButton ? 'mr-4' : ''}`}>{idea.title}</h3>
          {isExpanded && (
            <div className="mt-2">
              <p className="text-slate-600 whitespace-pre-wrap">{idea.description}</p>
              {showVoteButton && (
                <div className="mt-4 flex items-center text-sm text-slate-500">
                  <span className="font-medium text-slate-700">{idea.author}</span>
                  <span className="mx-2">·</span>
                  <span>{typeof idea.created_at === 'string' 
                    ? new Date(idea.created_at).toLocaleDateString()
                    : idea.created_at.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {showVoteButton && (
          <div className="flex flex-col items-center ml-4">
            <button 
              onClick={() => onVote && onVote(idea.id)}
              disabled={hasVoted}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                hasVoted 
                  ? 'bg-gradient-to-r from-purple-500/20 to-teal-500/20 backdrop-blur-sm text-purple-500 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-teal-500/10 hover:text-purple-500 hover:backdrop-blur-sm'
              }`}
              aria-label="Vote for this idea"
            >
              <ArrowBigUpIcon className="w-6 h-6" />
              <span className="text-sm font-medium mt-1">{idea.votes}</span>
            </button>
          </div>
        )}
        
        {!showVoteButton && (
          <div className="flex items-center ml-4">
            <div className="flex items-center bg-gradient-to-r from-purple-100/80 to-teal-100/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <ArrowBigUpIcon className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-purple-700">{idea.votes}</span>
            </div>
          </div>
        )}
      </div>
      
      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-2 flex items-center text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronDown className="w-4 h-4 mr-1" />
          Show more
        </button>
      )}
      
      {isExpanded && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <button 
              onClick={() => setIsCommenting(!isCommenting)}
              className="flex items-center text-sm text-slate-500 hover:text-slate-700"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {idea.comments?.length || 0} Comments
            </button>
            
            {onDelete && (
              <button 
                onClick={() => setIsDeleting(true)}
                className="flex items-center text-sm text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            )}
          </div>
          
          {isDeleting && (
            <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm rounded-lg border border-red-100/50">
              <p className="text-sm text-red-800 mb-3">Are you sure you want to delete this idea? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (onDelete) {
                      onDelete(idea.id);
                    }
                    setIsDeleting(false);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-md hover:from-red-600 hover:to-red-700"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-3 py-1 bg-slate-200/80 backdrop-blur-sm text-slate-800 text-sm rounded-md hover:bg-slate-300/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {isCommenting && (
            <form onSubmit={handleSubmitComment} className="mt-4 space-y-3">
              <div>
                <input
                  type="text"
                  value={comment.author}
                  onChange={(e) => setComment({ ...comment, author: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-slate-300/70 rounded-md bg-white/80 backdrop-blur-sm text-slate-800 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={comment.text}
                  onChange={(e) => setComment({ ...comment, text: e.target.value })}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-slate-300/70 rounded-l-md bg-white/80 backdrop-blur-sm text-slate-800 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-r-md hover:from-purple-700 hover:to-teal-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
          
          {idea.comments && idea.comments.length > 0 && (
            <div className="mt-4 space-y-3">
              {idea.comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-slate-200/50">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-800">{comment.author}</span>
                    <span className="text-xs text-slate-500">
                      {typeof comment.created_at === 'string'
                        ? new Date(comment.created_at).toLocaleDateString()
                        : comment.created_at.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(false)}
            className="mt-4 flex items-center text-sm text-slate-500 hover:text-slate-700"
          >
            <ChevronUp className="w-4 h-4 mr-1" />
            Show less
          </button>
        </>
      )}
    </div>
  );
}