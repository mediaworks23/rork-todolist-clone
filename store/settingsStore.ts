import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  showCompletedTasks: boolean;
  defaultCategoryId: string;
  defaultPriorityId: string;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  
  toggleShowCompletedTasks: () => void;
  setDefaultCategory: (categoryId: string) => void;
  setDefaultPriority: (priorityId: string) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showCompletedTasks: true,
      defaultCategoryId: 'personal',
      defaultPriorityId: 'medium',
      sortBy: 'dueDate',
      sortDirection: 'asc',
      
      toggleShowCompletedTasks: () => {
        set(state => ({ showCompletedTasks: !state.showCompletedTasks }));
      },
      
      setDefaultCategory: (categoryId: string) => {
        set({ defaultCategoryId: categoryId });
      },
      
      setDefaultPriority: (priorityId: string) => {
        set({ defaultPriorityId: priorityId });
      },
      
      setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt') => {
        set({ sortBy });
      },
      
      setSortDirection: (sortDirection: 'asc' | 'desc') => {
        set({ sortDirection });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);