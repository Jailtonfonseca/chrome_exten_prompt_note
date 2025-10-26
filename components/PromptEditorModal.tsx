import React, { useState, useEffect, useCallback } from 'react';
import { Prompt } from '../types';
import Modal from './Modal';
import Button from './Button';
import { SparklesIcon, VariationsIcon, XMarkIcon, LightBulbIcon } from '../constants';
import { improvePromptWithGemini, generatePromptVariationsWithGemini, getPromptEnhancementIdeasWithGemini } from '../services/geminiService';
import Spinner from './Spinner';

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
  initialPrompt?: Prompt | null;
  userId: string;
  aiLanguage: string;
}

const PromptEditorModal: React.FC<PromptEditorModalProps> = ({ isOpen, onClose, onSave, initialPrompt, userId, aiLanguage }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isLoadingImprove, setIsLoadingImprove] = useState(false);
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);
  const [isLoadingEnhancements, setIsLoadingEnhancements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedVariations, setSuggestedVariations] = useState<string[]>([]);
  const [enhancementIdeas, setEnhancementIdeas] = useState<string[]>([]);

  useEffect(() => {
    if (initialPrompt) {
      setTitle(initialPrompt.title);
      setText(initialPrompt.text);
    } else {
      setTitle('');
      setText('');
    }
    setError(null);
    setSuggestedVariations([]);
    setEnhancementIdeas([]);
  }, [initialPrompt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      setError("Title and prompt text cannot be empty.");
      return;
    }
    if (!userId) {
      setError("User information is missing. Cannot save prompt.");
      return;
    }
    const now = new Date().toISOString();
    onSave({
      id: initialPrompt?.id || crypto.randomUUID(),
      userId: initialPrompt?.userId || userId,
      title,
      text,
      createdAt: initialPrompt?.createdAt || now,
      updatedAt: now,
    });
    onClose(); 
  };

  const handleImprovePrompt = useCallback(async () => {
    if (!text.trim()) {
      setError("Cannot improve an empty prompt.");
      return;
    }
    setIsLoadingImprove(true);
    setError(null);
    setSuggestedVariations([]);
    setEnhancementIdeas([]);
    try {
      const improvedText = await improvePromptWithGemini(text, aiLanguage);
      setText(improvedText);
    } catch (err) {
      console.error("Gemini API error (improve):", err);
      setError(err instanceof Error ? err.message : "Failed to improve prompt. Check API key and network.");
    } finally {
      setIsLoadingImprove(false);
    }
  }, [text, aiLanguage]);

  const handleGenerateVariations = useCallback(async () => {
    if (!text.trim()) {
      setError("Cannot generate variations for an empty prompt.");
      return;
    }
    setIsLoadingVariations(true);
    setError(null);
    setSuggestedVariations([]);
    setEnhancementIdeas([]);
    try {
      const variations = await generatePromptVariationsWithGemini(text, aiLanguage);
      setSuggestedVariations(variations);
    } catch (err) {
      console.error("Gemini API error (variations):", err);
      setError(err instanceof Error ? err.message : "Failed to generate variations. Check API key and network.");
    } finally {
      setIsLoadingVariations(false);
    }
  }, [text, aiLanguage]);

  const handleGetEnhancementIdeas = useCallback(async () => {
    if (!text.trim()) {
      setError("Cannot get ideas for an empty prompt.");
      return;
    }
    setIsLoadingEnhancements(true);
    setError(null);
    setSuggestedVariations([]);
    setEnhancementIdeas([]);
    try {
      const ideas = await getPromptEnhancementIdeasWithGemini(text, aiLanguage);
      setEnhancementIdeas(ideas);
    } catch (err)
 {
      console.error("Gemini API error (enhancement ideas):", err);
      setError(err instanceof Error ? err.message : "Failed to get enhancement ideas. Check API key and network.");
    } finally {
      setIsLoadingEnhancements(false);
    }
  }, [text, aiLanguage]);

  const handleIdeaClick = (idea: string) => {
    setText(prevText => (prevText.trim() ? prevText.trim() + " " : "") + idea.trim());
  };
  
  const anyLoading = isLoadingImprove || isLoadingVariations || isLoadingEnhancements;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full relative transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">
          {initialPrompt ? 'Edit Prompt' : 'Create New Prompt'}
        </h2>
        {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="promptTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              id="promptTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
              placeholder="e.g., Marketing Email Subject"
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Text</label>
            <textarea
              id="promptText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
              placeholder="Enter your AI prompt here..."
              aria-required="true"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <Button
              type="button"
              onClick={handleImprovePrompt}
              variant="secondary"
              disabled={anyLoading}
              className="w-full"
            >
              {isLoadingImprove ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
              Improve 
            </Button>
            <Button
              type="button"
              onClick={handleGenerateVariations}
              variant="secondary"
              disabled={anyLoading}
              className="w-full"
            >
              {isLoadingVariations ? <Spinner size="sm" /> : <VariationsIcon className="w-5 h-5 mr-2" />}
              Variations
            </Button>
            <Button
              type="button"
              onClick={handleGetEnhancementIdeas}
              variant="secondary"
              disabled={anyLoading}
              className="w-full"
            >
              {isLoadingEnhancements ? <Spinner size="sm" /> : <LightBulbIcon className="w-5 h-5 mr-2" />}
              Suggest Ideas
            </Button>
          </div>

          {(enhancementIdeas.length > 0 || suggestedVariations.length > 0) && (
             <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-4 transition-colors duration-300">
                {enhancementIdeas.length > 0 && (
                <div>
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Enhancement Ideas:</h4>
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                    {enhancementIdeas.map((idea, index) => (
                        <li 
                        key={index} 
                        className="text-sm text-gray-800 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors" 
                        onClick={() => handleIdeaClick(idea)}
                        title="Click to append to prompt"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleIdeaClick(idea)}
                        >
                        {idea}
                        </li>
                    ))}
                    </ul>
                </div>
                )}

                {suggestedVariations.length > 0 && (
                <div>
                    <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Suggested Variations:</h4>
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                    {suggestedVariations.map((variation, index) => (
                        <li 
                        key={index} 
                        className="text-sm text-gray-800 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors" 
                        onClick={() => setText(variation)}
                        title="Click to use this variation"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setText(variation)}
                        >
                        {variation}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
          )}


          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
            <Button type="submit" variant="primary" disabled={anyLoading || !userId}>
              {anyLoading ? <Spinner size="sm" /> : (initialPrompt ? 'Save Changes' : 'Create Prompt')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PromptEditorModal;
