import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const storage = Platform.OS === 'web' 
  ? undefined 
  : {
      getItem: async (key: string) => {
        const value = await AsyncStorage.getItem(key);
        return value;
      },
      setItem: async (key: string, value: string) => {
        await AsyncStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        await AsyncStorage.removeItem(key);
      },
    };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          completed: boolean;
          due_date: string | null;
          category_id: string;
          priority_id: string;
          project_id: string | null;
          tags: any;
          reminder: any;
          recurrence: any;
          subtasks: any;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          category_id: string;
          priority_id: string;
          project_id?: string | null;
          tags?: any;
          reminder?: any;
          recurrence?: any;
          subtasks?: any;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          category_id?: string;
          priority_id?: string;
          project_id?: string | null;
          tags?: any;
          reminder?: any;
          recurrence?: any;
          subtasks?: any;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          color: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          color?: string;
          user_id?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          user_id?: string;
        };
      };
    };
  };
};
