import { type DarkElement, h, Fragment, component } from '@dark-engine/core';
import {
  createServerEnv,
  replacer,
  wrapWithStyledTag as style,
  wrapWithGlobalStyledTag as globalStyle,
} from '@test-utils';

import { setupGlobal as setupGlobal1, createGlobalStyle } from '../global';
import { setupGlobal as setupGlobal2, styled, css } from '../styled';
import { DOCTYPE } from '../constants';
import { ServerStyleSheet } from './sheet';

let { renderToString, renderToStream } = createServerEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ renderToString, renderToStream } = createServerEnv());
  setupGlobal1();
  setupGlobal2();
});

describe('[@styled/server]', () => {
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
    const make = async () => {
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
    };

    await make();
    await make();
    await make();
  });

  test('renders to stream on the server correctly', async () => {
    const GlobalStyle = createGlobalStyle`
      body {
        font-family: Arial;
      }
    `;
    const Box = styled('div')`
      width: 100px;
      height: 100px;
      background-color: blueviolet;
    `;
    const Page = component<{ slot: DarkElement }>(({ slot }) => {
      return (
        <html>
          <head>
            <title>App</title>
          </head>
          <body>
            <div id='root'>{slot}</div>
          </body>
        </html>
      );
    });
    const App = component(() => {
      return (
        <>
          <GlobalStyle />
          <Box>Hello</Box>
          <Box>SSR</Box>
          <Box>!!!</Box>
        </>
      );
    });
    const make = () => {
      return new Promise(resolve => {
        const sheet = new ServerStyleSheet();
        const stream = sheet.interleaveWithStream(
          renderToStream(
            sheet.collectStyles(
              <Page>
                <App />
              </Page>,
            ),
            { bootstrapScripts: ['./build.js'] },
          ),
        );
        jest.runAllTimers();

        let data = '';
        stream.on('data', chunk => {
          data += chunk;
        });
        stream.on('end', () => {
          resolve(null);
          expect(data).toBe(
            `${DOCTYPE}<style dark-styled="interleave-global">body{font-family:Arial;}</style><style dark-styled="interleave-components">.dk-dhfaea{width:100px;height:100px;background-color:blueviolet;}</style><html><head><title>App</title></head><body><div id="root">${replacer}<div class="dk-dhfaea">Hello</div><div class="dk-dhfaea">SSR</div><div class="dk-dhfaea">!!!</div></div><script src="./build.js" defer></script></body></html>`,
          );
        });
      });
    };

    await make();
    await make();
    await make();
  });
});
