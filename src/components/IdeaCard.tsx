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

  return (
    <div className="bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 transition-all hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold text-black dark:text-white ${!showVoteButton ? 'mr-4' : ''}`}>{idea.title}</h3>
          {isExpanded && (
            <div className="mt-2">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{idea.description}</p>
              {showVoteButton && (
                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-black dark:text-white">{idea.author}</span>
                  <span className="mx-2">·</span>
                  <span>{typeof idea.created_at === 'string' 
                    ? new Date(idea.created_at).toLocaleDateString()
                    : idea.created_at.toLocaleDateString()}</span>
                  <button
                    onClick={() => setIsCommenting(!isCommenting)}
                    className="ml-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{idea.comments?.length || 0} Comments</span>
                  </button>
                </div>
              )}
            </div>
          )}
          {!isExpanded && showVoteButton && (
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-black dark:text-white">{idea.author}</span>
              <span className="mx-2">·</span>
              <span>{typeof idea.created_at === 'string' 
                ? new Date(idea.created_at).toLocaleDateString()
                : idea.created_at.toLocaleDateString()}</span>
              <button
                onClick={() => setIsCommenting(!isCommenting)}
                className="ml-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{idea.comments?.length || 0} Comments</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-start gap-2">
          {!showVoteButton ? (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="font-bold text-2xl">{idea.votes}</span>
                <ArrowBigUpIcon className="w-5 h-5" />
              </div>
            </>
          ) : null}
          {showVoteButton && (
          <button
            onClick={() => onVote?.(idea.id)}
            disabled={hasVoted}
            className={`flex flex-col items-center ml-4 p-2 rounded-lg transition-all ${
              hasVoted 
                ? 'cursor-not-allowed bg-emerald-100 dark:bg-emerald-900' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={hasVoted ? 'Already voted' : 'Vote for this idea'}
          >
            <ArrowBigUpIcon 
              className={`w-6 h-6 ${
                hasVoted 
                  ? 'text-emerald-600 dark:text-emerald-400 fill-current' 
                  : 'text-black dark:text-white'
              }`} 
            />
            <span className="text-sm font-medium text-black dark:text-white">{idea.votes}</span>
          </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this idea?')) {
                  setIsDeleting(true);
                  onDelete(idea.id);
                }
              }}
              disabled={isDeleting}
              className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {isCommenting && (
        <form onSubmit={handleSubmitComment} className="mt-4 space-y-3">
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={comment.author}
              onChange={(e) => setComment({ ...comment, author: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-black dark:text-white placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400"
              required
            />
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment.text}
              onChange={(e) => setComment({ ...comment, text: e.target.value })}
              className="flex-1 px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-l-md text-black dark:text-white placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-r-md hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
      
      {idea.comments && idea.comments.length > 0 && (
        <div className="mt-4 space-y-3">
          {idea.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-black dark:text-white">{comment.author}</span>
                <span className="mx-1">·</span>
                <span>{typeof comment.created_at === 'string'
                  ? new Date(comment.created_at).toLocaleDateString()
                  : comment.created_at.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}