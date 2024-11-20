export const lightTheme = {
  // Background colors
  background: 'bg-[#ffffff]',
  cardBackground: 'bg-[#ffffff]',
  sidebarBackground: 'bg-[#fbfbfa]',
  
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
    background: 'bg-[#ffffff]',
    header: 'text-[#37352f]',
    weekDay: 'text-[#787774]',
    day: {
      default: 'bg-[#ffffff] hover:bg-[#f1f1ef] text-[#37352f] shadow-sm',
      selected: 'bg-[#37352f] text-white',
      today: 'border-[#37352f]',
      otherMonth: 'text-[#787774] bg-[#fafafa]'
    },
    navigation: {
      button: 'hover:bg-[#f1f1ef] text-[#37352f]',
      icon: 'h-5 w-5 text-[#37352f]'
    },
    tooltip: {
      background: 'bg-[#ffffff]',
      border: 'border-[#e9e9e8]',
      shadow: 'shadow-lg shadow-[#00000008]'
    }
  },
  
  // Navigation
  nav: {
    active: 'bg-[#f1f1ef] text-[#37352f]',
    inactive: 'text-[#37352f] hover:bg-[#f1f1ef]'
  }
};

export const darkTheme = {
  // Background colors
  background: 'bg-[#191919]',
  cardBackground: 'bg-[#2f2f2f]',
  sidebarBackground: 'bg-[#191919]',
  
  // Text colors
  text: 'text-[#ffffff]',
  mutedText: 'text-[#999999]',
  
  // Border colors
  border: 'border-[#393939]',
  
  // Interactive elements
  button: {
    primary: 'bg-[#ffffff] text-[#191919] hover:bg-[#e6e6e6]',
    secondary: 'bg-[#363636] text-[#ffffff] hover:bg-[#424242]',
    icon: 'hover:bg-[#363636] text-[#ffffff]'
  },
  
  // Input elements
  input: 'bg-[#2f2f2f] border-[#393939] focus:border-[#525252] text-[#ffffff]',
  
  // Calendar specific
  calendarDay: 'bg-[#2f2f2f] hover:bg-[#363636]',
  calendarDaySelected: 'bg-[#ffffff] text-[#191919]',
  
  // Habit list specific
  habitItem: 'hover:bg-[#363636]',
  habitCheckbox: 'border-[#393939] text-[#ffffff]',
  
  // Calendar specific (expanded)
  calendar: {
    background: 'bg-[#191919]',
    header: 'text-[#ffffff]',
    weekDay: 'text-[#999999]',
    day: {
      default: 'bg-[#2f2f2f] hover:bg-[#363636] text-[#ffffff] shadow-md shadow-[#00000030]',
      selected: 'bg-[#ffffff] text-[#191919]',
      today: 'border-[#ffffff]',
      otherMonth: 'text-[#666666] bg-[#242424]'
    },
    navigation: {
      button: 'hover:bg-[#363636] text-[#ffffff]',
      icon: 'h-5 w-5 text-[#ffffff]'
    },
    tooltip: {
      background: 'bg-[#2f2f2f]',
      border: 'border-[#393939]',
      shadow: 'shadow-lg shadow-[#00000050]'
    }
  },
  
  // Navigation
  nav: {
    active: 'bg-[#363636] text-[#ffffff]',
    inactive: 'text-[#ffffff] hover:bg-[#363636]'
  }
};

export type Theme = typeof lightTheme;

export const useTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
}; 