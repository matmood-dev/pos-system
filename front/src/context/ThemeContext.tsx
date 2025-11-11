import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    glass: string;
    glassBorder: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    glow: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: 'rgba(148, 163, 184, 0.3)',
    accent: '#4f46e5',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(148, 163, 184, 0.4)',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    large: '0 8px 32px rgba(0, 0, 0, 0.16)',
    glow: '0 0 20px rgba(79, 70, 229, 0.4)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    secondary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    surface: 'rgba(30, 41, 59, 0.95)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: 'rgba(71, 85, 105, 0.3)',
    accent: '#4f46e5',
    glass: 'rgba(30, 41, 59, 0.6)',
    glassBorder: 'rgba(71, 85, 105, 0.4)',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.5)',
    large: '0 8px 32px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(79, 70, 229, 0.6)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    secondary: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};