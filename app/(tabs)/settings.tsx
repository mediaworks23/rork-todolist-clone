import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { ChevronRight, Eye, EyeOff, SortAsc, SortDesc, Tag, Folder, Trash2, Moon, Sun, Smartphone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useCategoryStore } from '@/store/categoryStore';
import { priorities } from '@/constants/priorities';
import { useThemeStore, ThemeMode } from '@/store/themeStore';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function SettingsScreen() {
  const {
    showCompletedTasks,
    toggleShowCompletedTasks,
    defaultCategoryId,
    setDefaultCategory,
    defaultPriorityId,
    setDefaultPriority,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  } = useSettingsStore();
  
  const { themeMode, setThemeMode } = useThemeStore();
  const { theme } = useAppTheme();
  
  const categories = useCategoryStore(state => state.categories);
  const resetCategories = useCategoryStore(state => state.resetToDefaults);
  
  const sortOptions = [
    { id: 'dueDate', name: 'Due Date' },
    { id: 'priority', name: 'Priority' },
    { id: 'createdAt', name: 'Creation Date' },
  ];
  
  const handleResetCategories = () => {
    Alert.alert(
      'Reset Categories',
      'Are you sure you want to reset all categories to default? This will remove any custom categories you have created.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetCategories();
            // Reset default category to 'personal' if it was a custom category that got deleted
            if (!categories.some(c => c.id === defaultCategoryId)) {
              setDefaultCategory('personal');
            }
          },
        },
      ]
    );
  };
  
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={20} color={theme.text} />;
      case 'dark':
        return <Moon size={20} color={theme.text} />;
      case 'system':
        return <Smartphone size={20} color={theme.text} />;
    }
  };
  
  const getThemeText = () => {
    switch (themeMode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System Default';
    }
  };
  
  const handleThemeChange = () => {
    const nextTheme: ThemeMode = 
      themeMode === 'light' ? 'dark' : 
      themeMode === 'dark' ? 'system' : 'light';
    
    setThemeMode(nextTheme);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Settings' }} />
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>Appearance</Text>
        
        <Pressable 
          style={[styles.settingItem, { borderBottomColor: theme.border }]}
          onPress={handleThemeChange}
        >
          <View style={styles.settingInfo}>
            {getThemeIcon()}
            <Text style={[styles.settingLabel, { color: theme.text }]}>Theme</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={[styles.settingValueText, { color: theme.textSecondary }]}>
              {getThemeText()}
            </Text>
            <ChevronRight size={20} color={theme.textSecondary} />
          </View>
        </Pressable>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>Task Display</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingInfo}>
            {showCompletedTasks ? (
              <Eye size={20} color={theme.text} />
            ) : (
              <EyeOff size={20} color={theme.text} />
            )}
            <Text style={[styles.settingLabel, { color: theme.text }]}>Show Completed Tasks</Text>
          </View>
          <Switch
            value={showCompletedTasks}
            onValueChange={toggleShowCompletedTasks}
            trackColor={{ false: theme.border, true: `${colors.primary}80` }}
            thumbColor={showCompletedTasks ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <Pressable 
          style={[styles.settingItem, { borderBottomColor: theme.border }]}
          onPress={() => {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          }}
        >
          <View style={styles.settingInfo}>
            {sortDirection === 'asc' ? (
              <SortAsc size={20} color={theme.text} />
            ) : (
              <SortDesc size={20} color={theme.text} />
            )}
            <Text style={[styles.settingLabel, { color: theme.text }]}>Sort Direction</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={[styles.settingValueText, { color: theme.textSecondary }]}>
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </Text>
            <ChevronRight size={20} color={theme.textSecondary} />
          </View>
        </Pressable>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>Sort Tasks By</Text>
        
        {sortOptions.map(option => (
          <Pressable 
            key={option.id}
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={() => setSortBy(option.id as any)}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>{option.name}</Text>
            <View style={[
              styles.radioButton, 
              { borderColor: colors.primary }
            ]}>
              {sortBy === option.id && <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />}
            </View>
          </Pressable>
        ))}
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>Default Category</Text>
        
        {categories.map(category => (
          <Pressable 
            key={category.id}
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={() => setDefaultCategory(category.id)}
          >
            <View style={styles.settingInfo}>
              <View 
                style={[
                  styles.categoryColor, 
                  { backgroundColor: category.color }
                ]} 
              />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{category.name}</Text>
            </View>
            <View style={[
              styles.radioButton, 
              { borderColor: colors.primary }
            ]}>
              {defaultCategoryId === category.id && <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />}
            </View>
          </Pressable>
        ))}
        
        <Pressable 
          style={[styles.settingItem, styles.dangerItem, { borderTopColor: theme.border }]}
          onPress={handleResetCategories}
        >
          <View style={styles.settingInfo}>
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.settingLabel, styles.dangerText]}>Reset to Default Categories</Text>
          </View>
        </Pressable>
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>Default Priority</Text>
        
        {priorities.map(priority => (
          <Pressable 
            key={priority.id}
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={() => setDefaultPriority(priority.id)}
          >
            <View style={styles.settingInfo}>
              <View 
                style={[
                  styles.priorityColor, 
                  { backgroundColor: priority.color }
                ]} 
              />
              <Text style={[styles.settingLabel, { color: theme.text }]}>{priority.name}</Text>
            </View>
            <View style={[
              styles.radioButton, 
              { borderColor: colors.primary }
            ]}>
              {defaultPriorityId === priority.id && <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />}
            </View>
          </Pressable>
        ))}
      </View>
      
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, borderBottomColor: theme.border }]}>About</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Version</Text>
          <Text style={[styles.settingValueText, { color: theme.textSecondary }]}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  dangerItem: {
    borderTopWidth: 1,
    marginTop: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  dangerText: {
    color: colors.error,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    marginRight: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  priorityColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});