import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPriority } from '@/constants/priorities';

type PriorityBadgeProps = {
  priorityId: string;
  size?: 'small' | 'medium' | 'large';
};

export const PriorityBadge = ({ priorityId, size = 'medium' }: PriorityBadgeProps) => {
  const priority = getPriority(priorityId);
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: `${priority.color}20` },
      size === 'small' && styles.smallContainer,
      size === 'large' && styles.largeContainer,
    ]}>
      <Text style={[
        styles.text, 
        { color: priority.color },
        size === 'small' && styles.smallText,
        size === 'large' && styles.largeText,
      ]}>
        {priority.name}
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