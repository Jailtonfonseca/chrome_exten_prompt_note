
import React from 'react';
import { WikiPage } from '../types';
import { LinkIcon } from '../constants';

interface BacklinksListProps {
  backlinks: WikiPage[];
  onNavigateToPage: (page: WikiPage) => void;
}

const BacklinksList: React.FC<BacklinksListProps> = ({ backlinks, onNavigateToPage }) => {
  if (backlinks.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No pages link to this page yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
        <LinkIcon className="w-5 h-5 mr-2" />
        Backlinks ({backlinks.length})
      </h3>
      <div className="space-y-2">
        {backlinks.map(page => (
          <button
            key={page.id}
            onClick={() => onNavigateToPage(page)}
            className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <p className="font-medium text-indigo-600 dark:text-indigo-400">{page.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {page.content.substring(0, 100)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BacklinksList;
