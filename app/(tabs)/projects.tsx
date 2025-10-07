import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useProjectStore } from '@/store/projectStore';
import { ProjectItem } from '@/components/ProjectItem';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ProjectsScreen() {
  const projects = useProjectStore(state => state.projects);
  const { theme } = useAppTheme();
  
  const handleAddProject = () => {
    router.push('/new-project');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Projects',
          headerRight: () => (
            <Pressable 
              style={styles.headerButton}
              onPress={handleAddProject}
            >
              <Plus size={24} color={theme.text} />
            </Pressable>
          ),
        }} 
      />
      
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ProjectItem project={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            title="No projects yet" 
            message="Create your first project by tapping the + button in the top right corner." 
          />
        }
      />
      
      <Pressable 
        style={styles.fab}
        onPress={handleAddProject}
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
  headerButton: {
    marginRight: 16,
    padding: 4,
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