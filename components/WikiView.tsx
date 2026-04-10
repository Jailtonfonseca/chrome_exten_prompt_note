
import React, { useState, useEffect, useCallback } from 'react';
import { WikiPage } from '../types';
import WikiSidebar from './WikiSidebar';
import WikiContentArea from './WikiContentArea';
import WikiPageEditor from './WikiPageEditor';
import {
  getWikiPages,
  createWikiPage,
  updateWikiPage,
  deleteWikiPage,
  getBacklinks,
} from '../services/wikiService';
import { DocumentTextIcon } from '../constants';

interface WikiViewProps {
  userId: string;
}

const WikiView: React.FC<WikiViewProps> = ({ userId }) => {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [backlinks, setBacklinks] = useState<WikiPage[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<WikiPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPages = useCallback(async () => {
    const loadedPages = await getWikiPages(userId);
    setPages(loadedPages);
    if (loadedPages.length > 0 && !selectedPage) {
      setSelectedPage(loadedPages[0]);
    }
    setIsLoading(false);
  }, [userId, selectedPage]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    const loadBacklinks = async () => {
      if (selectedPage) {
        const bl = await getBacklinks(userId, selectedPage.id);
        setBacklinks(bl);
      }
    };
    loadBacklinks();
  }, [selectedPage, userId]);

  const handleCreatePage = () => {
    setEditingPage(null);
    setIsEditorOpen(true);
  };

  const handleEditPage = () => {
    if (selectedPage) {
      setEditingPage(selectedPage);
      setIsEditorOpen(true);
    }
  };

  const handleSavePage = async (pageData: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPage) {
      const updated = await updateWikiPage(userId, { ...editingPage, ...pageData });
      setPages(pages.map(p => p.id === updated.id ? updated : p));
      setSelectedPage(updated);
    } else {
      const created = await createWikiPage(userId, pageData);
      setPages([...pages, created]);
      setSelectedPage(created);
    }
    setIsEditorOpen(false);
    setEditingPage(null);
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;
    if (!confirm(`Delete "${selectedPage.title}"? This cannot be undone.`)) return;
    
    await deleteWikiPage(userId, selectedPage.id);
    const newPages = pages.filter(p => p.id !== selectedPage.id);
    setPages(newPages);
    setSelectedPage(newPages.length > 0 ? newPages[0] : null);
  };

  const handleNavigateToPage = (page: WikiPage) => {
    setSelectedPage(page);
  };

  const handleCreatePageFromLink = (title: string) => {
    setEditingPage(null);
    setTitle(title);
    setIsEditorOpen(true);
  };

  const setTitle = (title: string) => {
    // This is a workaround to pre-fill the title when creating from a link
    // We'll use sessionStorage for this
    sessionStorage.setItem('wiki_newPageTitle', title);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Loading wiki...</p>
      </div>
    );
  }

  if (pages.length === 0 && !isEditorOpen) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <DocumentTextIcon className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your Wiki is Empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          Create your first page to start building your personal knowledge base.
          Link pages together using [[Page Name]] syntax.
        </p>
        <button
          onClick={handleCreatePage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Create Your First Page
        </button>
        <WikiPageEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSavePage}
          initialPage={editingPage}
          userId={userId}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <WikiSidebar
        pages={pages}
        selectedPage={selectedPage}
        onSelectPage={handleNavigateToPage}
        onCreatePage={handleCreatePage}
      />
      {selectedPage ? (
        <WikiContentArea
          page={selectedPage}
          backlinks={pages}
          onEdit={handleEditPage}
          onDelete={handleDeletePage}
          onNavigateToPage={handleNavigateToPage}
          onCreatePageFromLink={handleCreatePageFromLink}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Select a page to view</p>
        </div>
      )}
      <WikiPageEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPage(null);
          sessionStorage.removeItem('wiki_newPageTitle');
        }}
        onSave={handleSavePage}
        initialPage={editingPage}
        userId={userId}
      />
    </div>
  );
};

export default WikiView;
