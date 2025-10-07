import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  FlatList,
  ScrollView,
} from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/taskStore';
import { Tag } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

// Available colors for tags
const tagColors = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FF9800', // Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

type TagInputProps = {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
};

export const TagInput = ({ selectedTags, onTagsChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { theme } = useAppTheme();
  
  const allTags = useTaskStore(state => state.tags);
  const addTag = useTaskStore(state => state.addTag);
  
  const handleAddTag = (tag: Tag) => {
    // Check if tag is already selected
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };
  
  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };
  
  const handleCreateTag = () => {
    if (!inputValue.trim()) return;
    
    const newTag = {
      name: inputValue.trim(),
      color: newTagColor,
    };
    
    const tagId = addTag(newTag);
    const createdTag = { ...newTag, id: tagId };
    
    handleAddTag(createdTag);
    setIsCreatingTag(false);
    setInputValue('');
    setNewTagColor(tagColors[0]);
  };
  
  const filteredSuggestions = allTags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.some(t => t.id === tag.id)
  );
  
  // Render each tag item
  const renderTagItem = (tag: Tag) => (
    <View 
      key={tag.id} 
      style={[styles.tagChip, { backgroundColor: `${tag.color}20` }]}
    >
      <Text style={[styles.tagText, { color: tag.color }]}>
        {tag.name}
      </Text>
      <Pressable 
        onPress={() => handleRemoveTag(tag.id)}
        hitSlop={8}
      >
        <X size={16} color={tag.color} />
      </Pressable>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.selectedTagsContainer}>
        {/* Render tags in a row with wrapping */}
        <View style={styles.tagsContainer}>
          {selectedTags.map(renderTagItem)}
        </View>
      </View>
      
      {isCreatingTag ? (
        <View style={[styles.createTagContainer, { 
          backgroundColor: theme.card,
          borderColor: theme.border
        }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter tag name"
            placeholderTextColor={theme.textSecondary}
            autoFocus
          />
          
          <Text style={[styles.colorLabel, { color: theme.text }]}>Select color:</Text>
          <View style={styles.colorContainer}>
            {tagColors.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  newTagColor === color && [styles.selectedColorOption, { borderColor: theme.text }],
                ]}
                onPress={() => setNewTagColor(color)}
              />
            ))}
          </View>
          
          <View style={styles.createTagButtons}>
            <Pressable 
              style={[styles.createTagButton, styles.cancelButton, { backgroundColor: theme.border }]}
              onPress={() => {
                setIsCreatingTag(false);
                setInputValue('');
              }}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.createTagButton, 
                styles.saveButton,
                !inputValue.trim() && styles.disabledButton
              ]}
              onPress={handleCreateTag}
              disabled={!inputValue.trim()}
            >
              <Text style={styles.saveButtonText}>Create Tag</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={[styles.inputContainer, { 
          backgroundColor: theme.card,
          borderColor: theme.border
        }]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: theme.text }]}
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              setShowSuggestions(!!text);
            }}
            placeholder="Add or search tags..."
            placeholderTextColor={theme.textSecondary}
            onFocus={() => setShowSuggestions(!!inputValue)}
          />
          
          <Pressable 
            style={styles.addButton}
            onPress={() => setIsCreatingTag(true)}
          >
            <Plus size={20} color={colors.primary} />
          </Pressable>
        </View>
      )}
      
      {showSuggestions && !isCreatingTag && filteredSuggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { 
          backgroundColor: theme.card,
          borderColor: theme.border
        }]}>
          {/* Using a simple map instead of FlatList to avoid nesting VirtualizedLists */}
          <View style={styles.suggestionsList}>
            {filteredSuggestions.map(item => (
              <Pressable 
                key={item.id}
                style={[styles.suggestionItem, { borderBottomColor: theme.border }]}
                onPress={() => handleAddTag(item)}
              >
                <View 
                  style={[
                    styles.tagColorDot, 
                    { backgroundColor: item.color }
                  ]} 
                />
                <Text style={[styles.suggestionText, { color: theme.text }]}>{item.name}</Text>
              </Pressable>
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
  selectedTagsContainer: {
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
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
  suggestionsContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
  },
  suggestionsList: {
    padding: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
  },
  tagColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  createTagContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedColorOption: {
    borderWidth: 2,
  },
  createTagButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  createTagButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});