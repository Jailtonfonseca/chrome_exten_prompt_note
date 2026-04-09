import React from 'react';
import { Prompt } from '../types';
import { EditIcon, DeleteIcon, CopyIcon, HeartIcon, HeartIconFilled } from '../constants';
import IconButton from './IconButton';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onToggleFavorite?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onDelete, onCopy, onToggleFavorite }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02]">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{prompt.title}</h3>
          {onToggleFavorite && (
            <IconButton onClick={onToggleFavorite} aria-label="Toggle favorite" title="Favorite">
              {prompt.isFavorite ? (
                <HeartIconFilled className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-red-500" />
              )}
            </IconButton>
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4 h-16">
          {prompt.text}
        </p>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {prompt.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{prompt.tags.length - 3}</span>
            )}
          </div>
        )}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Updated: {formatDate(prompt.updatedAt)}</span>
          {prompt.usageCount !== undefined && prompt.usageCount > 0 && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Used {prompt.usageCount}x</span>
          )}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <IconButton onClick={onCopy} aria-label="Copy prompt" title="Copy">
          <CopyIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
        </IconButton>
        <IconButton onClick={onEdit} aria-label="Edit prompt" title="Edit">
          <EditIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" />
        </IconButton>
        <IconButton onClick={onDelete} aria-label="Delete prompt" title="Delete">
          <DeleteIcon className="w-5 h-5 text-red-500 hover:text-red-400 dark:hover:text-red-300" />
        </IconButton>
      </div>
    </div>
  );
};

export default PromptCard;