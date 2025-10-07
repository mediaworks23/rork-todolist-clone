import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Trash2, Edit, Check, X, Clock, Tag, Repeat, ListChecks, CheckCircle, Circle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { TaskForm } from '@/components/TaskForm';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { NewTask, SubTask } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useAppTheme();
  
  const task = useTaskStore(state => state.getTaskById(id as string));
  const toggleSubtaskCompletion = useTaskStore(state => state.toggleSubtaskCompletion);
  
  // Use useMemo to prevent infinite loop with Zustand selector
  const project = useMemo(() => {
    if (!task?.projectId) return undefined;
    return useProjectStore.getState().getProjectById(task.projectId);
  }, [task?.projectId]);
  
  const updateTask = useTaskStore(state => state.updateTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);
  
  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ 
          title: 'Task not found',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
        }} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>Task not found</Text>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            router.back();
          },
        },
      ]
    );
  };
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };
  
  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtaskCompletion(task.id, subtaskId);
  };
  
  const handleUpdate = (updatedTask: NewTask) => {
    updateTask(task.id, updatedTask);
    setIsEditing(false);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const getRecurrenceText = () => {
    if (!task.recurrence || !task.recurrence.enabled) return 'None';
    
    switch (task.recurrence.type) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return 'None';
    }
  };
  
  const hasReminder = task.reminder && task.reminder.enabled;
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const hasTags = task.tags && task.tags.length > 0;
  const isRecurring = task.recurrence && task.recurrence.enabled;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: isEditing ? 'Edit Task' : 'Task Details',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
          headerRight: () => (
            <View style={styles.headerButtons}>
              {!isEditing && (
                <>
                  <Pressable 
                    style={styles.headerButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Edit size={20} color={theme.text} />
                  </Pressable>
                  <Pressable 
                    style={styles.headerButton}
                    onPress={handleDelete}
                  >
                    <Trash2 size={20} color={colors.error} />
                  </Pressable>
                </>
              )}
            </View>
          ),
        }} 
      />
      
      {isEditing ? (
        <TaskForm 
          initialValues={task}
          onSubmit={handleUpdate} 
        />
      ) : (
        <ScrollView style={styles.content}>
          <View style={[
            styles.header,
            { backgroundColor: theme.card },
            project && { borderLeftColor: project.color, borderLeftWidth: 4 }
          ]}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
              <Pressable 
                style={[
                  styles.completionButton,
                  task.completed ? styles.completedButton : styles.incompleteButton
                ]}
                onPress={handleToggleCompletion}
              >
                {task.completed ? (
                  <>
                    <Check size={16} color="#fff" />
                    <Text style={styles.completedButtonText}>Completed</Text>
                  </>
                ) : (
                  <>
                    <X size={16} color="#fff" />
                    <Text style={styles.incompleteButtonText}>Incomplete</Text>
                  </>
                )}
              </Pressable>
            </View>
            
            <View style={styles.metaContainer}>
              {project && (
                <Pressable 
                  style={[styles.projectBadge, { backgroundColor: `${project.color}20` }]}
                  onPress={() => router.push(`/project/${project.id}`)}
                >
                  <Text style={[styles.projectBadgeText, { color: project.color }]}>
                    {project.name}
                  </Text>
                </Pressable>
              )}
              <CategoryBadge categoryId={task.categoryId} size="large" />
              <PriorityBadge priorityId={task.priorityId} size="large" />
            </View>
          </View>
          
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Due Date</Text>
            <Text style={[styles.sectionContent, { color: theme.text }]}>
              {formatDate(task.dueDate)}
            </Text>
          </View>
          
          {hasReminder && task.reminder && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <View style={styles.sectionTitleRow}>
                <Clock size={18} color={theme.textSecondary} />
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Reminder</Text>
              </View>
              <Text style={[styles.sectionContent, { color: theme.text }]}>
                {formatDate(task.reminder.date)} at {formatTime(task.reminder.time)}
              </Text>
            </View>
          )}
          
          {isRecurring && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <View style={styles.sectionTitleRow}>
                <Repeat size={18} color={theme.textSecondary} />
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Repeats</Text>
              </View>
              <Text style={[styles.sectionContent, { color: theme.text }]}>
                {getRecurrenceText()}
              </Text>
            </View>
          )}
          
          {task.description ? (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Description</Text>
              <Text style={[styles.sectionContent, { color: theme.text }]}>{task.description}</Text>
            </View>
          ) : null}
          
          {hasTags && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <View style={styles.sectionTitleRow}>
                <Tag size={18} color={theme.textSecondary} />
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Tags</Text>
              </View>
              <View style={styles.tagsContainer}>
                {task.tags.map(tag => (
                  <View 
                    key={tag.id}
                    style={[styles.tagChip, { backgroundColor: `${tag.color}20` }]}
                  >
                    <Text style={[styles.tagText, { color: tag.color }]}>
                      {tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {hasSubtasks && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <View style={styles.sectionTitleRow}>
                <ListChecks size={18} color={theme.textSecondary} />
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Subtasks</Text>
              </View>
              <View style={styles.subtasksContainer}>
                {task.subtasks.map((subtask: SubTask) => (
                  <View key={subtask.id} style={styles.subtaskItem}>
                    <Pressable
                      onPress={() => handleToggleSubtask(subtask.id)}
                      hitSlop={8}
                      style={styles.subtaskCheckbox}
                    >
                      {subtask.completed ? (
                        <CheckCircle size={20} color={colors.primary} />
                      ) : (
                        <Circle size={20} color={theme.textSecondary} />
                      )}
                    </Pressable>
                    
                    <Text 
                      style={[
                        styles.subtaskText,
                        { color: theme.text },
                        subtask.completed && [styles.completedSubtaskText, { color: theme.textSecondary }]
                      ]}
                    >
                      {subtask.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Created</Text>
            <Text style={[styles.sectionContent, { color: theme.text }]}>
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          
          {task.updatedAt !== task.createdAt && (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Last Updated</Text>
              <Text style={[styles.sectionContent, { color: theme.text }]}>
                {new Date(task.updatedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            <Pressable 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Edit size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Trash2 size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  completedButton: {
    backgroundColor: colors.success,
  },
  incompleteButton: {
    backgroundColor: colors.error,
  },
  completedButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  incompleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  projectBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtasksContainer: {
    gap: 12,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subtaskCheckbox: {
    marginRight: 12,
  },
  subtaskText: {
    fontSize: 16,
  },
  completedSubtaskText: {
    textDecorationLine: 'line-through',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});