import { useState } from  'react';
import { getItem, setItem } from '../localstorage'

const useTheme = () => {
  const storageTheme = getItem('theme');
  const [ theme, setTheme ] = useState(storageTheme || 'light');

  const themes = ['light', 'coffee', 'dark'];
  const toggleTheme = () => {
      const ind = themes.findIndex(t => t === theme);
      const newTheme = themes[(ind + 1) % themes.length];
      setTheme(newTheme)
      setItem('theme', newTheme);
  }

  return { theme, toggleTheme };
} 

export default useTheme;