import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { Plus, Filter, CheckSquare, ListTodo } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/taskStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useProjectStore } from '@/store/projectStore';
import { TaskItem } from '@/components/TaskItem';
import { EmptyState } from '@/components/EmptyState';
import { Task } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TasksScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');
  
  const { theme } = useAppTheme();
  
  const tasks = useTaskStore(state => state.tasks);
  const projects = useProjectStore(state => state.projects);
  const sortBy = useSettingsStore(state => state.sortBy);
  const sortDirection = useSettingsStore(state => state.sortDirection);
  
  // Use useMemo to prevent unnecessary recalculations
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter by completion status based on active tab
      if (activeTab === 'all' && task.completed) return false; // Hide completed tasks in All tab
      if (activeTab === 'completed' && !task.completed) return false;
      
      // Filter by category and project
      if (selectedCategoryId && task.categoryId !== selectedCategoryId) return false;
      if (selectedProjectId && task.projectId !== selectedProjectId) return false;
      
      return true;
    });
  }, [tasks, selectedCategoryId, selectedProjectId, activeTab]);
  
  // Use useMemo for sorting to prevent unnecessary recalculations
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'dueDate') {
        // Handle tasks without due dates
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const getPriorityValue = (task: Task) => {
          switch (task.priorityId) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 0;
          }
        };
        comparison = getPriorityValue(b) - getPriorityValue(a);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      // If we're on the completed tab, sort by completion date (most recent first)
      if (activeTab === 'completed') {
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortBy, sortDirection, activeTab]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      // Reset any filters when screen is focused
      setSelectedCategoryId(null);
      setSelectedProjectId(null);
    }, [])
  );
  
  const handleAddTask = () => {
    router.push('/new-task');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const completedTasksCount = useMemo(() => {
    return tasks.filter(task => task.completed).length;
  }, [tasks]);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable 
                style={styles.headerButton}
                onPress={toggleFilters}
              >
                <Filter size={24} color={theme.text} />
              </Pressable>
              <Pressable 
                style={styles.headerButton}
                onPress={handleAddTask}
              >
                <Plus size={24} color={theme.text} />
              </Pressable>
            </View>
          ),
        }} 
      />
      
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
            Completed ({completedTasksCount})
          </Text>
        </Pressable>
      </View>
      
      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Text style={[styles.filtersTitle, { color: theme.textSecondary }]}>Filter by Project</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersList}>
            <Pressable
              style={[
                styles.filterChip,
                { borderColor: theme.border },
                selectedProjectId === null && [styles.selectedFilterChip, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }]
              ]}
              onPress={() => setSelectedProjectId(null)}
            >
              <Text style={[
                styles.filterChipText,
                { color: theme.text },
                selectedProjectId === null && [styles.selectedFilterChipText, { color: colors.primary }]
              ]}>
                All
              </Text>
            </Pressable>
            
            {projects.map(project => (
              <Pressable
                key={project.id}
                style={[
                  styles.filterChip,
                  { borderColor: project.color },
                  selectedProjectId === project.id && { 
                    backgroundColor: `${project.color}20`,
                    borderColor: project.color,
                  }
                ]}
                onPress={() => setSelectedProjectId(
                  selectedProjectId === project.id ? null : project.id
                )}
              >
                <Text style={[
                  styles.filterChipText,
                  { color: selectedProjectId === project.id ? project.color : theme.text }
                ]}>
                  {project.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      
      <FlatList
        data={sortedTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            title={activeTab === 'all' ? "No tasks yet" : "No completed tasks"} 
            message={activeTab === 'all' 
              ? "Add your first task by tapping the + button in the top right corner." 
              : "Complete some tasks to see them here."
            } 
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      
      <Pressable 
        style={styles.fab}
        onPress={handleAddTask}
      >
        <Plus size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
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
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  selectedFilterChip: {
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
  },
  selectedFilterChipText: {
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