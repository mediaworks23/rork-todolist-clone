import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Folder } from 'lucide-react-native';
import { Project } from '@/types/project';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/taskStore';
import { router } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

type ProjectItemProps = {
  project: Project;
};

export const ProjectItem = ({ project }: ProjectItemProps) => {
  const { theme } = useAppTheme();
  
  // Use useMemo to prevent infinite loop with Zustand selector
  const tasks = useMemo(() => {
    return useTaskStore.getState().getTasksByProject(project.id);
  }, [project.id]);
  
  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed).length;
  }, [tasks]);
  
  const handlePress = () => {
    router.push(`/project/${project.id}`);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${project.color}20` }]}>
        <Folder size={24} color={project.color} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {project.name}
        </Text>
        
        {project.description ? (
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={1}>
            {project.description}
          </Text>
        ) : null}
        
        <View style={styles.stats}>
          <Text style={[styles.statsText, { color: theme.textSecondary }]}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            {tasks.length > 0 ? ` • ${completedTasks} completed` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
  },
});