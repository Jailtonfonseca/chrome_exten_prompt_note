
import React, { useState, useMemo } from 'react';
import { WikiPage } from '../types';
import { PlusIcon, SearchIcon, DocumentTextIcon, TagIcon } from '../constants';
import IconButton from './IconButton';

interface WikiSidebarProps {
  pages: WikiPage[];
  selectedPage: WikiPage | null;
  onSelectPage: (page: WikiPage) => void;
  onCreatePage: () => void;
}

const WikiSidebar: React.FC<WikiSidebarProps> = ({
  pages,
  selectedPage,
  onSelectPage,
  onCreatePage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    pages.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [pages]);

  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = searchTerm === '' || 
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = activeTag === null || page.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [pages, searchTerm, activeTag]);

  return (
    <div className="w-full md:w-72 lg:w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 space-y-3">
        <button
          onClick={onCreatePage}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Page
        </button>

        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <TagIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1" />
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                activeTag === null 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  tag === activeTag 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filteredPages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchTerm || activeTag ? 'No pages found' : 'No pages yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredPages.map(page => (
              <button
                key={page.id}
                onClick={() => onSelectPage(page)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedPage?.id === page.id
                    ? 'bg-indigo-100 dark:bg-indigo-900 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-transparent'
                }`}
              >
                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {page.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {page.content.substring(0, 60)}...
                </p>
                {page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {page.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {page.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{page.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WikiSidebar;
