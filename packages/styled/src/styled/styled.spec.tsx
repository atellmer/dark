import { h } from '@dark-engine/core';
import { createBrowserEnv } from '@test-utils';

import { setupGlobal, styled, css, detectIsStyled } from './styled';

let { host, render } = createBrowserEnv();

const style = (x: string) => `<style dark-styled-components="true">${x}</style>`;

beforeEach(() => {
  jest.useFakeTimers();
  setupGlobal();
  ({ host, render } = createBrowserEnv());
});

afterEach(() => {
  document.head.innerHTML = '';
});

describe('[@styled/styled]', () => {
  test('creates a simple styled component correctly', () => {
    const Layout = styled('div')`
      background-color: aqua;
      color: black;
    `;

    expect(typeof Layout).toBe('function');
    expect(detectIsStyled(() => {})).toBe(false);
    expect(detectIsStyled(Layout)).toBe(true);
  });

  test('renders a simple styled component correctly', () => {
    const Layout = styled('div')`
      background-color: aqua;
      color: black;
    `;

    render(<Layout />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-bccjif"></div>');
    expect(document.head.innerHTML).toBe(style('.dk-bccjif{background-color:aqua;color:black;}'));
  });

  test('renders a styled component with media query correctly', () => {
    const Layout = styled('div')`
      background-color: aqua;
      color: black;

      @media (max-width: 600px) {
        background-color: bisque;
      }
    `;

    render(<Layout />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-bcjdcc"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-bcjdcc{background-color:aqua;color:black;}@media (max-width: 600px){.dk-bcjdcc{background-color:bisque;}}',
      ),
    );
  });

  test('renders a styled component with nesting correctly', () => {
    const Layout = styled('div')`
      background-color: aqua;
      color: black;

      & .item {
        color: red;
      }
    `;

    render(
      <Layout>
        <span class='item'>content</span>
      </Layout>,
    );
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-cbcbei"><span class="item">content</span></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-cbcbei{background-color:aqua;color:black;}.dk-cbcbei .item{color:red;}'),
    );
  });

  test('renders a styled component with keyframes correctly', () => {
    const Box = styled('div')`
      width: 100px;
      height: 100px;
      background-color: darkred;
      animation: spin 3s infinite;

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }
    `;

    render(<Box />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-bgdcea"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-bgdcea{width:100px;height:100px;background-color:darkred;animation:spin 3s infinite;}@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}',
      ),
    );
  });

  test('renders a styled component with a media query and nesting correctly', () => {
    const Layout = styled('div')`
      background-color: aqua;
      color: black;

      & .item {
        color: red;
      }

      @media (max-width: 600px) {
        background-color: bisque;

        & .item {
          color: blue;
        }
      }
    `;

    render(
      <Layout>
        <span class='item'>content</span>
      </Layout>,
    );
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-bagcdh"><span class="item">content</span></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-bagcdh{background-color:aqua;color:black;}.dk-bagcdh .item{color:red;}@media (max-width: 600px){.dk-bagcdh{background-color:bisque;}.dk-bagcdh .item{color:blue;}}',
      ),
    );
  });

  test('renders nested styled components correctly', () => {
    const Layout = styled('div')`
      width: 100%;
      padding: 16px;
    `;
    const Button = styled('button')`
      background-color: darkcyan;
      font-size: 1rem;
    `;

    render(
      <Layout>
        <Button>Click me</Button>
      </Layout>,
    );
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-gfaebb"><button class="dk-jbdicb">Click me</button></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-gfaebb{width:100%;padding:16px;}.dk-jbdicb{background-color:darkcyan;font-size:1rem;}'),
    );
  });

  test('can redefine nested styles correctly', () => {
    const Button = styled('button')`
      background-color: darkcyan;
      font-size: 1rem;
    `;
    const Layout = styled('div')`
      width: 100%;
      padding: 16px;

      & ${Button} {
        font-size: 2rem;
      }
    `;

    render(
      <Layout>
        <Button>Click me</Button>
      </Layout>,
    );
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-caagaf"><button class="dk-jbdicb">Click me</button></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-caagaf{width:100%;padding:16px;}.dk-caagaf .dk-jbdicb{font-size:2rem;}.dk-jbdicb{background-color:darkcyan;font-size:1rem;}',
      ),
    );
  });

  test('renders a styled component with style props correctly #1', () => {
    type BoxProps = {
      $backgroudColor: string;
    };
    const Box = styled<BoxProps>('div')`
      width: 100px;
      height: 100px;
      background-color: ${p => p.$backgroudColor};
    `;

    render(<Box $backgroudColor='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb"></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}'),
    );

    render(<Box $backgroudColor='blue' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bicagj"></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bicagj{background-color:blue;}'),
    );

    render(<Box $backgroudColor='green' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bhbbdd"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bicagj{background-color:blue;}.dk-bhbbdd{background-color:green;}',
      ),
    );

    render(<Box $backgroudColor='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bicagj{background-color:blue;}.dk-bhbbdd{background-color:green;}',
      ),
    );
  });

  test('renders a styled component with style props correctly #2', () => {
    type BoxProps = {
      $color: string;
    };
    const Box = styled<BoxProps>('div')`
      width: 100px;
      height: 100px;
      background-color: ${p => p.$color};
      border: 1px solid ${p => p.$color};
    `;

    render(<Box $color='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb dk-bfiehd"></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bfiehd{border:1px solid red;}'),
    );

    render(<Box $color='#222' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-iiehgg dk-bfbcdd"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bfiehd{border:1px solid red;}.dk-iiehgg{background-color:#222;}.dk-bfbcdd{border:1px solid #222;}',
      ),
    );

    render(<Box $color='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb dk-bfiehd"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bfiehd{border:1px solid red;}.dk-iiehgg{background-color:#222;}.dk-bfbcdd{border:1px solid #222;}',
      ),
    );
  });

  test('renders a styled component with style props correctly #3', () => {
    type BoxProps = {
      $color: string;
      $borderType: 'solid' | 'dashed';
    };
    const Box = styled<BoxProps>('div')`
      width: 100px;
      height: 100px;
      border: ${() => '1px'} ${p => p.$borderType} ${p => p.$color};
    `;

    render(<Box $color='red' $borderType='solid' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bfiehd"></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-bfiehd{border:1px solid red;}'),
    );
  });

  test('renders a styled component with dynamic css parts correctly #1', () => {
    type BoxProps = {
      $color: string;
    };
    const Box = styled<BoxProps>('div')`
      width: 100px;
      height: 100px;

      ${p => css`
        background-color: ${p.$color};
        border: 1px solid ${p.$color};
      `}
    `;

    render(<Box $color='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-egbggh"></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}'),
    );

    render(<Box $color='green ' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-eehgaf"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}.dk-eehgaf{background-color:green;border:1px solid green;}',
      ),
    );

    render(<Box $color='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-egbggh"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}.dk-eehgaf{background-color:green;border:1px solid green;}',
      ),
    );
  });

  test('renders a styled component with dynamic css parts correctly #2', () => {
    type BoxProps = {
      $color: string;
    };
    const Box = styled<BoxProps>('div')`
      ${() => css`
        width: 100px;
        height: 100px;
      `}

      ${p => css`
        background-color: ${p.$color};
        border: 1px solid ${p.$color};
      `}
    `;

    render(<Box $color='red' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-cagiea dk-igjghg dk-egbggh"></div>');
    expect(document.head.innerHTML).toBe(
      style('.dk-cagiea{}.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}'),
    );

    render(<Box $color='orange' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-cagiea dk-igjghg dk-biaaih"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-cagiea{}.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}.dk-biaaih{background-color:orange;border:1px solid orange;}',
      ),
    );
  });

  test('renders a styled component with dynamic css parts correctly #3', () => {
    type BoxProps = {
      $backgroundColor: string;
      $borderColor: string;
    };
    const Box = styled<BoxProps>('div')`
      width: 100px;
      height: 100px;

      ${p => css`
        background-color: ${p.$backgroundColor};
      `}

      ${p => css`
        border: 1px solid ${p.$borderColor};
      `}
    `;

    render(<Box $backgroundColor='red' $borderColor='orange' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb dk-bgciah"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bgciah{border:1px solid orange;}',
      ),
    );

    render(<Box $backgroundColor='yellow' $borderColor='orange' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-dhehda dk-bgciah"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bgciah{border:1px solid orange;}.dk-dhehda{background-color:yellow;}',
      ),
    );

    render(<Box $backgroundColor='orange' $borderColor='yellow' />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bgdgjb dk-gccdce"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bgciah{border:1px solid orange;}.dk-dhehda{background-color:yellow;}.dk-bgdgjb{background-color:orange;}.dk-gccdce{border:1px solid yellow;}',
      ),
    );
  });

  test('renders a styled component with an attribute config correctly', () => {
    const Input = styled('input').attrs(p => ({ ...p, type: 'text' }))`
      width: 100%;
      border: 1px solid aliceblue;
    `;

    render(<Input />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<input type="text" class="dk-bjgffe">');
    expect(document.head.innerHTML).toBe(style('.dk-bjgffe{width:100%;border:1px solid aliceblue;}'));
  });

  test('can extends styles correctly', () => {
    const ButtonBase = styled('button')`
      width: 100%;
      background-color: #11ed74;
    `;
    const NormalButton = styled(ButtonBase)`
      font-size: 1rem;
    `;
    const BigButton = styled(ButtonBase)`
      font-size: 2rem;
    `;

    render(<NormalButton>Click</NormalButton>);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<button class="dk-fedjjc dk-eifded">Click</button>');
    expect(document.head.innerHTML).toBe(
      style('.dk-fedjjc{font-size:1rem;}.dk-eifded{width:100%;background-color:#11ed74;}'),
    );

    render(<BigButton>Click</BigButton>);
    jest.runAllTimers();

    // console.log(host.innerHTML);
    // console.log(document.head.innerHTML);

    expect(host.innerHTML).toBe('<button class="dk-cffbgh dk-eifded">Click</button>');
    expect(document.head.innerHTML).toBe(
      style('.dk-fedjjc{font-size:1rem;}.dk-eifded{width:100%;background-color:#11ed74;}.dk-cffbgh{font-size:2rem;}'),
    );
  });
});
