
import { Prompt, User } from '../types';

const PROMPTS_KEY_PREFIX = 'aiPromptStudio_prompts_';
const USERS_KEY = 'aiPromptStudio_users';
const CURRENT_USER_SESSION_KEY = 'aiPromptStudio_currentUser';
const THEME_KEY = 'aiPromptStudio_theme';
const AI_LANGUAGE_KEY = 'aiPromptStudio_aiLanguage';

// Theme Management
export const getStoredTheme = async (): Promise<'light' | 'dark' | null> => {
  try {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return null;
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
    return null;
  }
};

export const setStoredTheme = async (theme: 'light' | 'dark'): Promise<void> => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Error saving theme to localStorage:", error);
  }
};

// AI Language Management
export const getStoredAiLanguage = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(AI_LANGUAGE_KEY) || null;
  } catch (error) {
    console.error("Error reading AI language from localStorage:", error);
    return null;
  }
};

export const setStoredAiLanguage = async (languageCode: string): Promise<void> => {
  try {
    localStorage.setItem(AI_LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.error("Error saving AI language to localStorage:", error);
  }
};


// User Management (Simulated)
const getUsers = async (): Promise<User[]> => {
  try {
    const usersData = localStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error("Error reading users from localStorage:", error);
    return [];
  }
};

const saveUsers = async (users: User[]): Promise<void> => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users to localStorage:", error);
  }
};

export const registerUser = async (username: string, passwordRaw: string): Promise<User | null> => {
  const users = await getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("Username already exists.");
  }
  const passwordHash = `hashed_${passwordRaw}_${username}`; // Simulação de hash
  const newUser: User = { id: crypto.randomUUID(), username, passwordHash };
  await saveUsers([...users, newUser]);
  return newUser;
};

export const loginUser = async (username: string, passwordRaw: string): Promise<User | null> => {
  const users = await getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  const passwordHash = `hashed_${passwordRaw}_${username}`; 
  if (user && user.passwordHash === passwordHash) {
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
    return user;
  }
  throw new Error("Invalid username or password.");
};

export const logoutUser = async (): Promise<void> => {
  try {
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  } catch (error) {
    console.error("Error removing current user from localStorage:", error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const storedUser = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error reading current user from localStorage:", error);
    return null;
  }
};


// Prompt Management (User-Specific)
export const getPrompts = async (userId: string): Promise<Prompt[]> => {
  if (!userId) return [];
  try {
    const storedPrompts = localStorage.getItem(`${PROMPTS_KEY_PREFIX}${userId}`);
    return storedPrompts ? JSON.parse(storedPrompts) : [];
  } catch (error) {
    console.error("Error reading user prompts from localStorage:", error);
    return [];
  }
};

export const savePrompts = async (userId: string, prompts: Prompt[]): Promise<void> => {
  if (!userId) return;
  try {
    localStorage.setItem(`${PROMPTS_KEY_PREFIX}${userId}`, JSON.stringify(prompts));
  } catch (error) {
    console.error("Error saving user prompts to localStorage:", error);
  }
};
