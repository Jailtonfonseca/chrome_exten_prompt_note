import React from 'react';
import { Prompt } from '../types';
import { EditIcon, DeleteIcon, CopyIcon } from '../constants';
import IconButton from './IconButton';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onEdit, onDelete, onCopy }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02]">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{prompt.title}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4 h-16">
          {prompt.text}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {formatDate(prompt.updatedAt)}
        </p>
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