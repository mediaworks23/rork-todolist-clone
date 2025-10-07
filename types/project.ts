export type Project = {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type NewProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;