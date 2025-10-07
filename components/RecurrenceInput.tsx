import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Switch,
} from 'react-native';
import { Repeat } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { RecurrenceType } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

type RecurrenceInputProps = {
  recurrence: {
    type: RecurrenceType;
    enabled: boolean;
  };
  onRecurrenceChange: (recurrence: { type: RecurrenceType; enabled: boolean }) => void;
};

export const RecurrenceInput = ({ recurrence, onRecurrenceChange }: RecurrenceInputProps) => {
  const { theme } = useAppTheme();
  
  const handleToggleRecurrence = (enabled: boolean) => {
    onRecurrenceChange({
      ...recurrence,
      enabled,
    });
  };
  
  const handleTypeChange = (type: RecurrenceType) => {
    onRecurrenceChange({
      ...recurrence,
      type,
    });
  };
  
  const recurrenceOptions: { type: RecurrenceType; label: string }[] = [
    { type: 'daily', label: 'Daily' },
    { type: 'weekly', label: 'Weekly' },
    { type: 'monthly', label: 'Monthly' },
    { type: 'yearly', label: 'Yearly' },
  ];
  
  return (
    <View style={[styles.container, { 
      backgroundColor: theme.card,
      borderColor: theme.border
    }]}>
      <View style={[
        styles.recurrenceHeader,
        recurrence.enabled && [styles.recurrenceHeaderWithBorder, { borderBottomColor: theme.border }]
      ]}>
        <View style={styles.recurrenceTitleContainer}>
          <Repeat size={20} color={theme.text} />
          <Text style={[styles.recurrenceTitle, { color: theme.text }]}>Recurring Task</Text>
        </View>
        
        <Switch
          value={recurrence.enabled}
          onValueChange={handleToggleRecurrence}
          trackColor={{ false: theme.border, true: `${colors.primary}80` }}
          thumbColor={recurrence.enabled ? colors.primary : '#f4f3f4'}
        />
      </View>
      
      {recurrence.enabled && (
        <View style={styles.recurrenceContent}>
          <Text style={[styles.recurrenceLabel, { color: theme.textSecondary }]}>Repeat every:</Text>
          
          <View style={styles.optionsContainer}>
            {recurrenceOptions.map(option => (
              <Pressable
                key={option.type}
                style={[
                  styles.optionButton,
                  { 
                    borderColor: theme.border,
                    backgroundColor: theme.background
                  },
                  recurrence.type === option.type && styles.selectedOption
                ]}
                onPress={() => handleTypeChange(option.type)}
              >
                <Text 
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    recurrence.type === option.type && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
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
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  recurrenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0,
  },
  recurrenceHeaderWithBorder: {
    borderBottomWidth: 1,
  },
  recurrenceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recurrenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recurrenceContent: {
    padding: 16,
  },
  recurrenceLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectedOption: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});