import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable,
  Modal,
} from 'react-native';
import { X, Plus, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCategoryStore } from '@/store/categoryStore';
import { Category } from '@/types/category';
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

type CategoryInputProps = {
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export const CategoryInput = ({ selectedCategoryId, onCategoryChange }: CategoryInputProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(categoryColors[0]);
  const [newCategoryIcon, setNewCategoryIcon] = useState(categoryIcons[0]);
  const { theme } = useAppTheme();
  
  const categories = useCategoryStore(state => state.categories);
  const addCategory = useCategoryStore(state => state.addCategory);
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: newCategoryIcon,
    };
    
    const categoryId = addCategory(newCategory);
    onCategoryChange(categoryId);
    
    // Reset form and close modal
    setNewCategoryName('');
    setNewCategoryColor(categoryColors[0]);
    setNewCategoryIcon(categoryIcons[0]);
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { 
        backgroundColor: theme.card,
        borderColor: theme.border
      }]}>
        <View style={styles.selectedCategoryContainer}>
          {selectedCategory && (
            <View 
              style={[
                styles.categoryChip, 
                { backgroundColor: `${selectedCategory.color}20` }
              ]}
            >
              <View style={[styles.categoryDot, { backgroundColor: selectedCategory.color }]} />
              <Text style={[styles.categoryText, { color: selectedCategory.color }]}>
                {selectedCategory.name}
              </Text>
            </View>
          )}
        </View>
        
        <Pressable 
          style={[styles.categoriesButton, { backgroundColor: `${colors.primary}15` }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.categoriesButtonText}>
            {selectedCategory ? 'Change Category' : 'Select Category'}
          </Text>
        </Pressable>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Category</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color={theme.text} />
              </Pressable>
            </View>
            
            <View style={styles.categoriesList}>
              {categories.map(category => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    { borderBottomColor: theme.border },
                    selectedCategoryId === category.id && styles.selectedCategoryOption
                  ]}
                  onPress={() => {
                    onCategoryChange(category.id);
                    setModalVisible(false);
                  }}
                >
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text 
                    style={[
                      styles.categoryOptionText,
                      { color: theme.text },
                      selectedCategoryId === category.id && styles.selectedCategoryOptionText
                    ]}
                  >
                    {category.name}
                  </Text>
                  {selectedCategoryId === category.id && (
                    <Check size={18} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <Text style={[styles.createCategoryTitle, { color: theme.text }]}>Create New Category</Text>
            
            <View style={styles.createCategoryForm}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text
                }]}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Category name"
                placeholderTextColor={theme.textSecondary}
              />
              
              <Text style={[styles.colorLabel, { color: theme.text }]}>Select color:</Text>
              <View style={styles.colorContainer}>
                {categoryColors.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      newCategoryColor === color && [styles.selectedColorOption, { borderColor: theme.text }],
                    ]}
                    onPress={() => setNewCategoryColor(color)}
                  />
                ))}
              </View>
              
              <Text style={[styles.iconLabel, { color: theme.text }]}>Select icon:</Text>
              <View style={styles.iconContainer}>
                {categoryIcons.map((icon) => (
                  <Pressable
                    key={icon}
                    style={[
                      styles.iconOption,
                      { 
                        backgroundColor: theme.card,
                        borderColor: theme.border
                      },
                      newCategoryIcon === icon && styles.selectedIconOption,
                    ]}
                    onPress={() => setNewCategoryIcon(icon)}
                  >
                    <Text style={[styles.iconText, { color: theme.text }]}>{icon}</Text>
                  </Pressable>
                ))}
              </View>
              
              <Pressable 
                style={[
                  styles.createButton,
                  !newCategoryName.trim() && styles.disabledButton
                ]}
                onPress={handleCreateCategory}
                disabled={!newCategoryName.trim()}
              >
                <Plus size={18} color="#fff" />
                <Text style={styles.createButtonText}>Create Category</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectedCategoryContainer: {
    marginBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  categoriesButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  categoriesList: {
    marginBottom: 20,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  selectedCategoryOption: {
    backgroundColor: `${colors.primary}10`,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 16,
  },
  selectedCategoryOptionText: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  createCategoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  createCategoryForm: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedColorOption: {
    borderWidth: 2,
  },
  iconLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  iconOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedIconOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  iconText: {
    fontSize: 14,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});