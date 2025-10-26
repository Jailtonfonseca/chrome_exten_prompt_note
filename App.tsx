
import React, { useState, useEffect, useCallback } from 'react';
import { Prompt, User } from './types';
import { 
  getPrompts, 
  savePrompts, 
  getCurrentUser, 
  logoutUser, 
  getStoredTheme, 
  setStoredTheme,
  getStoredAiLanguage,
  setStoredAiLanguage
} from './services/localStorageService';
import Navbar from './components/Navbar';
import PromptCard from './components/PromptCard';
import PromptEditorModal from './components/PromptEditorModal';
import AuthModal from './components/AuthModal';
import { SUPPORTED_AI_LANGUAGES } from './constants';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  console.log("App component is rendering");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  // Initialize with defaults, load async in useEffect
  const [theme, setTheme] = useState<Theme>('dark'); 
  const [aiLanguage, setAiLanguage] = useState<string>(SUPPORTED_AI_LANGUAGES[0].code);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setPrompts(await getPrompts(user.id));
        }
        
        const storedTheme = await getStoredTheme();
        setTheme(storedTheme || 'dark');
        
        const storedAiLanguage = await getStoredAiLanguage();
        setAiLanguage(storedAiLanguage || SUPPORTED_AI_LANGUAGES[0].code);

      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    // Apply theme class to HTML element only after initial load to avoid flash
    if (!isLoading) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setStoredTheme(theme); // Persist theme
    }
  }, [theme, isLoading]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!isLoading) {
      setStoredAiLanguage(aiLanguage); // Persist AI language
    }
  }, [aiLanguage, isLoading]);

  const handleAiLanguageChange = (languageCode: string) => {
    setAiLanguage(languageCode);
  };

  const handleSavePrompt = useCallback(async (promptToSave: Prompt) => {
    if (!currentUser) return;
    let updatedPrompts;
    const userPrompts = await getPrompts(currentUser.id);
    if (userPrompts.find(p => p.id === promptToSave.id)) {
      updatedPrompts = userPrompts.map(p => p.id === promptToSave.id ? promptToSave : p);
    } else {
      updatedPrompts = [...userPrompts, promptToSave];
    }
    setPrompts(updatedPrompts);
    await savePrompts(currentUser.id, updatedPrompts);
    setIsPromptModalOpen(false);
    setEditingPrompt(null);
  }, [currentUser]);

  const handleOpenPromptModal = (prompt?: Prompt) => {
    if (!currentUser) return;
    setEditingPrompt(prompt || null);
    setIsPromptModalOpen(true);
  };

  const handleDeletePrompt = useCallback(async (id: string) => {
    if (!currentUser) return;
    const userPrompts = await getPrompts(currentUser.id);
    const updatedPrompts = userPrompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    await savePrompts(currentUser.id, updatedPrompts);
  }, [currentUser]);

  const handleCopyPrompt = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Prompt copied to clipboard!')) // Consider using a less intrusive notification for extensions
      .catch(err => console.error('Failed to copy text: ', err));
  }, []);

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setPrompts(await getPrompts(user.id));
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setPrompts([]);
    setSearchTerm('');
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const filteredPrompts = currentUser ? prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.text.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Loading AI Prompt Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <Navbar
        currentUser={currentUser}
        onNewPrompt={handleOpenPromptModal}
        onSearch={setSearchTerm}
        onLogin={() => openAuthModal('login')}
        onRegister={() => openAuthModal('register')}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        aiLanguage={aiLanguage}
        onAiLanguageChange={handleAiLanguageChange}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {!currentUser ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6">Welcome to AI Prompt Studio!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Please log in or register to manage your AI prompts.</p>
            <div className="space-x-4">
              <button
                onClick={() => openAuthModal('login')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Register
              </button>
            </div>
             <p className="text-xs text-gray-500 dark:text-gray-600 mt-12">
              **Security Note:** User authentication in this demo uses a simplified method and is **not secure** for production.
              It's for demonstration purposes only.
            </p>
          </div>
        ) : filteredPrompts.length === 0 && !searchTerm ? (
           <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-400 mb-4">No prompts yet, {currentUser.username}!</h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Click the "New Prompt" button to get started.</p>
            <button
              onClick={() => handleOpenPromptModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center mx-auto"
            >
              Create Your First Prompt
            </button>
          </div>
        ) : filteredPrompts.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-400">No prompts found for "{searchTerm}"</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={() => handleOpenPromptModal(prompt)}
                onDelete={() => handleDeletePrompt(prompt.id)}
                onCopy={() => handleCopyPrompt(prompt.text)}
              />
            ))}
          </div>
        )}
      </main>

      {isPromptModalOpen && currentUser && (
        <PromptEditorModal
          isOpen={isPromptModalOpen}
          onClose={() => {
            setIsPromptModalOpen(false);
            setEditingPrompt(null);
          }}
          onSave={handleSavePrompt}
          initialPrompt={editingPrompt}
          userId={currentUser.id}
          aiLanguage={aiLanguage}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          mode={authModalMode}
          setMode={setAuthModalMode}
        />
      )}

       <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-500 border-t border-gray-300 dark:border-gray-700">
        AI Prompt Studio
      </footer>
    </div>
  );
};

export default App;
