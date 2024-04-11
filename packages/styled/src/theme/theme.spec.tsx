import { component, Guard } from '@dark-engine/core';
import {
  createBrowserEnv,
  replacer,
  wrapWithStyledTag as style,
  wrapWithGlobalStyledTag as globalStyle,
} from '@test-utils';

import { createGlobalStyle } from '../global';
import { setupGlobal, styled } from '../styled';
import { ThemeProvider, useTheme } from './theme';

let { host, render } = createBrowserEnv();

type Theme = {
  backgroundColor: string;
  color: string;
};

type ThemeProps = {
  theme?: Theme;
};

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
  setupGlobal();
});

afterEach(() => {
  document.head.innerHTML = '';
});

describe('@styled/theme', () => {
  test('works with theme correctly', () => {
    const Box = styled('div')`
      width: 100px;
      height: 100px;
      background-color: ${(p: ThemeProps) => p.theme.backgroundColor};
      color: ${(p: ThemeProps) => p.theme.color};
    `;
    type AppProps = {
      theme: Theme;
    };
    const App = component<AppProps>(({ theme }) => {
      return (
        <ThemeProvider theme={theme}>
          <Guard>
            <Box />
            <Box />
            <Box />
          </Guard>
        </ThemeProvider>
      );
    });

    render(<App theme={{ backgroundColor: 'white', color: 'black' }} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe(
      '<div class="dk-igjghg dk-efcefj dk-baacag"></div><div class="dk-igjghg dk-efcefj dk-baacag"></div><div class="dk-igjghg dk-efcefj dk-baacag"></div>',
    );
    expect(document.head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-efcefj{background-color:white;}.dk-baacag{color:black;}'),
    );

    render(<App theme={{ backgroundColor: 'black', color: 'white' }} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe(
      '<div class="dk-igjghg dk-hhjdef dk-gjgeac"></div><div class="dk-igjghg dk-hhjdef dk-gjgeac"></div><div class="dk-igjghg dk-hhjdef dk-gjgeac"></div>',
    );
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-efcefj{background-color:white;}.dk-baacag{color:black;}.dk-hhjdef{background-color:black;}.dk-gjgeac{color:white;}',
      ),
    );
  });

  test('works with theme and global styles correctly', () => {
    const GlobalStyle = createGlobalStyle`
      body {
        background-color: ${(p: ThemeProps) => p.theme.backgroundColor};
        color: ${(p: ThemeProps) => p.theme.color};
      }
    `;
    type AppProps = {
      theme: Theme;
    };
    const App = component<AppProps>(({ theme }) => {
      return (
        <ThemeProvider theme={theme}>
          <Guard>
            <GlobalStyle />
          </Guard>
        </ThemeProvider>
      );
    });

    render(<App theme={{ backgroundColor: 'white', color: 'black' }} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe(replacer);
    expect(document.head.innerHTML).toBe(globalStyle('body{background-color:white;color:black;}'));
  });

  test('useTheme works correctly', () => {
    const spy = jest.fn();
    type AppProps = {
      theme: Theme;
    };
    const Item = component(() => {
      const theme = useTheme() as Theme;

      spy(theme);

      return null;
    });
    const App = component<AppProps>(({ theme }) => {
      return (
        <ThemeProvider theme={theme}>
          <Guard>
            <Item />
          </Guard>
        </ThemeProvider>
      );
    });

    render(<App theme={{ backgroundColor: 'white', color: 'black' }} />);
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ backgroundColor: 'white', color: 'black' });

    render(<App theme={{ backgroundColor: 'black', color: 'white' }} />);
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith({ backgroundColor: 'black', color: 'white' });
  });
});
