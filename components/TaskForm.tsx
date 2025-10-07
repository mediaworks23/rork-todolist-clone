import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { priorities } from '@/constants/priorities';
import { NewTask, Task, Tag, SubTask, RecurrenceType, Reminder } from '@/types/task';
import { useSettingsStore } from '@/store/settingsStore';
import { useProjectStore } from '@/store/projectStore';
import { TagInput } from './TagInput';
import { SubtaskInput } from './SubtaskInput';
import { ReminderInput } from './ReminderInput';
import { RecurrenceInput } from './RecurrenceInput';
import { CategoryInput } from './CategoryInput';
import { useAppTheme } from '@/hooks/useAppTheme';

type TaskFormProps = {
  initialValues?: Partial<Task>;
  onSubmit: (task: NewTask) => void;
  projectId?: string; // Optional project ID for pre-selecting project
};

export const TaskForm = ({ initialValues, onSubmit, projectId }: TaskFormProps) => {
  const defaultCategoryId = useSettingsStore(state => state.defaultCategoryId);
  const defaultPriorityId = useSettingsStore(state => state.defaultPriorityId);
  const projects = useProjectStore(state => state.projects);
  const { theme } = useAppTheme();
  
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialValues?.dueDate ? new Date(initialValues.dueDate) : undefined
  );
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId || defaultCategoryId);
  const [priorityId, setPriorityId] = useState(initialValues?.priorityId || defaultPriorityId);
  const [selectedProjectId, setSelectedProjectId] = useState(initialValues?.projectId || projectId || '');
  const [tags, setTags] = useState<Tag[]>(initialValues?.tags || []);
  const [subtasks, setSubtasks] = useState<SubTask[]>(initialValues?.subtasks || []);
  const [reminder, setReminder] = useState<Reminder | undefined>(initialValues?.reminder);
  const [recurrence, setRecurrence] = useState<{
    type: RecurrenceType;
    enabled: boolean;
  }>(initialValues?.recurrence || { type: 'daily', enabled: false });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  
  const handleSubmit = () => {
    if (!title.trim()) return;
    
    const newTask: NewTask = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate?.toISOString(),
      categoryId,
      priorityId,
      projectId: selectedProjectId || undefined,
      tags,
      subtasks,
      reminder,
      recurrence,
      completed: initialValues?.completed || false,
    };
    
    onSubmit(newTask);
  };
  
  const handleDateChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate(selectedDate);
      setShowDatePicker(false);
    }
  };
  
  // Web-compatible date picker
  const handleWebDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setDueDate(date);
    }
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return 'Add due date';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };
  
  const isFormValid = title.trim().length > 0;
  
  // Render each form section
  const renderFormSections = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Title</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.card, 
            borderColor: theme.border, 
            color: theme.text 
          }]}
          value={title}
          onChangeText={setTitle}
          placeholder="What needs to be done?"
          placeholderTextColor={theme.textSecondary}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea, { 
            backgroundColor: theme.card, 
            borderColor: theme.border, 
            color: theme.text 
          }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details about this task"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Project</Text>
        <Pressable 
          style={[styles.pickerButton, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}
          onPress={() => {
            setShowProjectPicker(!showProjectPicker);
            setShowPriorityPicker(false);
          }}
        >
          <Text style={[styles.pickerButtonText, { color: theme.text }]}>
            {selectedProjectId 
              ? projects.find(p => p.id === selectedProjectId)?.name || 'Select project'
              : 'No project'}
          </Text>
          <ChevronDown size={20} color={theme.textSecondary} />
        </Pressable>
        
        {showProjectPicker && (
          <View style={[styles.pickerOptions, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}>
            <Pressable
              style={[
                styles.pickerOption,
                { borderBottomColor: theme.border },
                selectedProjectId === '' && styles.selectedOption
              ]}
              onPress={() => {
                setSelectedProjectId('');
                setShowProjectPicker(false);
              }}
            >
              <Text 
                style={[
                  styles.pickerOptionText,
                  { color: theme.text },
                  selectedProjectId === '' && styles.selectedOptionText
                ]}
              >
                No project
              </Text>
            </Pressable>
            
            {projects.map(project => (
              <Pressable
                key={project.id}
                style={[
                  styles.pickerOption,
                  { borderBottomColor: theme.border },
                  selectedProjectId === project.id && styles.selectedOption
                ]}
                onPress={() => {
                  setSelectedProjectId(project.id);
                  setShowProjectPicker(false);
                }}
              >
                <View style={[styles.projectColorDot, { backgroundColor: project.color }]} />
                <Text 
                  style={[
                    styles.pickerOptionText,
                    { color: theme.text },
                    selectedProjectId === project.id && styles.selectedOptionText
                  ]}
                >
                  {project.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Due Date (optional)</Text>
        <Pressable 
          style={[styles.pickerButton, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color={theme.textSecondary} />
          <Text style={[styles.pickerButtonText, { color: theme.text }]}>
            {formatDate(dueDate)}
          </Text>
          {dueDate && (
            <Pressable 
              style={styles.clearButton}
              onPress={() => setDueDate(undefined)}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          )}
        </Pressable>
        
        {showDatePicker && Platform.OS === 'web' && (
          <View style={[styles.webDatePickerContainer, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}>
            <input
              type="date"
              onChange={handleWebDateChange}
              value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
              min={new Date().toISOString().split('T')[0]}
              style={{
                padding: 10,
                fontSize: 16,
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                width: '100%',
                backgroundColor: theme.card,
                color: theme.text
              }}
            />
            <Pressable 
              style={styles.webDatePickerButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.webDatePickerButtonText}>Done</Text>
            </Pressable>
          </View>
        )}
        
        {showDatePicker && Platform.OS !== 'web' && (
          <View style={[styles.nativeDatePickerContainer, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}>
            {/* We'll use a simple date selector for native platforms */}
            <View style={[styles.datePickerHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.datePickerTitle, { color: theme.text }]}>Select Date</Text>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </Pressable>
            </View>
            
            <View style={styles.datePickerContent}>
              {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                const date = new Date();
                date.setDate(date.getDate() + dayOffset);
                
                return (
                  <Pressable
                    key={dayOffset}
                    style={[
                      styles.dateOption,
                      dueDate && 
                      dueDate.toDateString() === date.toDateString() && 
                      styles.selectedDateOption
                    ]}
                    onPress={() => handleDateChange(date)}
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
            
            <Pressable 
              style={[styles.customDateButton, { borderTopColor: theme.border }]}
              onPress={() => {
                // In a real app, this would open a more detailed date picker
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                handleDateChange(nextWeek);
              }}
            >
              <Text style={styles.customDateButtonText}>Custom Date</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Category</Text>
        <CategoryInput 
          selectedCategoryId={categoryId}
          onCategoryChange={setCategoryId}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Priority</Text>
        <Pressable 
          style={[styles.pickerButton, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}
          onPress={() => {
            setShowPriorityPicker(!showPriorityPicker);
            setShowProjectPicker(false);
          }}
        >
          <Text style={[styles.pickerButtonText, { color: theme.text }]}>
            {priorities.find(p => p.id === priorityId)?.name || 'Select priority'}
          </Text>
          <ChevronDown size={20} color={theme.textSecondary} />
        </Pressable>
        
        {showPriorityPicker && (
          <View style={[styles.pickerOptions, { 
            backgroundColor: theme.card, 
            borderColor: theme.border 
          }]}>
            {priorities.map(priority => (
              <Pressable
                key={priority.id}
                style={[
                  styles.pickerOption,
                  { borderBottomColor: theme.border },
                  priorityId === priority.id && styles.selectedOption
                ]}
                onPress={() => {
                  setPriorityId(priority.id);
                  setShowPriorityPicker(false);
                }}
              >
                <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
                <Text 
                  style={[
                    styles.pickerOptionText,
                    { color: theme.text },
                    priorityId === priority.id && styles.selectedOptionText
                  ]}
                >
                  {priority.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Tags</Text>
        <TagInput 
          selectedTags={tags}
          onTagsChange={setTags}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Subtasks</Text>
        <SubtaskInput 
          subtasks={subtasks}
          onSubtasksChange={setSubtasks}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <ReminderInput 
          reminder={reminder}
          onReminderChange={setReminder}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <RecurrenceInput 
          recurrence={recurrence}
          onRecurrenceChange={setRecurrence}
        />
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
          {initialValues?.id ? 'Update Task' : 'Create Task'}
        </Text>
      </Pressable>
      
      {/* Add some padding at the bottom for scrolling */}
      <View style={styles.bottomPadding} />
    </>
  );
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
      {renderFormSections()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 0,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.primary,
  },
  pickerOptions: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  selectedOption: {
    backgroundColor: `${colors.primary}15`,
  },
  pickerOptionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  projectColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
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
  webDatePickerContainer: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  webDatePickerButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  webDatePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nativeDatePickerContainer: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerDone: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
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
  customDateButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  customDateButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});