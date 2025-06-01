import { Prompt, User } from '../types';

const USERS_KEY = 'aiPromptStudio_users';
const LOGGED_IN_USER_KEY = 'aiPromptStudio_loggedInUser';
const PROMPTS_KEY = 'aiPromptStudio_prompts';
const THEME_KEY = 'aiPromptStudio_theme';
const AI_LANGUAGE_KEY = 'aiPromptStudio_aiLanguage';

// Helper to simulate async operations
const simulateAsync = <T>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), 50)); // Short delay

// User Management
export const getUsers = async (): Promise<User[]> => {
  const users = localStorage.getItem(USERS_KEY);
  return simulateAsync(users ? JSON.parse(users) : []);
};

export const saveUsers = async (users: User[]): Promise<void> => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return simulateAsync(undefined);
};

// Logged-in User Management
export const getLoggedInUser = async (): Promise<User | null> => {
  const user = localStorage.getItem(LOGGED_IN_USER_KEY);
  return simulateAsync(user ? JSON.parse(user) : null);
};

export const setLoggedInUser = async (user: User): Promise<void> => {
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
  return simulateAsync(undefined);
};

export const clearLoggedInUser = async (): Promise<void> => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
  return simulateAsync(undefined);
};

// Prompt Management
export const getPrompts = async (userId: string): Promise<Prompt[]> => {
  const allPrompts = localStorage.getItem(PROMPTS_KEY);
  const parsedPrompts: { [userId: string]: Prompt[] } = allPrompts ? JSON.parse(allPrompts) : {};
  return simulateAsync(parsedPrompts[userId] || []);
};

export const savePrompts = async (userId: string, prompts: Prompt[]): Promise<void> => {
  const allPrompts = localStorage.getItem(PROMPTS_KEY);
  const parsedPrompts: { [userId: string]: Prompt[] } = allPrompts ? JSON.parse(allPrompts) : {};
  parsedPrompts[userId] = prompts;
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(parsedPrompts));
  return simulateAsync(undefined);
};

// Theme Management
export const getTheme = async (): Promise<'light' | 'dark'> => {
  const theme = localStorage.getItem(THEME_KEY);
  return simulateAsync(theme === 'dark' ? 'dark' : 'light'); // Default to light
};

export const setTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  localStorage.setItem(THEME_KEY, theme);
  return simulateAsync(undefined);
};

// AI Language Management
export const getAiLanguage = async (): Promise<string> => {
  const language = localStorage.getItem(AI_LANGUAGE_KEY);
  // Default to 'en' if no language is set or found in constants (for safety, though App.tsx will likely use a default from constants)
  return simulateAsync(language || 'en');
};

export const setAiLanguage = async (language: string): Promise<void> => {
  localStorage.setItem(AI_LANGUAGE_KEY, language);
  return simulateAsync(undefined);
};
