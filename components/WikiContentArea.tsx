
import React, { useMemo } from 'react';
import { WikiPage } from '../types';
import { EditIcon, TrashIcon, LinkIcon, CalendarIcon } from '../constants';
import IconButton from './IconButton';
import BacklinksList from './BacklinksList';
import { renderContentWithLinks } from '../services/wikiService';

interface WikiContentAreaProps {
  page: WikiPage;
  backlinks: WikiPage[];
  onEdit: () => void;
  onDelete: () => void;
  onNavigateToPage: (page: WikiPage) => void;
  onCreatePageFromLink: (title: string) => void;
}

const WikiContentArea: React.FC<WikiContentAreaProps> = ({
  page,
  backlinks,
  onEdit,
  onDelete,
  onNavigateToPage,
  onCreatePageFromLink,
}) => {
  const renderedContent = useMemo(() => {
    const html = renderContentWithLinks(page.content);
    return { __html: html };
  }, [page.content]);

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('wiki-link')) {
      e.preventDefault();
      const pageTitle = target.getAttribute('data-page');
      if (pageTitle) {
        const linkedPage = backlinks.find(p => p.title.toLowerCase() === pageTitle.toLowerCase());
        if (linkedPage) {
          onNavigateToPage(linkedPage);
        } else {
          onCreatePageFromLink(pageTitle);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {page.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Created: {formatDate(page.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Updated: {formatDate(page.updatedAt)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <IconButton
              onClick={onEdit}
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Edit page"
            >
              <EditIcon className="w-5 h-5" />
            </IconButton>
            <IconButton
              onClick={onDelete}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Delete page"
            >
              <TrashIcon className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        {page.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {page.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {page.links.length > 0 && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              Links in this page:
            </h3>
            <div className="flex flex-wrap gap-2">
              {page.links.map(linkId => {
                const linkedPage = backlinks.find(p => p.id === linkId);
                return linkedPage ? (
                  <button
                    key={linkId}
                    onClick={() => onNavigateToPage(linkedPage)}
                    className="text-sm px-2 py-1 bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded transition-colors"
                  >
                    {linkedPage.title}
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div
          className="prose dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
          onClick={handleContentClick}
          dangerouslySetInnerHTML={renderedContent}
        />

        <BacklinksList backlinks={backlinks} onNavigateToPage={onNavigateToPage} />
      </div>
    </div>
  );
};

export default WikiContentArea;
