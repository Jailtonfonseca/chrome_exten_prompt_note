export interface Prompt {
  id: string;
  title: string;
  text: string;
  createdAt: string; // ISO string format for dates
  updatedAt: string; // ISO string format for dates
}

export interface User {
  id: string;
  username: string;
  password?: string; // Password is for simulation, might be omitted in some contexts
}
