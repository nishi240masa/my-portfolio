'use client';

import { createContext, useContext } from 'react';
import type { ThemeMode } from '../theme';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export { THEME_STORAGE_KEY } from './themeStorageKey';
