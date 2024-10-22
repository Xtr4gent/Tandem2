import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'spring' | 'summer' | 'fall' | 'halloween' | 'winter' | 'christmas';

interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  cardBackground: string;
  borderColor: string;
}

const themeColors: Record<Theme, ThemeColors> = {
  light: {
    primary: '#007AFF',
    background: '#F2F2F7',
    text: '#000000',
    cardBackground: '#FFFFFF',
    borderColor: '#E5E5EA',
  },
  dark: {
    primary: '#0A84FF',
    background: '#000000',
    text: '#FFFFFF',
    cardBackground: '#1C1C1E',
    borderColor: '#38383A',
  },
  spring: {
    primary: '#4CAF50',
    background: '#E8F5E9',
    text: '#1B5E20',
    cardBackground: '#FFFFFF',
    borderColor: '#A5D6A7',
  },
  summer: {
    primary: '#FF9800',
    background: '#FFF3E0',
    text: '#E65100',
    cardBackground: '#FFFFFF',
    borderColor: '#FFCC80',
  },
  fall: {
    primary: '#795548',
    background: '#EFEBE9',
    text: '#3E2723',
    cardBackground: '#FFFFFF',
    borderColor: '#BCAAA4',
  },
  halloween: {
    primary: '#FF5722',
    background: '#212121',
    text: '#FFFFFF',
    cardBackground: '#424242',
    borderColor: '#FF9800',
  },
  winter: {
    primary: '#2196F3',
    background: '#E3F2FD',
    text: '#0D47A1',
    cardBackground: '#FFFFFF',
    borderColor: '#90CAF9',
  },
  christmas: {
    primary: '#4CAF50',
    background: '#FFEBEE',
    text: '#B71C1C',
    cardBackground: '#FFFFFF',
    borderColor: '#EF9A9A',
  },
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themeColors[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark', 'spring', 'summer', 'fall', 'halloween', 'winter', 'christmas');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};