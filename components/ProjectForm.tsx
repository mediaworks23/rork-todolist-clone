import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { NewProject, Project } from '@/types/project';
import { useAppTheme } from '@/hooks/useAppTheme';

// Available colors for projects
const projectColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FF9800', // Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

type ProjectFormProps = {
  initialValues?: Partial<Project>;
  onSubmit: (project: NewProject) => void;
};

export const ProjectForm = ({ initialValues, onSubmit }: ProjectFormProps) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [color, setColor] = useState(initialValues?.color || projectColors[0]);
  const { theme } = useAppTheme();
  
  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const newProject: NewProject = {
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    };
    
    onSubmit(newProject);
  };
  
  const isFormValid = name.trim().length > 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Project Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter project name"
          placeholderTextColor={theme.textSecondary}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details about this project"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Color</Text>
        <View style={styles.colorContainer}>
          {projectColors.map((projectColor) => (
            <Pressable
              key={projectColor}
              style={[
                styles.colorOption,
                { backgroundColor: projectColor },
                color === projectColor && [styles.selectedColorOption, { borderColor: theme.text }],
              ]}
              onPress={() => setColor(projectColor)}
            />
          ))}
        </View>
      </View>
      
      <Pressable 
        style={[
          styles.submitButton,
          !isFormValid && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.submitButtonText}>
          {initialValues?.id ? 'Update Project' : 'Create Project'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
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