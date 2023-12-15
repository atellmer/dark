import { type DarkElement, createContext, useContext, useMemo, component } from '@dark-engine/core';

import { type DefaultTheme } from '../';

export type ThemeContextValue = {
  theme: DefaultTheme;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: null }, { displayName: 'Theme' });

function useThemeContext() {
  const value = useContext(ThemeContext);

  return value;
}

function useTheme() {
  const { theme } = useThemeContext();

  return theme;
}

type ThemeProviderProps = {
  theme: DefaultTheme;
  slot: DarkElement;
};

const ThemeProvider = component<ThemeProviderProps>(({ theme, slot }) => {
  const value = useMemo(() => ({ theme }), [theme]);

  return ThemeContext.Provider({ value, slot });
});

export { ThemeProvider, useThemeContext, useTheme };
