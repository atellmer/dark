import { h, Fragment, component } from '@dark-engine/core';
import {
  createServerEnv,
  replacer,
  wrapWithStyledTag as style,
  wrapWithGlobalStyledTag as globalStyle,
} from '@test-utils';

import { setupGlobal as setupGlobal1, createGlobalStyle } from '../global';
import { setupGlobal as setupGlobal2, styled, css } from '../styled';
import { ServerStyleSheet } from './manager';

let { renderToString } = createServerEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ renderToString } = createServerEnv());
  setupGlobal1();
  setupGlobal2();
});

describe('[@styled/manager]', () => {
  test('renders to string on the server correctly', async () => {
    const GlobalStyle = createGlobalStyle`
      *, *::after, *::before {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
      }

      body {
        font-family: Arial;
      }
    `;
    const Box = styled('div')`
      width: 100px;
      height: 100px;

      ${() => css`
        background-color: blueviolet;
      `}
    `;
    const RedBox = styled(Box)`
      ${() => css`
        background-color: red;
      `}
    `;

    const App = component(() => {
      return (
        <>
          <GlobalStyle />
          <Box>Hello</Box>
          <RedBox>SSR</RedBox>
          <Box>!!!</Box>
        </>
      );
    });

    {
      const sheet = new ServerStyleSheet();
      const content = await renderToString(sheet.collectStyles(<App />));
      jest.runAllTimers();
      const tags = sheet.getStyleTags();

      sheet.seal();

      expect(content).toBe(
        `${replacer}<div class="dk-igjghg dk-fcgdjf">Hello</div><div class="dk-igjghg dk-fcgdjf dk-bejacb">SSR</div><div class="dk-igjghg dk-fcgdjf">!!!</div>`,
      );
      expect(tags).toEqual([
        globalStyle(
          '*, *::after, *::before{box-sizing:border-box;}html, body{margin:0;padding:0;}body{font-family:Arial;}',
        ),
        style(
          '.dk-igjghg{width:100px;height:100px;}.dk-fcgdjf{background-color:blueviolet;}.dk-bejacb{background-color:red;}',
        ),
      ]);
    }

    {
      const sheet = new ServerStyleSheet();
      const content = await renderToString(sheet.collectStyles(<App />));
      jest.runAllTimers();
      const tags = sheet.getStyleTags();

      sheet.seal();

      expect(content).toBe(
        `${replacer}<div class="dk-igjghg dk-fcgdjf">Hello</div><div class="dk-igjghg dk-fcgdjf dk-bejacb">SSR</div><div class="dk-igjghg dk-fcgdjf">!!!</div>`,
      );
      expect(tags).toEqual([
        globalStyle(
          '*, *::after, *::before{box-sizing:border-box;}html, body{margin:0;padding:0;}body{font-family:Arial;}',
        ),
        style(
          '.dk-igjghg{width:100px;height:100px;}.dk-fcgdjf{background-color:blueviolet;}.dk-bejacb{background-color:red;}',
        ),
      ]);
    }

    {
      const sheet = new ServerStyleSheet();
      const content = await renderToString(sheet.collectStyles(<App />));
      jest.runAllTimers();
      const tags = sheet.getStyleTags();

      sheet.seal();

      expect(content).toBe(
        `${replacer}<div class="dk-igjghg dk-fcgdjf">Hello</div><div class="dk-igjghg dk-fcgdjf dk-bejacb">SSR</div><div class="dk-igjghg dk-fcgdjf">!!!</div>`,
      );
      expect(tags).toEqual([
        globalStyle(
          '*, *::after, *::before{box-sizing:border-box;}html, body{margin:0;padding:0;}body{font-family:Arial;}',
        ),
        style(
          '.dk-igjghg{width:100px;height:100px;}.dk-fcgdjf{background-color:blueviolet;}.dk-bejacb{background-color:red;}',
        ),
      ]);
    }
  });
});
