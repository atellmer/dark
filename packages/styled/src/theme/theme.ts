import { type DarkElement, createContext, useContext, component } from '@dark-engine/core';

import { type DefaultTheme } from '../';

// // styled.d.ts
// type Theme = {
//   color1: string;
//   color2: string;
//   color3: string;
// };
// declare module '@dark-engine/styled' {
//   export interface DefaultTheme extends Theme {}
// }

export type ThemeProps = { theme: DefaultTheme };

export type ThemeContextValue = DefaultTheme;

const ThemeContext = createContext<ThemeContextValue>(null, { displayName: 'Theme' });

const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  theme: DefaultTheme;
  slot: DarkElement;
};

const ThemeProvider = component<ThemeProviderProps>(({ theme, slot }) => {
  return ThemeContext({ value: theme, slot });
});

export { ThemeProvider, useTheme };
