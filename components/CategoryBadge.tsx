import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCategoryStore } from '@/store/categoryStore';

type CategoryBadgeProps = {
  categoryId: string;
  size?: 'small' | 'medium' | 'large';
};

export const CategoryBadge = ({ categoryId, size = 'medium' }: CategoryBadgeProps) => {
  const categories = useCategoryStore(state => state.categories);
  const category = categories.find(cat => cat.id === categoryId) || categories[0];
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: `${category.color}20` },
      size === 'small' && styles.smallContainer,
      size === 'large' && styles.largeContainer,
    ]}>
      <Text style={[
        styles.text, 
        { color: category.color },
        size === 'small' && styles.smallText,
        size === 'large' && styles.largeText,
      ]}>
        {category.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  largeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 16,
  },
});