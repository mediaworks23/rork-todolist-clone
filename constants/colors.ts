// Color palette for the app
export const colors = {
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',
  secondary: '#FF8A65',
  secondaryLight: '#FFB093',
  secondaryDark: '#C75B40',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Priority colors
  highPriority: '#F44336',
  mediumPriority: '#FFC107',
  lowPriority: '#4CAF50',
};

// Theme configuration
export const themes = {
  light: {
    text: '#212529',
    textSecondary: '#6C757D',
    background: '#F8F9FA',
    card: '#FFFFFF',
    border: '#E9ECEF',
    tint: colors.primary,
    tabIconDefault: '#ADB5BD',
    tabIconSelected: colors.primary,
    shadow: '#000',
  },
  dark: {
    text: '#F8F9FA',
    textSecondary: '#ADB5BD',
    background: '#121212',
    card: '#1E1E1E',
    border: '#333333',
    tint: colors.primaryLight,
    tabIconDefault: '#6C757D',
    tabIconSelected: colors.primaryLight,
    shadow: '#000',
  }
};

export default themes;