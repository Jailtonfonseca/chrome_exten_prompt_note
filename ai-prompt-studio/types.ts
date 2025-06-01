
export interface Prompt {
  id: string;
  userId: string; // Adicionado para associar prompt ao usuário
  title: string;
  text: string;
  category?: string; // Optional category
  tags?: string[];   // Optional tags
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // Para simulação, em produção use bcrypt
}

// You can add more shared types here as the application grows.