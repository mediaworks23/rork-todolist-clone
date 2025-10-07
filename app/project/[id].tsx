import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Plus, Edit, Trash2, CheckSquare, ListTodo } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { TaskItem } from '@/components/TaskItem';
import { EmptyState } from '@/components/EmptyState';
import { ProjectForm } from '@/components/ProjectForm';
import { NewProject } from '@/types/project';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');
  const { theme } = useAppTheme();
  
  const project = useProjectStore(state => state.getProjectById(id as string));
  
  // Use useMemo to prevent infinite loop with Zustand selector
  const tasks = useMemo(() => {
    if (!id) return [];
    return useTaskStore.getState().getTasksByProject(id as string);
  }, [id]);
  
  const updateProject = useProjectStore(state => state.updateProject);
  const deleteProject = useProjectStore(state => state.deleteProject);
  const deleteTask = useTaskStore(state => state.deleteTask);
  
  // Memoize this calculation to prevent unnecessary re-renders
  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed).length;
  }, [tasks]);
  
  // Filter tasks based on active tab
  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') {
      return tasks.filter(task => !task.completed); // Only show incomplete tasks in All tab
    } else {
      return tasks.filter(task => task.completed);
    }
  }, [tasks, activeTab]);
  
  if (!project) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ 
          title: 'Project not found',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            color: theme.text,
          },
          headerTintColor: theme.text,
        }} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>Project not found</Text>
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
  
  const handleAddTask = () => {
    router.push({
      pathname: '/new-task',
      params: { projectId: project.id }
    });
  };
  
  const handleUpdateProject = (updatedProject: NewProject) => {
    updateProject(project.id, updatedProject);
    setIsEditing(false);
  };
  
  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? This will also delete ${tasks.length} task${tasks.length !== 1 ? 's' : ''} in this project.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete all tasks in this project
            tasks.forEach(task => {
              deleteTask(task.id);
            });
            
            // Delete the project
            deleteProject(project.id);
            router.back();
          },
        },
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: isEditing ? 'Edit Project' : project.name,
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
                    onPress={handleDeleteProject}
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
        <ProjectForm 
          initialValues={project}
          onSubmit={handleUpdateProject} 
        />
      ) : (
        <>
          <View style={[styles.projectHeader, { backgroundColor: `${project.color}10` }]}>
            <View style={[styles.projectColorBar, { backgroundColor: project.color }]} />
            <View style={styles.projectInfo}>
              <Text style={[styles.projectName, { color: theme.text }]}>{project.name}</Text>
              {project.description && (
                <Text style={[styles.projectDescription, { color: theme.textSecondary }]}>{project.description}</Text>
              )}
              <Text style={[styles.projectStats, { color: theme.textSecondary }]}>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {completedTasks} completed
              </Text>
            </View>
          </View>
          
          {/* Tab Selector */}
          <View style={[styles.tabContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            <Pressable
              style={[
                styles.tab,
                activeTab === 'all' && [styles.activeTab, { borderBottomColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('all')}
            >
              <ListTodo 
                size={20} 
                color={activeTab === 'all' ? colors.primary : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                { color: theme.textSecondary },
                activeTab === 'all' && [styles.activeTabText, { color: colors.primary }]
              ]}>
                All
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.tab,
                activeTab === 'completed' && [styles.activeTab, { borderBottomColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('completed')}
            >
              <CheckSquare 
                size={20} 
                color={activeTab === 'completed' ? colors.primary : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                { color: theme.textSecondary },
                activeTab === 'completed' && [styles.activeTabText, { color: colors.primary }]
              ]}>
                Completed ({completedTasks})
              </Text>
            </Pressable>
          </View>
          
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TaskItem task={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState 
                title={activeTab === 'all' ? "No tasks in this project" : "No completed tasks"} 
                message={activeTab === 'all' 
                  ? "Add your first task by tapping the + button in the bottom right corner." 
                  : "Complete some tasks to see them here."
                } 
              />
            }
          />
          
          <Pressable 
            style={styles.fab}
            onPress={handleAddTask}
          >
            <Plus size={24} color="#fff" />
          </Pressable>
        </>
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
  projectHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF', // Using a specific color instead of colors.border
  },
  projectColorBar: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  projectStats: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  activeTabText: {
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});