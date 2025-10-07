import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Plus, Edit, Trash2 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types/category';
import { useTaskStore } from '@/store/taskStore';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function CategoriesScreen() {
  const categories = useCategoryStore(state => state.categories);
  const deleteCategory = useCategoryStore(state => state.deleteCategory);
  const defaultCategories = ['work', 'personal', 'shopping', 'health', 'finance', 'education'];
  const { theme } = useAppTheme();
  
  const tasks = useTaskStore(state => state.tasks);
  
  const handleAddCategory = () => {
    router.push('/new-category');
  };
  
  const handleEditCategory = (category: Category) => {
    router.push({
      pathname: '/edit-category',
      params: { id: category.id }
    });
  };
  
  const handleDeleteCategory = (category: Category) => {
    // Check if this is a default category
    if (defaultCategories.includes(category.id)) {
      Alert.alert(
        "Can't Delete Default Category",
        "Default categories cannot be deleted.",
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Check if there are tasks using this category
    const tasksUsingCategory = tasks.filter(task => task.categoryId === category.id);
    
    if (tasksUsingCategory.length > 0) {
      Alert.alert(
        'Category In Use',
        `This category is used by ${tasksUsingCategory.length} task${tasksUsingCategory.length !== 1 ? 's' : ''}. Deleting it will set those tasks to the default category.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete Anyway', 
            style: 'destructive',
            onPress: () => {
              // Update tasks to use default category
              tasksUsingCategory.forEach(task => {
                useTaskStore.getState().updateTask(task.id, { categoryId: 'personal' });
              });
              deleteCategory(category.id);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Delete Category',
        `Are you sure you want to delete "${category.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => deleteCategory(category.id)
          }
        ]
      );
    }
  };
  
  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isDefaultCategory = defaultCategories.includes(item.id);
    const tasksCount = tasks.filter(task => task.categoryId === item.id).length;
    
    return (
      <View style={[styles.categoryItem, { backgroundColor: theme.card }]}>
        <View style={styles.categoryInfo}>
          <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
          <View>
            <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.categoryMeta, { color: theme.textSecondary }]}>
              {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
              {isDefaultCategory ? ' • Default' : ''}
            </Text>
          </View>
        </View>
        
        <View style={styles.categoryActions}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => handleEditCategory(item)}
          >
            <Edit size={20} color={theme.text} />
          </Pressable>
          
          {!isDefaultCategory && (
            <Pressable 
              style={styles.actionButton}
              onPress={() => handleDeleteCategory(item)}
            >
              <Trash2 size={20} color={colors.error} />
            </Pressable>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Categories',
          headerRight: () => (
            <Pressable 
              style={styles.headerButton}
              onPress={handleAddCategory}
            >
              <Plus size={24} color={theme.text} />
            </Pressable>
          ),
        }} 
      />
      
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.headerText, { color: theme.textSecondary }]}>
            Organize your tasks with categories. Default categories cannot be deleted.
          </Text>
        }
      />
      
      <Pressable 
        style={styles.fab}
        onPress={handleAddCategory}
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
  headerText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryMeta: {
    fontSize: 14,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
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