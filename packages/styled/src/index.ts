export { ThemeProvider, useTheme } from './theme';
export { createGlobalStyle } from './global';
export { keyframes } from './keyframes';
export { styled, css } from './styled';
export { useStyle } from './use-style';

declare module '@dark-engine/styled' {
  export interface DefaultTheme {}
}
