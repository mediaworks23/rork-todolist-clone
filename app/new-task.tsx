import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { TaskForm } from '@/components/TaskForm';
import { useTaskStore } from '@/store/taskStore';
import { NewTask } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function NewTaskScreen() {
  const params = useLocalSearchParams();
  const addTask = useTaskStore(state => state.addTask);
  const { theme } = useAppTheme();
  
  const initialValues: Partial<NewTask> = {
    tags: [],
    subtasks: [],
    recurrence: { type: 'daily', enabled: false },
  };
  
  if (params.date) {
    initialValues.dueDate = params.date as string;
  }
  
  if (params.projectId) {
    initialValues.projectId = params.projectId as string;
  }
  
  const handleSubmit = (task: NewTask) => {
    const taskId = addTask(task);
    router.back();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'New Task',
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
      
      <TaskForm 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        projectId={params.projectId as string} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});