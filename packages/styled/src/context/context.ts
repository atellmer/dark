import { type DarkElement, createContext, useContext, useMemo, component } from '@dark-engine/core';

export type ThemeContextValue<T extends object = {}> = {
  theme: T;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: null }, { displayName: 'Theme' });

function useThemeContext() {
  const value = useContext(ThemeContext);

  return value;
}

type ThemeProviderProps<T extends object = {}> = {
  theme: T;
  slot: DarkElement;
};

const ThemeProvider = component<ThemeProviderProps>(({ theme, slot }) => {
  const value = useMemo(() => ({ theme }), [theme]);

  return ThemeContext.Provider({ value, slot });
});

export { ThemeProvider, useThemeContext };
