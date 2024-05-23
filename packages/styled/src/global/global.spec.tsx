import { component } from '@dark-engine/core';
import { createBrowserEnv, replacer, wrapWithGlobalStyledTag as style } from '@test-utils';

import { setupGlobal, createGlobalStyle } from '../global';
import { css } from '../styled';

let { host, render } = createBrowserEnv();
const { head } = document;

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  setupGlobal();
});

describe('@styled/global', () => {
  test('can create global styles correctly', () => {
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

    const App = component(() => {
      return <GlobalStyle />;
    });

    render(<App />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style('*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;}'),
    );
  });

  test('works with global styles and props correctly', () => {
    type GlobalStyleProps = {
      $backgroundColor: string;
    };
    const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
      *, *::after, *::before {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
      }

      body {
        font-family: Arial;
        background-color: ${p => p.$backgroundColor};
      }
    `;

    render(<GlobalStyle $backgroundColor='white' />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:white;}',
      ),
    );

    render(<GlobalStyle $backgroundColor='black' />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:black;}',
      ),
    );

    render(<GlobalStyle $backgroundColor='white' />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:white;}',
      ),
    );
  });

  test('works with global styles and dynamic css correctly', () => {
    type GlobalStyleProps = {
      $backgroundColor: string;
    };
    const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
      *, *::after, *::before {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
      }

      ${p => css`
        body {
          font-family: Arial;
          background-color: ${p.$backgroundColor};
        }
      `}
    `;

    render(<GlobalStyle $backgroundColor='white' />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:white;}',
      ),
    );

    render(<GlobalStyle $backgroundColor='black' />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:black;}',
      ),
    );

    render(<GlobalStyle $backgroundColor='white' />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:white;}',
      ),
    );
  });

  test('removes styles when unmounting correctly', () => {
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
        background-color: white;
      }
    `;

    render(<GlobalStyle />);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(
      style(
        '*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:white;}',
      ),
    );

    render(null);

    expect(host.innerHTML).toBe(replacer);
    expect(head.innerHTML).toBe(style(''));
  });

  test('can nest a media query into the nested rule', () => {
    // https://github.com/atellmer/dark/issues/72
    const GlobalStyle = createGlobalStyle`
      *,
      *::after,
      *::before {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        font-family: Arial;
        background-color: white;
      }

      a {
        color: blue;

        @media (max-width: 800px) {
          color: red;
        }
      }
    `;

    render(<GlobalStyle />);

    expect(head.innerHTML).toMatchInlineSnapshot(
      `"<style dark-styled="g">*,*::after,*::before{box-sizing:border-box;}html,body{margin:0;padding:0;}body{font-family:Arial;background-color:white;}a{color:blue;}@media (max-width: 800px){a{color:red;}</style>"`,
    );
  });
});
