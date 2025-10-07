import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTaskStore } from '@/store/taskStore';
import { TaskItem } from '@/components/TaskItem';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { theme } = useAppTheme();
  
  const tasks = useTaskStore(state => state.tasks);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, date: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ day: i, date });
    }
    
    return days;
  };
  
  const formatDateForTaskFilter = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    return task.dueDate.startsWith(formatDateForTaskFilter(selectedDate));
  });
  
  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  const handleDayPress = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const handleAddTask = () => {
    router.push({
      pathname: '/new-task',
      params: { date: selectedDate.toISOString() }
    });
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  const hasTasksOnDate = (date: Date) => {
    return tasks.some(task => 
      task.dueDate && task.dueDate.startsWith(formatDateForTaskFilter(date))
    );
  };
  
  const calendarDays = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Pressable 
              style={styles.headerButton}
              onPress={handleAddTask}
            >
              <Plus size={24} color={theme.text} />
            </Pressable>
          ),
        }} 
      />
      
      <View style={[styles.calendarContainer, { backgroundColor: theme.card }]}>
        <View style={styles.monthSelector}>
          <Pressable onPress={handlePrevMonth} style={styles.monthButton}>
            <ChevronLeft size={24} color={theme.text} />
          </Pressable>
          
          <Text style={[styles.monthTitle, { color: theme.text }]}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          
          <Pressable onPress={handleNextMonth} style={styles.monthButton}>
            <ChevronRight size={24} color={theme.text} />
          </Pressable>
        </View>
        
        <View style={styles.weekdaysContainer}>
          {weekdays.map(day => (
            <Text key={day} style={[styles.weekday, { color: theme.textSecondary }]}>
              {day}
            </Text>
          ))}
        </View>
        
        <View style={styles.daysContainer}>
          {calendarDays.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.dayCell,
                item.date && isSelectedDate(item.date) && [styles.selectedDay, { backgroundColor: `${colors.primary}20` }],
              ]}
              onPress={() => item.date && handleDayPress(item.date)}
              disabled={!item.date}
            >
              {item.day > 0 && (
                <>
                  <Text
                    style={[
                      styles.dayText,
                      { color: theme.text },
                      item.date && isToday(item.date) && [styles.todayText, { color: colors.primary }],
                      item.date && isSelectedDate(item.date) && [styles.selectedDayText, { color: colors.primary }],
                    ]}
                  >
                    {item.day}
                  </Text>
                  
                  {item.date && hasTasksOnDate(item.date) && (
                    <View style={[styles.taskIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </>
              )}
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.tasksContainer}>
        <Text style={[styles.dateTitle, { color: theme.text }]}>
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskItem task={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="No tasks for this day" 
              message="Add a task by tapping the + button in the top right corner." 
            />
          }
        />
      </View>
      
      <Pressable 
        style={styles.fab}
        onPress={handleAddTask}
      >
        <Plus size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 16,
    padding: 4,
  },
  calendarContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dayText: {
    fontSize: 16,
  },
  todayText: {
    fontWeight: '700',
  },
  selectedDay: {
    borderRadius: 20,
  },
  selectedDayText: {
    fontWeight: '700',
  },
  taskIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  tasksContainer: {
    flex: 1,
    padding: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});