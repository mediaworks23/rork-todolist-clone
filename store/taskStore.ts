import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, NewTask, SubTask, Tag } from '@/types/task';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TaskState {
  tasks: Task[];
  tags: Tag[];
  addTask: (task: NewTask) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByProject: (projectId: string) => Task[];
  getTasksByDate: (date: string) => Task[]; // date in YYYY-MM-DD format
  getCompletedTasks: () => Task[];
  getIncompleteTasks: () => Task[];
  
  // Subtask methods
  addSubtask: (taskId: string, title: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubTask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  
  // Tag methods
  addTag: (tag: Omit<Tag, 'id'>) => string;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [],
      
      addTask: (newTask: NewTask) => {
        const id = Date.now().toString();
        const now = new Date().toISOString();
        
        // Ensure all required fields have default values
        const task: Task = {
          ...newTask,
          id,
          tags: newTask.tags || [],
          recurrence: newTask.recurrence || { type: 'none', enabled: false },
          subtasks: newTask.subtasks || [],
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          tasks: [...state.tasks, task],
        }));
        
        // Trigger haptic feedback on task creation (not supported on web)
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        return id;
      },
      
      updateTask: (id: string, updates: Partial<Task>) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id 
              ? { 
                  ...task, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
      },
      
      deleteTask: (id: string) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id),
        }));
      },
      
      toggleTaskCompletion: (id: string) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id 
              ? { 
                  ...task, 
                  completed: !task.completed,
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
        
        // Trigger haptic feedback on task completion (not supported on web)
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      },
      
      getTaskById: (id: string) => {
        return get().tasks.find(task => task.id === id);
      },
      
      getTasksByCategory: (categoryId: string) => {
        return get().tasks.filter(task => task.categoryId === categoryId);
      },
      
      getTasksByProject: (projectId: string) => {
        return get().tasks.filter(task => task.projectId === projectId);
      },
      
      getTasksByDate: (date: string) => {
        return get().tasks.filter(task => {
          if (!task.dueDate) return false;
          return task.dueDate.startsWith(date);
        });
      },
      
      getCompletedTasks: () => {
        return get().tasks.filter(task => task.completed);
      },
      
      getIncompleteTasks: () => {
        return get().tasks.filter(task => !task.completed);
      },
      
      // Subtask methods
      addSubtask: (taskId: string, title: string) => {
        const task = get().getTaskById(taskId);
        if (!task) return;
        
        const subtask: SubTask = {
          id: Date.now().toString(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          tasks: state.tasks.map(t => 
            t.id === taskId 
              ? { 
                  ...t, 
                  subtasks: [...t.subtasks, subtask],
                  updatedAt: new Date().toISOString() 
                } 
              : t
          ),
        }));
      },
      
      updateSubtask: (taskId: string, subtaskId: string, updates: Partial<SubTask>) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  subtasks: task.subtasks.map(subtask => 
                    subtask.id === subtaskId 
                      ? { ...subtask, ...updates } 
                      : subtask
                  ),
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
      },
      
      deleteSubtask: (taskId: string, subtaskId: string) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId),
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
      },
      
      toggleSubtaskCompletion: (taskId: string, subtaskId: string) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  subtasks: task.subtasks.map(subtask => 
                    subtask.id === subtaskId 
                      ? { ...subtask, completed: !subtask.completed } 
                      : subtask
                  ),
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
      },
      
      // Tag methods
      addTag: (tagData) => {
        const id = Date.now().toString();
        const tag: Tag = {
          ...tagData,
          id,
        };
        
        set(state => ({
          tags: [...state.tags, tag],
        }));
        
        return id;
      },
      
      updateTag: (id: string, updates: Partial<Tag>) => {
        set(state => ({
          tags: state.tags.map(tag => 
            tag.id === id 
              ? { ...tag, ...updates } 
              : tag
          ),
          // Also update all tasks that use this tag
          tasks: state.tasks.map(task => ({
            ...task,
            tags: task.tags.map(tag => 
              tag.id === id 
                ? { ...tag, ...updates } 
                : tag
            ),
          })),
        }));
      },
      
      deleteTag: (id: string) => {
        set(state => ({
          tags: state.tags.filter(tag => tag.id !== id),
          // Also remove this tag from all tasks
          tasks: state.tasks.map(task => ({
            ...task,
            tags: task.tags.filter(tag => tag.id !== id),
          })),
        }));
      },
      
      getTagById: (id: string) => {
        return get().tags.find(tag => tag.id === id);
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);