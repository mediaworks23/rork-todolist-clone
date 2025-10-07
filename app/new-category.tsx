import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useCategoryStore } from '@/store/categoryStore';
import { useAppTheme } from '@/hooks/useAppTheme';

// Available colors for categories
const categoryColors = [
  '#5D5FEF', // Indigo
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FF9800', // Orange
  '#795548', // Brown
];

// Available icons for categories (icon names from lucide-react-native)
const categoryIcons = [
  'briefcase',
  'user',
  'shopping-cart',
  'heart',
  'dollar-sign',
  'book-open',
  'home',
  'coffee',
  'car',
  'gift',
  'music',
  'film',
  'globe',
  'map-pin',
];

export default function NewCategoryScreen() {
  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);
  const [icon, setIcon] = useState(categoryIcons[0]);
  const { theme } = useAppTheme();
  
  const addCategory = useCategoryStore(state => state.addCategory);
  
  const handleSubmit = () => {
    if (!name.trim()) return;
    
    addCategory({
      name: name.trim(),
      color,
      icon,
    });
    
    router.back();
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'New Category',
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
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Category Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter category name"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Color</Text>
          <View style={styles.colorContainer}>
            {categoryColors.map((categoryColor) => (
              <Pressable
                key={categoryColor}
                style={[
                  styles.colorOption,
                  { backgroundColor: categoryColor },
                  color === categoryColor && [styles.selectedColorOption, { borderColor: theme.text }],
                ]}
                onPress={() => setColor(categoryColor)}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Icon</Text>
          <View style={styles.iconContainer}>
            {categoryIcons.map((categoryIcon) => (
              <Pressable
                key={categoryIcon}
                style={[
                  styles.iconOption,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  icon === categoryIcon && [styles.selectedIconOption, { backgroundColor: `${colors.primary}20`, borderColor: colors.primary }],
                ]}
                onPress={() => setIcon(categoryIcon)}
              >
                <Text style={[styles.iconText, { color: theme.text }]}>{categoryIcon}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.previewContainer}>
          <Text style={[styles.previewLabel, { color: theme.text }]}>Preview</Text>
          <View style={[styles.previewCategory, { backgroundColor: `${color}20` }]}>
            <View style={[styles.previewDot, { backgroundColor: color }]} />
            <Text style={[styles.previewText, { color }]}>
              {name || 'Category Name'}
            </Text>
          </View>
        </View>
        
        <Pressable 
          style={[
            styles.submitButton,
            !name.trim() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <Text style={styles.submitButtonText}>Create Category</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  selectedIconOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  iconText: {
    fontSize: 14,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  previewDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});