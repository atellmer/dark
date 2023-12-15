export { ThemeProvider, useTheme } from './context';
export { parse } from './parse';
export * from './styled';

declare module '@dark-engine/styled' {
  export interface DefaultTheme {}
}
