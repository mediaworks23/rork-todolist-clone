import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, NewProject } from '@/types/project';

interface ProjectState {
  projects: Project[];
  addProject: (project: NewProject) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      
      addProject: (newProject: NewProject) => {
        const id = Date.now().toString();
        const now = new Date().toISOString();
        const project: Project = {
          ...newProject,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          projects: [...state.projects, project],
        }));
        
        return id;
      },
      
      updateProject: (id: string, updates: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(project => 
            project.id === id 
              ? { 
                  ...project, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : project
          ),
        }));
      },
      
      deleteProject: (id: string) => {
        set(state => ({
          projects: state.projects.filter(project => project.id !== id),
        }));
      },
      
      getProjectById: (id: string) => {
        return get().projects.find(project => project.id === id);
      },
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);