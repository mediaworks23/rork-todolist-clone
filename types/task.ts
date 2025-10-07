export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type SubTask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Reminder = {
  date: string; // ISO string
  time: string; // HH:MM format
  enabled: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO string
  categoryId: string;
  priorityId: string;
  projectId?: string;
  tags: Tag[];
  reminder?: Reminder;
  recurrence: {
    type: RecurrenceType;
    enabled: boolean;
  };
  subtasks: SubTask[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;