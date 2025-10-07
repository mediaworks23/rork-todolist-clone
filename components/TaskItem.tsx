import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CheckCircle, Circle, Clock, Tag, ListChecks } from 'lucide-react-native';
import { Task } from '@/types/task';
import { colors } from '@/constants/colors';
import { CategoryBadge } from './CategoryBadge';
import { PriorityBadge } from './PriorityBadge';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { router } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

type TaskItemProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskItemProps) => {
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);
  const { theme } = useAppTheme();
  
  // Use useMemo to prevent infinite loop with Zustand selector
  const project = useMemo(() => {
    if (!task.projectId) return undefined;
    return useProjectStore.getState().getProjectById(task.projectId);
  }, [task.projectId]);
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };
  
  const handlePress = () => {
    router.push(`/task/${task.id}`);
  };
  
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    
    return dueDate < now;
  };
  
  const hasReminder = task.reminder && task.reminder.enabled;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const hasTags = task.tags && task.tags.length > 0;
  const isRecurring = task.recurrence && task.recurrence.enabled;
  
  const completedSubtasks = task.subtasks ? task.subtasks.filter(subtask => subtask.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
        task.completed && styles.completedContainer,
        task.projectId && project && { borderLeftColor: project.color, borderLeftWidth: 4 }
      ]}
      onPress={handlePress}
    >
      <Pressable 
        style={styles.checkbox}
        onPress={handleToggleCompletion}
        hitSlop={10}
      >
        {task.completed ? (
          <CheckCircle size={24} color={colors.primary} />
        ) : (
          <Circle size={24} color={theme.textSecondary} />
        )}
      </Pressable>
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            { color: theme.text },
            task.completed && [styles.completedTitle, { color: theme.textSecondary }]
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {task.description ? (
          <Text 
            style={[
              styles.description,
              { color: theme.textSecondary },
              task.completed && styles.completedDescription
            ]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        ) : null}
        
        <View style={styles.metaContainer}>
          {project && (
            <View style={[styles.projectBadge, { backgroundColor: `${project.color}20` }]}>
              <Text style={[styles.projectBadgeText, { color: project.color }]}>
                {project.name}
              </Text>
            </View>
          )}
          
          <CategoryBadge categoryId={task.categoryId} size="small" />
          <PriorityBadge priorityId={task.priorityId} size="small" />
          
          {task.dueDate && (
            <Text 
              style={[
                styles.dueDate,
                { backgroundColor: theme.border, color: theme.textSecondary },
                isOverdue() && styles.overdue,
                task.completed && styles.completedDueDate
              ]}
            >
              {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
        
        {/* Icons for additional features */}
        <View style={styles.featuresContainer}>
          {hasReminder && (
            <View style={styles.featureIcon}>
              <Clock size={14} color={theme.textSecondary} />
            </View>
          )}
          
          {isRecurring && (
            <View style={styles.featureIcon}>
              <Text style={[styles.recurringText, { color: theme.textSecondary }]}>↻</Text>
            </View>
          )}
          
          {hasSubtasks && (
            <View style={styles.featureIcon}>
              <ListChecks size={14} color={theme.textSecondary} />
              <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                {completedSubtasks}/{totalSubtasks}
              </Text>
            </View>
          )}
          
          {hasTags && (
            <View style={styles.featureIcon}>
              <Tag size={14} color={theme.textSecondary} />
              <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                {task.tags.length}
              </Text>
            </View>
          )}
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
  completedContainer: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  projectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  projectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdue: {
    color: colors.error,
    backgroundColor: `${colors.error}15`,
  },
  completedDueDate: {
    opacity: 0.7,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
  },
  recurringText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});