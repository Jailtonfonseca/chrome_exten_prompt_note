
import React, { useState, useEffect, useMemo } from 'react';
import { WikiPage } from '../types';
import Modal from './Modal';
import Button from './Button';
import { getWikiPages, getPageByTitle } from '../services/wikiService';

interface WikiPageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialPage?: WikiPage | null;
  userId: string;
}

const WikiPageEditor: React.FC<WikiPageEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPage,
  userId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title: string; id: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    if (initialPage) {
      setTitle(initialPage.title);
      setContent(initialPage.content);
      setTagsInput(initialPage.tags.join(', '));
    } else {
      const prefillTitle = sessionStorage.getItem('wiki_newPageTitle');
      setTitle(prefillTitle || '');
      setContent('');
      setTagsInput('');
      if (prefillTitle) {
        sessionStorage.removeItem('wiki_newPageTitle');
      }
    }
    setShowPreview(false);
  }, [initialPage, isOpen]);

  const parsedContent = useMemo(() => {
    return content.replace(/\[\[([^\]]+)\]\]/g, '<strong>[[$1]]</strong>');
  }, [content]);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (content.includes('[[')) {
        const match = content.substring(0, cursorPosition).match(/\[\[([^\]]*?)$/);
        if (match) {
          const query = match[1].toLowerCase();
          const pages = await getWikiPages(userId);
          const filtered = pages
            .filter(p => p.id !== initialPage?.id && p.title.toLowerCase().includes(query))
            .slice(0, 5);
          setSuggestions(filtered.map(p => ({ title: p.title, id: p.id })));
          setShowSuggestions(filtered.length > 0 && query.length > 0);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    };
    loadSuggestions();
  }, [content, cursorPosition, userId, initialPage?.id]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setContent(value);
    setCursorPosition(position);
  };

  const insertSuggestion = (pageTitle: string) => {
    const before = content.substring(0, cursorPosition).replace(/\[\[[^\]]*?$/, '');
    const after = content.substring(cursorPosition);
    const newContent = `${before}[[${pageTitle}]]${after}`;
    setContent(newContent);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    onSave({
      title: title.trim(),
      content: content.trim(),
      tags,
      links: [],
      userId,
    });
    onClose();
  };

  const renderPreview = () => {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl font-bold mb-4">{title || 'Untitled'}</h1>
        <div className="whitespace-pre-wrap">{parsedContent}</div>
        {tagsInput && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tagsInput.split(',').map(t => t.trim()).filter(t => t).map(tag => (
              <span key={tag} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {initialPage ? 'Edit Page' : 'New Page'}
          </h2>
          <div className="flex gap-2">
            <Button
              variant={showPreview ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <div className="min-h-[300px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
            {renderPreview()}
          </div>
        ) : (
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter page title..."
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content (use [[Page Name]] to link)
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Write your notes here... Use [[Page Name]] to create links to other pages."
                rows={10}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300 resize-none font-mono text-sm"
              />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {suggestions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => insertSuggestion(s.title)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-gray-800 dark:text-gray-200"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="coding, tutorial, notes..."
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!title.trim()}>
            {initialPage ? 'Save Changes' : 'Create Page'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WikiPageEditor;
