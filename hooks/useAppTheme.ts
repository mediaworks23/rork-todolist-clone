import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { themes } from '@/constants/colors';

export function useAppTheme() {
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();
  
  // Determine which theme to use based on the user's preference
  const isDarkMode = 
    themeMode === 'dark' || 
    (themeMode === 'system' && systemColorScheme === 'dark');
  
  // Get the appropriate theme colors
  const theme = isDarkMode ? themes.dark : themes.light;
  
  return {
    theme,
    isDarkMode,
    themeMode,
  };
}