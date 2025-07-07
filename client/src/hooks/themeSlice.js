
import { createSlice } from '@reduxjs/toolkit';

const applyThemeClass = (isDarkMode) => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Load initial theme from localStorage and apply class
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const isDarkMode = savedTheme ? savedTheme === 'dark' : true; // Default: dark mode
  applyThemeClass(isDarkMode);
  return isDarkMode;
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
      applyThemeClass(state.isDarkMode);
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem('theme', action.payload ? 'dark' : 'light');
      applyThemeClass(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;