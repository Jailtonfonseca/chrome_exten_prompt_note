
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

export interface WikiPage {
  id: string;
  userId: string;
  title: string;
  content: string;
  links: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ViewType = 'prompts' | 'wiki';