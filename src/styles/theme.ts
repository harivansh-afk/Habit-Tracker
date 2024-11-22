export const lightTheme = {
  // Background colors
  background: 'bg-[#fafafa]',
  cardBackground: 'bg-white/80 backdrop-blur-[2px]',
  sidebarBackground: 'bg-white/90 backdrop-blur-[2px]',
  
  // Text colors
  text: 'text-[#37352f]',
  mutedText: 'text-[#787774]',
  
  // Border colors
  border: 'border-[#e9e9e8]',
  
  // Interactive elements
  button: {
    primary: 'bg-[#37352f] text-white hover:bg-[#2f2f2f]',
    secondary: 'bg-[#f1f1ef] text-[#37352f] hover:bg-[#e9e9e8]',
    icon: 'hover:bg-[#f1f1ef] text-[#37352f]'
  },
  
  // Input elements
  input: 'bg-[#ffffff] border-[#e9e9e8] focus:border-[#37352f] text-[#37352f]',
  
  // Calendar specific
  calendarDay: 'bg-[#ffffff] hover:bg-[#f1f1ef]',
  calendarDaySelected: 'bg-[#37352f] text-white',
  
  // Habit list specific
  habitItem: 'hover:bg-[#f1f1ef]',
  habitCheckbox: 'border-[#e9e9e8] text-[#37352f]',
  
  // Calendar specific (expanded)
  calendar: {
    background: 'bg-white/80 backdrop-blur-[2px]',
    header: 'text-[#37352f]',
    weekDay: 'text-[#787774]',
    day: {
      default: 'bg-white/90 hover:bg-[#f1f1ef] text-[#37352f] shadow-sm',
      selected: 'bg-[#37352f] text-white',
      today: 'ring-1 ring-inset ring-black/5 dark:ring-white/5',
      otherMonth: 'text-[#787774] bg-[#fafafa]'
    },
    navigation: {
      button: 'hover:bg-[#f1f1ef] text-[#37352f]',
      icon: 'h-5 w-5 text-[#37352f]'
    },
    tooltip: {
      background: 'bg-white/95 backdrop-blur-[4px]',
      border: 'border-[#e9e9e8]',
      shadow: 'shadow-lg shadow-[#00000008]'
    }
  },
  
  // Navigation
  nav: {
    active: 'bg-[#f1f1ef]/80 text-[#37352f] shadow-inner',
    inactive: 'text-[#37352f] hover:bg-[#f1f1ef]/50'
  }
};

export const darkTheme = {
  // Background colors
  background: 'bg-[#191919]',
  cardBackground: 'bg-[#232323]/80 backdrop-blur-[2px]',
  sidebarBackground: 'bg-[#1d1d1d]/90 backdrop-blur-[2px]',
  
  // Text colors
  text: 'text-[#e6e6e6]',
  mutedText: 'text-[#999999]',
  
  // Border colors
  border: 'border-[#2a2a2a]',
  
  // Interactive elements
  button: {
    primary: 'bg-[#e6e6e6] text-[#191919] hover:bg-[#d1d1d1]',
    secondary: 'bg-[#2a2a2a] text-[#e6e6e6] hover:bg-[#333333]',
    icon: 'hover:bg-[#2a2a2a] text-[#e6e6e6]'
  },
  
  // Input elements
  input: 'bg-[#232323] border-[#2a2a2a] focus:border-[#404040] text-[#e6e6e6]',
  
  // Calendar specific
  calendarDay: 'bg-[#232323] hover:bg-[#2a2a2a]',
  calendarDaySelected: 'bg-[#e6e6e6] text-[#191919]',
  
  // Habit list specific
  habitItem: 'hover:bg-[#2a2a2a]',
  habitCheckbox: 'border-[#2a2a2a] text-[#e6e6e6]',
  
  // Calendar specific (expanded)
  calendar: {
    background: 'bg-[#232323]/90 backdrop-blur-[2px]',
    header: 'text-[#e6e6e6]',
    weekDay: 'text-[#999999]',
    day: {
      default: 'bg-[#232323]/90 hover:bg-[#2a2a2a] text-[#e6e6e6] shadow-sm shadow-[#00000015]',
      selected: 'bg-[#e6e6e6] text-[#191919]',
      today: 'ring-1 ring-inset ring-white/10',
      otherMonth: 'text-[#666666] bg-[#1f1f1f]'
    },
    navigation: {
      button: 'hover:bg-[#2a2a2a] text-[#e6e6e6]',
      icon: 'h-5 w-5 text-[#e6e6e6]'
    },
    tooltip: {
      background: 'bg-[#232323]/95 backdrop-blur-[4px]',
      border: 'border-[#2a2a2a]',
      shadow: 'shadow-lg shadow-[#00000030]'
    }
  },
  
  // Navigation
  nav: {
    active: 'bg-[#2a2a2a]/80 text-[#e6e6e6] shadow-inner',
    inactive: 'text-[#e6e6e6]/80 hover:bg-[#2a2a2a]/50'
  }
};

export type Theme = typeof lightTheme;

export const useTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
}; 