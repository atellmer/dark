export { ThemeProvider, useTheme } from './context';
export { parse } from './parse';
export { styled, css } from './styled';
export { createGlobalStyle } from './global';

declare module '@dark-engine/styled' {
  export interface DefaultTheme {}
}
