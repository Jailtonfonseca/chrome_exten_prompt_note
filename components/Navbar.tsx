import React from 'react';
import { PlusIcon, SearchIcon, SunIcon, MoonIcon, SUPPORTED_AI_LANGUAGES } from '../constants';
import { User } from '../types';
import IconButton from './IconButton';

interface NavbarProps {
  currentUser: User | null;
  onNewPrompt: () => void;
  onSearch: (searchTerm: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  aiLanguage: string;
  onAiLanguageChange: (languageCode: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNewPrompt,
  onSearch,
  onLogin,
  onRegister,
  onLogout,
  theme,
  toggleTheme,
  aiLanguage,
  onAiLanguageChange,
}) => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          AI Prompt Studio ✨
        </h1>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
          {currentUser && (
            <div className="relative flex-grow sm:flex-grow-0 order-1 sm:order-none">
              <input
                type="text"
                placeholder="Search prompts..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full sm:w-52 md:w-64 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
                aria-label="Search your prompts"
              />
              <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          )}
          <div className="flex items-center gap-1 order-3 sm:order-none">
            <label htmlFor="aiLanguageSelect" className="text-xs text-gray-700 dark:text-gray-300 hidden sm:inline">AI Language:</label>
            <select
                id="aiLanguageSelect"
                value={aiLanguage}
                onChange={(e) => onAiLanguageChange(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded-md p-1.5 sm:p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
                aria-label="Select AI response language"
              >
                {SUPPORTED_AI_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
          </div>
           <IconButton
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 order-4 sm:order-none"
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </IconButton>
          {currentUser ? (
            <>
              <button
                onClick={onNewPrompt}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center text-sm order-2 sm:order-none"
                aria-label="Create a new prompt"
              >
                <PlusIcon className="w-4 h-4 mr-1 sm:mr-2" />
                New Prompt
              </button>
              <span className="text-gray-700 dark:text-gray-300 text-sm hidden md:inline order-5 sm:order-none">Hi, {currentUser.username}!</span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out text-sm order-6 sm:order-none"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out text-sm order-2 sm:order-none"
                aria-label="Log in to your account"
              >
                Login
              </button>
              <button
                onClick={onRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md transition duration-150 ease-in-out text-sm order-2 sm:order-none"
                aria-label="Register a new account"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
