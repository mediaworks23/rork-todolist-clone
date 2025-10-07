import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { ProjectForm } from '@/components/ProjectForm';
import { useProjectStore } from '@/store/projectStore';
import { NewProject } from '@/types/project';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function NewProjectScreen() {
  const addProject = useProjectStore(state => state.addProject);
  const { theme } = useAppTheme();
  
  const handleSubmit = (project: NewProject) => {
    const projectId = addProject(project);
    router.back();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'New Project',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
          headerShadowVisible: false,
        }} 
      />
      
      <ProjectForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});