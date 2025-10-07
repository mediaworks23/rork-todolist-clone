import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Switch,
  Platform,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Reminder } from '@/types/task';
import { useAppTheme } from '@/hooks/useAppTheme';

type ReminderInputProps = {
  reminder?: Reminder;
  onReminderChange: (reminder?: Reminder) => void;
};

export const ReminderInput = ({ reminder, onReminderChange }: ReminderInputProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { theme } = useAppTheme();
  
  const defaultReminder: Reminder = reminder || {
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    enabled: true,
  };
  
  const [currentReminder, setCurrentReminder] = useState<Reminder>(defaultReminder);
  
  const handleToggleReminder = (enabled: boolean) => {
    if (enabled) {
      // Enable reminder with default values if none exists
      const updatedReminder = { ...currentReminder, enabled };
      setCurrentReminder(updatedReminder);
      onReminderChange(updatedReminder);
    } else {
      // Disable reminder but keep the values
      const updatedReminder = { ...currentReminder, enabled };
      setCurrentReminder(updatedReminder);
      onReminderChange(updatedReminder);
    }
  };
  
  const handleDateChange = (date: string) => {
    const updatedReminder = { ...currentReminder, date };
    setCurrentReminder(updatedReminder);
    onReminderChange(updatedReminder);
    setShowDatePicker(false);
  };
  
  const handleTimeChange = (time: string) => {
    const updatedReminder = { ...currentReminder, time };
    setCurrentReminder(updatedReminder);
    onReminderChange(updatedReminder);
    setShowTimePicker(false);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Web-compatible date picker
  const handleWebDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDateChange(e.target.value);
  };
  
  // Web-compatible time picker
  const handleWebTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleTimeChange(e.target.value);
  };
  
  return (
    <View style={[styles.container, { 
      backgroundColor: theme.card,
      borderColor: theme.border
    }]}>
      <View style={[styles.reminderHeader, { borderBottomColor: theme.border }]}>
        <View style={styles.reminderTitleContainer}>
          <Clock size={20} color={theme.text} />
          <Text style={[styles.reminderTitle, { color: theme.text }]}>Set Reminder</Text>
        </View>
        
        <Switch
          value={currentReminder.enabled}
          onValueChange={handleToggleReminder}
          trackColor={{ false: theme.border, true: `${colors.primary}80` }}
          thumbColor={currentReminder.enabled ? colors.primary : '#f4f3f4'}
        />
      </View>
      
      {currentReminder.enabled && (
        <View style={styles.reminderContent}>
          <View style={styles.reminderRow}>
            <Pressable 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formatDate(currentReminder.date)}
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                {formatTime(currentReminder.time)}
              </Text>
            </Pressable>
          </View>
          
          {showDatePicker && (
            <View style={[styles.pickerContainer, { backgroundColor: theme.background }]}>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  value={currentReminder.date}
                  onChange={handleWebDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    width: '100%',
                    marginBottom: 10,
                    backgroundColor: theme.card,
                    color: theme.text
                  }}
                />
              ) : (
                <View style={styles.nativeDatePickerContainer}>
                  {/* Simple date picker UI for demonstration */}
                  <View style={styles.datePickerContent}>
                    {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                      const date = new Date();
                      date.setDate(date.getDate() + dayOffset);
                      const dateString = date.toISOString().split('T')[0];
                      
                      return (
                        <Pressable
                          key={dayOffset}
                          style={[
                            styles.dateOption,
                            currentReminder.date === dateString && styles.selectedDateOption
                          ]}
                          onPress={() => handleDateChange(dateString)}
                        >
                          <Text style={[styles.dateOptionDay, { color: theme.textSecondary }]}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </Text>
                          <Text style={[styles.dateOptionDate, { color: theme.text }]}>
                            {date.getDate()}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}
              
              <Pressable 
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </View>
          )}
          
          {showTimePicker && (
            <View style={[styles.pickerContainer, { backgroundColor: theme.background }]}>
              {Platform.OS === 'web' ? (
                <input
                  type="time"
                  value={currentReminder.time}
                  onChange={handleWebTimeChange}
                  style={{
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    width: '100%',
                    marginBottom: 10,
                    backgroundColor: theme.card,
                    color: theme.text
                  }}
                />
              ) : (
                <View style={styles.nativeTimePickerContainer}>
                  {/* Simple time picker UI for demonstration */}
                  <View style={styles.timePickerContent}>
                    {['08:00', '09:00', '12:00', '15:00', '18:00', '20:00'].map(time => (
                      <Pressable
                        key={time}
                        style={[
                          styles.timeOption,
                          { backgroundColor: theme.card },
                          currentReminder.time === time && styles.selectedTimeOption
                        ]}
                        onPress={() => handleTimeChange(time)}
                      >
                        <Text style={[styles.timeOptionText, { color: theme.text }]}>
                          {formatTime(time)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              
              <Pressable 
                style={styles.doneButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </View>
          )}
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
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  reminderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reminderContent: {
    padding: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 2,
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  timeButton: {
    flex: 1,
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  pickerContainer: {
    marginTop: 16,
    borderRadius: 8,
    padding: 12,
  },
  doneButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  nativeDatePickerContainer: {
    marginBottom: 12,
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    width: 40,
  },
  selectedDateOption: {
    backgroundColor: `${colors.primary}20`,
  },
  dateOptionDay: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateOptionDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  nativeTimePickerContainer: {
    marginBottom: 12,
  },
  timePickerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  timeOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    width: '30%',
    marginBottom: 8,
  },
  selectedTimeOption: {
    backgroundColor: `${colors.primary}20`,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});