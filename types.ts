
export interface Prompt {
  id: string;
  userId: string;
  title: string;
  text: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface AppSettings {
  keyboardShortcuts: boolean;
  notifications: boolean;
  autoSave: boolean;
}

// You can add more shared types here as the application grows.