
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { XMarkIcon } from '../constants';
import { User } from '../types';
import { loginUser, registerUser } from '../services/localStorageService';
import Spinner from './Spinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void; // Keep this synchronous if App.tsx handles the async part
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, mode, setMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Username and password cannot be empty.");
      setIsLoading(false);
      return;
    }

    try {
      let user: User | null = null;
      if (mode === 'login') {
        user = await loginUser(username, password);
      } else {
        user = await registerUser(username, password);
      }
      if (user) {
        onLoginSuccess(user); // This will trigger async operations in App.tsx
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setUsername('');
    setPassword('');
  };
  
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full relative transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400 text-center">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>
        {error && <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="authUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input
              id="authUsername"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
              placeholder="Enter your username"
              autoComplete="username"
              aria-required="true"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="authPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              id="authPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-300"
              placeholder="Enter your password"
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              aria-required="true"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
              {isLoading ? <Spinner size="sm" /> : (mode === 'login' ? 'Login' : 'Register')}
            </Button>
            <Button type="button" onClick={toggleMode} variant="ghost" disabled={isLoading} className="w-full">
              {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AuthModal;
