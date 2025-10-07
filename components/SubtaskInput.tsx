import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable,
} from 'react-native';
import { X, Plus, CheckCircle, Circle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SubTask } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

type SubtaskInputProps = {
  subtasks: SubTask[];
  onSubtasksChange: (subtasks: SubTask[]) => void;
};

export const SubtaskInput = ({ subtasks, onSubtasksChange }: SubtaskInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const { theme } = useAppTheme();
  
  const handleAddSubtask = () => {
    if (!inputValue.trim()) return;
    
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    onSubtasksChange([...subtasks, newSubtask]);
    setInputValue('');
  };
  
  const handleRemoveSubtask = (subtaskId: string) => {
    onSubtasksChange(subtasks.filter(subtask => subtask.id !== subtaskId));
  };
  
  const handleToggleSubtask = (subtaskId: string) => {
    onSubtasksChange(
      subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed } 
          : subtask
      )
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { 
        backgroundColor: theme.card,
        borderColor: theme.border
      }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Add a subtask..."
          placeholderTextColor={theme.textSecondary}
          onSubmitEditing={handleAddSubtask}
          returnKeyType="done"
        />
        
        <Pressable 
          style={[
            styles.addButton,
            !inputValue.trim() && styles.disabledButton
          ]}
          onPress={handleAddSubtask}
          disabled={!inputValue.trim()}
        >
          <Plus size={20} color={colors.primary} />
        </Pressable>
      </View>
      
      {subtasks.length > 0 && (
        <View style={[styles.subtasksContainer, { 
          backgroundColor: theme.card,
          borderColor: theme.border
        }]}>
          {/* Using a simple map instead of FlatList to avoid nesting VirtualizedLists */}
          <View style={styles.subtasksList}>
            {subtasks.map(item => (
              <View key={item.id} style={[styles.subtaskItem, { borderBottomColor: theme.border }]}>
                <Pressable
                  onPress={() => handleToggleSubtask(item.id)}
                  hitSlop={8}
                  style={styles.checkbox}
                >
                  {item.completed ? (
                    <CheckCircle size={20} color={colors.primary} />
                  ) : (
                    <Circle size={20} color={theme.textSecondary} />
                  )}
                </Pressable>
                
                <Text 
                  style={[
                    styles.subtaskText,
                    { color: theme.text },
                    item.completed && [styles.completedSubtaskText, { color: theme.textSecondary }]
                  ]}
                >
                  {item.title}
                </Text>
                
                <Pressable 
                  onPress={() => handleRemoveSubtask(item.id)}
                  hitSlop={8}
                  style={styles.removeButton}
                >
                  <X size={16} color={theme.textSecondary} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  subtasksContainer: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  subtasksList: {
    padding: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  checkbox: {
    marginRight: 8,
  },
  subtaskText: {
    flex: 1,
    fontSize: 16,
  },
  completedSubtaskText: {
    textDecorationLine: 'line-through',
  },
  removeButton: {
    padding: 4,
  },
});