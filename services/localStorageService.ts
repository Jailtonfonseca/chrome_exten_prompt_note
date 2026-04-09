
import { Prompt, User } from '../types';

const PROMPTS_KEY_PREFIX = 'aiPromptStudio_prompts_';
const USERS_KEY = 'aiPromptStudio_users';
const CURRENT_USER_SESSION_KEY = 'aiPromptStudio_currentUser';
const THEME_KEY = 'aiPromptStudio_theme';
const AI_LANGUAGE_KEY = 'aiPromptStudio_aiLanguage';
const PROMPT_HISTORY_KEY = 'aiPromptStudio_promptHistory';
const SETTINGS_KEY = 'aiPromptStudio_settings';
const MAX_HISTORY_ITEMS = 50;

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

// Prompt History (last used prompts)
export const addToPromptHistory = async (userId: string, promptText: string): Promise<void> => {
  if (!userId) return;
  try {
    const historyKey = `${PROMPT_HISTORY_KEY}_${userId}`;
    const existing = localStorage.getItem(historyKey);
    const history: string[] = existing ? JSON.parse(existing) : [];
    
    const filtered = history.filter(p => p !== promptText);
    const updated = [promptText, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(historyKey, JSON.stringify(updated));
  } catch (error) {
    console.error("Error adding to prompt history:", error);
  }
};

export const getPromptHistory = async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  try {
    const historyKey = `${PROMPT_HISTORY_KEY}_${userId}`;
    const history = localStorage.getItem(historyKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting prompt history:", error);
    return [];
  }
};

export const clearPromptHistory = async (userId: string): Promise<void> => {
  if (!userId) return;
  try {
    const historyKey = `${PROMPT_HISTORY_KEY}_${userId}`;
    localStorage.removeItem(historyKey);
  } catch (error) {
    console.error("Error clearing prompt history:", error);
  }
};

// Increment usage count for a prompt
export const incrementPromptUsage = async (userId: string, promptId: string): Promise<void> => {
  if (!userId) return;
  const prompts = await getPrompts(userId);
  const updated = prompts.map(p => 
    p.id === promptId ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p
  );
  await savePrompts(userId, updated);
};

// Toggle favorite
export const togglePromptFavorite = async (userId: string, promptId: string): Promise<void> => {
  if (!userId) return;
  const prompts = await getPrompts(userId);
  const updated = prompts.map(p => 
    p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
  );
  await savePrompts(userId, updated);
};

// Settings Management
export interface Settings {
  keyboardShortcuts: boolean;
  notifications: boolean;
  autoSave: boolean;
  showHistory: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  keyboardShortcuts: true,
  notifications: true,
  autoSave: true,
  showHistory: true,
};

export const getSettings = async (userId: string): Promise<Settings> => {
  if (!userId) return DEFAULT_SETTINGS;
  try {
    const settingsKey = `${SETTINGS_KEY}_${userId}`;
    const settings = localStorage.getItem(settingsKey);
    return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error reading settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (userId: string, settings: Partial<Settings>): Promise<void> => {
  if (!userId) return;
  try {
    const settingsKey = `${SETTINGS_KEY}_${userId}`;
    const current = await getSettings(userId);
    localStorage.setItem(settingsKey, JSON.stringify({ ...current, ...settings }));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// Export/Import
export const exportUserData = async (userId: string): Promise<string> => {
  if (!userId) return '{}';
  const prompts = await getPrompts(userId);
  const history = await getPromptHistory(userId);
  const settings = await getSettings(userId);
  return JSON.stringify({ prompts, history, settings }, null, 2);
};

export const importUserData = async (userId: string, data: string): Promise<boolean> => {
  if (!userId) return false;
  try {
    const parsed = JSON.parse(data);
    if (parsed.prompts) {
      await savePrompts(userId, parsed.prompts);
    }
    if (parsed.history) {
      const historyKey = `${PROMPT_HISTORY_KEY}_${userId}`;
      localStorage.setItem(historyKey, JSON.stringify(parsed.history));
    }
    if (parsed.settings) {
      await saveSettings(userId, parsed.settings);
    }
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};
