import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories as defaultCategories } from '@/constants/categories';
import { Category } from '@/types/category';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => string;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  resetToDefaults: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [...defaultCategories],
      
      addCategory: (categoryData) => {
        const id = Date.now().toString();
        const category: Category = {
          ...categoryData,
          id,
        };
        
        set(state => ({
          categories: [...state.categories, category],
        }));
        
        return id;
      },
      
      updateCategory: (id: string, updates: Partial<Category>) => {
        set(state => ({
          categories: state.categories.map(category => 
            category.id === id 
              ? { ...category, ...updates } 
              : category
          ),
        }));
      },
      
      deleteCategory: (id: string) => {
        // Don't allow deleting default categories
        const isDefaultCategory = defaultCategories.some(cat => cat.id === id);
        if (isDefaultCategory) return;
        
        set(state => ({
          categories: state.categories.filter(category => category.id !== id),
        }));
      },
      
      getCategoryById: (id: string) => {
        return get().categories.find(category => category.id === id);
      },
      
      resetToDefaults: () => {
        set({ categories: [...defaultCategories] });
      },
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);