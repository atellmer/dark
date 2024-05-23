import { type DarkElement, component } from '@dark-engine/core';
import { type DarkJSX } from '@dark-engine/platform-browser';
import { createBrowserEnv, createBrowserHydrateEnv, wrapWithStyledTag as style } from '@test-utils';

import { setupGlobal, styled, css, detectIsStyled } from './styled';

let { host, render } = createBrowserEnv();
const { head } = document;

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  setupGlobal();
});

describe('@styled/styled', () => {
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

    expect(host.innerHTML).toBe('<div class="dk-bccjif"></div>');
    expect(head.innerHTML).toBe(style('.dk-bccjif{background-color:aqua;color:black;}'));
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

    expect(host.innerHTML).toBe('<div class="dk-bcjdcc"></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-cbcbei"><span class="item">content</span></div>');
    expect(head.innerHTML).toBe(style('.dk-cbcbei{background-color:aqua;color:black;}.dk-cbcbei .item{color:red;}'));
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

    expect(host.innerHTML).toBe('<div class="dk-bgdcea"></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-bagcdh"><span class="item">content</span></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-gfaebb"><button class="dk-jbdicb">Click me</button></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-caagaf"><button class="dk-jbdicb">Click me</button></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb"></div>');
    expect(head.innerHTML).toBe(style('.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}'));

    render(<Box $backgroudColor='blue' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bicagj"></div>');
    expect(head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bicagj{background-color:blue;}'),
    );

    render(<Box $backgroudColor='green' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bhbbdd"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bicagj{background-color:blue;}.dk-bhbbdd{background-color:green;}',
      ),
    );

    render(<Box $backgroudColor='red' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb"></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb dk-bfiehd"></div>');
    expect(head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bfiehd{border:1px solid red;}'),
    );

    render(<Box $color='#222' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-iiehgg dk-bfbcdd"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bfiehd{border:1px solid red;}.dk-iiehgg{background-color:#222;}.dk-bfbcdd{border:1px solid #222;}',
      ),
    );

    render(<Box $color='red' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb dk-bfiehd"></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bfiehd"></div>');
    expect(head.innerHTML).toBe(style('.dk-igjghg{width:100px;height:100px;}.dk-bfiehd{border:1px solid red;}'));
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

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-egbggh"></div>');
    expect(head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}'),
    );

    render(<Box $color='green ' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-eehgaf"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}.dk-eehgaf{background-color:green;border:1px solid green;}',
      ),
    );

    render(<Box $color='red' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-egbggh"></div>');
    expect(head.innerHTML).toBe(
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

    expect(host.innerHTML).toBe('<div class="dk-cagiea dk-igjghg dk-egbggh"></div>');
    expect(head.innerHTML).toBe(
      style('.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}'),
    );

    render(<Box $color='orange' />);

    expect(host.innerHTML).toBe('<div class="dk-cagiea dk-igjghg dk-biaaih"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-egbggh{background-color:red;border:1px solid red;}.dk-biaaih{background-color:orange;border:1px solid orange;}',
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

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bejacb dk-bgciah"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bgciah{border:1px solid orange;}',
      ),
    );

    render(<Box $backgroundColor='yellow' $borderColor='orange' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-dhehda dk-bgciah"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bgciah{border:1px solid orange;}.dk-dhehda{background-color:yellow;}',
      ),
    );

    render(<Box $backgroundColor='orange' $borderColor='yellow' />);

    expect(host.innerHTML).toBe('<div class="dk-igjghg dk-bgdgjb dk-gccdce"></div>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-igjghg{width:100px;height:100px;}.dk-bejacb{background-color:red;}.dk-bgciah{border:1px solid orange;}.dk-dhehda{background-color:yellow;}.dk-bgdgjb{background-color:orange;}.dk-gccdce{border:1px solid yellow;}',
      ),
    );
  });

  test('can extend styles correctly', () => {
    const Button = styled('button')`
      width: 100%;
      background-color: #11ed74;
      font-size: 1.5rem;
    `;
    const SmallButton = styled(Button)`
      font-size: 1rem;
    `;
    const BigButton = styled(Button)`
      font-size: 2rem;
    `;

    render(<SmallButton>Click</SmallButton>);

    expect(host.innerHTML).toBe('<button class="dk-caeefb">Click</button>');
    expect(head.innerHTML).toBe(
      style('.dk-caeefb{width:100%;background-color:#11ed74;font-size:1.5rem;font-size:1rem;}'),
    );

    render(<BigButton>Click</BigButton>);

    expect(host.innerHTML).toBe('<button class="dk-hfgadd">Click</button>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-caeefb{width:100%;background-color:#11ed74;font-size:1.5rem;font-size:1rem;}.dk-hfgadd{width:100%;background-color:#11ed74;font-size:1.5rem;font-size:2rem;}',
      ),
    );
  });

  test('renders a styled component with an attribute config correctly', () => {
    const Input = styled('input').attrs(p => ({ ...p, type: 'text' }))`
      width: 100%;
      border: 1px solid aliceblue;
    `;

    render(<Input />);

    expect(host.innerHTML).toBe('<input type="text" class="dk-bjgffe">');
    expect(head.innerHTML).toBe(style('.dk-bjgffe{width:100%;border:1px solid aliceblue;}'));
  });

  test('renders a styled component with extended attribute config correctly #1', () => {
    const Input = styled('input').attrs(p => ({ ...p, type: 'text' }))`
      width: 100%;
      border: 1px solid aliceblue;
    `;
    const PasswordInput = styled(Input).attrs(p => ({ ...p, type: 'password' }))``;

    render(<PasswordInput />);

    expect(host.innerHTML).toBe('<input type="password" class="dk-bjgffe">');
    expect(head.innerHTML).toBe(style('.dk-bjgffe{width:100%;border:1px solid aliceblue;}'));
  });

  test('renders a styled component with extended attribute config correctly #2', () => {
    const Input = styled('input').attrs(p => ({ ...p, type: 'text' }))`
      width: 100%;
      border: 1px solid aliceblue;
    `;
    const PasswordInput = styled(Input).attrs(p => ({ ...p, type: 'password' }))``;
    const GreenPasswordInput = styled(PasswordInput).attrs(p => ({ ...p, 'data-color': 'green' }))`
      border-color: green;
    `;

    render(<GreenPasswordInput />);

    expect(host.innerHTML).toBe('<input type="password" data-color="green" class="dk-ccfddd">');
    expect(head.innerHTML).toBe(style('.dk-ccfddd{width:100%;border:1px solid aliceblue;border-color:green;}'));
  });

  test('can replace an instance with an another tag correctly', () => {
    const Button = styled('button')`
      width: 100%;
      background-color: #11ed74;
      font-size: 1.5rem;
    `;
    const props = { href: 'www.example.com' };

    render(
      <Button {...props} as='a'>
        Click
      </Button>,
    );

    expect(host.innerHTML).toBe('<a href="www.example.com" class="dk-bgehcj">Click</a>');
    expect(head.innerHTML).toBe(style('.dk-bgehcj{width:100%;background-color:#11ed74;font-size:1.5rem;}'));
  });

  test('can replace an instance with an another component correctly', () => {
    const Button = styled('button')`
      width: 100%;
      background-color: #11ed74;
      font-size: 1.5rem;
    `;
    const Item = component<{ slot: DarkElement }>(({ slot, ...rest }) => (
      <div {...rest}>
        <span>{slot}</span>
      </div>
    ));

    render(<Button as={Item}>Click</Button>);

    expect(host.innerHTML).toBe('<div class="dk-bgehcj"><span>Click</span></div>');
    expect(head.innerHTML).toBe(style('.dk-bgehcj{width:100%;background-color:#11ed74;font-size:1.5rem;}'));
  });

  test('can replace an instance with an another styled component correctly', () => {
    const Button = styled('button')`
      width: 100%;
      background-color: #11ed74;
      font-size: 1.5rem;
    `;
    const StyledItem = styled('div')`
      border: 2px solid purple;
    `;

    render(<Button as={StyledItem}>Click</Button>);

    expect(host.innerHTML).toBe('<div class="dk-bgehcj dk-bfdfeb">Click</div>');
    expect(head.innerHTML).toBe(
      style('.dk-bgehcj{width:100%;background-color:#11ed74;font-size:1.5rem;}.dk-bfdfeb{border:2px solid purple;}'),
    );
  });

  test('can replace an instance with an another extended styled component correctly', () => {
    const Button = styled('button')`
      width: 100%;
      background-color: #11ed74;
      font-size: 1.5rem;
    `;
    const BorderedButton = styled(Button)`
      border: 2px solid purple;
    `;

    render(<Button as={BorderedButton}>Click</Button>);

    expect(host.innerHTML).toBe('<button class="dk-bgehcj dk-ihjajd">Click</button>');
    expect(head.innerHTML).toBe(
      style(
        '.dk-bgehcj{width:100%;background-color:#11ed74;font-size:1.5rem;}.dk-ihjajd{width:100%;background-color:#11ed74;font-size:1.5rem;border:2px solid purple;}',
      ),
    );
  });

  test('can replace an instance with whatever correctly', () => {
    const Button = styled('button')`
      width: 100%;
      background-color: #11ed74;
      font-size: 1.5rem;
    `;
    const BorderedButton = styled(Button)`
      border: 2px solid pink;
    `;
    const BigBorderedButton = styled(BorderedButton)`
      font-size: 2rem;
    `;
    const AnotherBorderedButton = styled('button')`
      border: 2px solid yellow;
    `;
    const StyledItem = styled('main')`
      border: 2px solid purple;
    `;
    const Item = component<{ slot: DarkElement }>(({ slot, ...rest }) => <div {...rest}>{slot}</div>);

    render(
      <>
        <Button as='a'>Click</Button>
        <Button as={BorderedButton}>Click</Button>
        <Button as={BigBorderedButton}>Click</Button>
        <Button as={AnotherBorderedButton}>Click</Button>
        <Button as={StyledItem}>Click</Button>
        <Button as={Item}>Click</Button>
        <Button>Click</Button>
      </>,
    );

    expect(host.innerHTML).toBe(
      '<a class="dk-bgehcj">Click</a><button class="dk-bgehcj dk-gbfaed">Click</button><button class="dk-bgehcj dk-cgddii">Click</button><button class="dk-bgehcj dk-bgcgba">Click</button><main class="dk-bgehcj dk-bfdfeb">Click</main><div class="dk-bgehcj">Click</div><button class="dk-bgehcj">Click</button>',
    );
    expect(head.innerHTML).toBe(
      style(
        '.dk-bgehcj{width:100%;background-color:#11ed74;font-size:1.5rem;}.dk-gbfaed{width:100%;background-color:#11ed74;font-size:1.5rem;border:2px solid pink;}.dk-cgddii{width:100%;background-color:#11ed74;font-size:1.5rem;border:2px solid pink;font-size:2rem;}.dk-bgcgba{border:2px solid yellow;}.dk-bfdfeb{border:2px solid purple;}',
      ),
    );
  });

  test('can replace an instance with whatever and dynamic correctly #1', () => {
    type ButtonProps = {
      $backgroundColor: string;
    };
    const Button = styled<ButtonProps>('button')`
      width: 100%;
      background-color: ${p => p.$backgroundColor};
      font-size: 1.5rem;
    `;
    const BorderedButton = styled(Button)`
      border: 2px solid pink;
    `;
    const BigBorderedButton = styled(BorderedButton)`
      font-size: 2rem;
    `;
    const AnotherBorderedButton = styled('button')`
      border: 2px solid yellow;
    `;
    const StyledItem = styled('main')`
      border: 2px solid purple;
    `;
    const Item = component<{ slot: DarkElement }>(({ slot, ...rest }) => <div {...rest}>{slot}</div>);

    render(
      <>
        <Button as='a' $backgroundColor='red'>
          Click
        </Button>
        <Button as={BorderedButton} $backgroundColor='yellow'>
          Click
        </Button>
        <Button as={BigBorderedButton} $backgroundColor='green'>
          Click
        </Button>
        <Button as={AnotherBorderedButton} $backgroundColor='orange'>
          Click
        </Button>
        <Button as={StyledItem} $backgroundColor='purple'>
          Click
        </Button>
        <Button as={Item} $backgroundColor='pink'>
          Click
        </Button>
        <Button $backgroundColor='blue'>Click</Button>
      </>,
    );

    expect(host.innerHTML).toBe(
      '<a class="dk-jajadj dk-bejacb">Click</a><button class="dk-jajadj dk-dhehda dk-gjadfc">Click</button><button class="dk-jajadj dk-bhbbdd dk-jijccj">Click</button><button class="dk-jajadj dk-bgdgjb dk-bgcgba">Click</button><main class="dk-jajadj dk-jdcdef dk-bfdfeb">Click</main><div class="dk-jajadj dk-eaigha">Click</div><button class="dk-jajadj dk-bicagj">Click</button>',
    );
    expect(head.innerHTML).toBe(
      style(
        '.dk-jajadj{width:100%;font-size:1.5rem;}.dk-bejacb{background-color:red;}.dk-dhehda{background-color:yellow;}.dk-gjadfc{width:100%;font-size:1.5rem;border:2px solid pink;}.dk-bhbbdd{background-color:green;}.dk-jijccj{width:100%;font-size:1.5rem;border:2px solid pink;font-size:2rem;}.dk-bgdgjb{background-color:orange;}.dk-bgcgba{border:2px solid yellow;}.dk-jdcdef{background-color:purple;}.dk-bfdfeb{border:2px solid purple;}.dk-eaigha{background-color:pink;}.dk-bicagj{background-color:blue;}',
      ),
    );
  });

  test('can replace an instance with whatever and dynamic correctly #2', () => {
    type ButtonProps = {
      $backgroundColor: string;
    };
    const Button = styled<ButtonProps>('button')`
      width: 100%;
      background-color: ${p => p.$backgroundColor};
      font-size: 1.5rem;
    `;
    const BorderedButton = styled(Button)`
      border: 2px solid pink;
    `;
    type BigBorderedButtonProps = {
      $borderColor: string;
    };
    const BigBorderedButton = styled<ButtonProps, BigBorderedButtonProps>(BorderedButton)`
      font-size: 2rem;
      border-color: ${p => p.$borderColor};
    `;
    const AnotherBorderedButton = styled('button')`
      border: 2px solid yellow;
    `;
    const StyledItem = styled('main')`
      border: 2px solid purple;
    `;
    const Item = component<{ slot: DarkElement }>(({ slot, ...rest }) => <div {...rest}>{slot}</div>);
    const props = { $borderColor: 'aliceblue' };

    render(
      <>
        <Button as='a' $backgroundColor='red'>
          Click
        </Button>
        <Button as={BorderedButton} $backgroundColor='yellow'>
          Click
        </Button>
        <Button as={BigBorderedButton} $backgroundColor='green' {...props}>
          Click
        </Button>
        <Button as={AnotherBorderedButton} $backgroundColor='orange'>
          Click
        </Button>
        <Button as={StyledItem} $backgroundColor='purple'>
          Click
        </Button>
        <Button as={Item} $backgroundColor='pink'>
          Click
        </Button>
        <Button $backgroundColor='blue'>Click</Button>
      </>,
    );

    expect(host.innerHTML).toBe(
      '<a class="dk-jajadj dk-bejacb">Click</a><button class="dk-jajadj dk-dhehda dk-gjadfc">Click</button><button class="dk-jajadj dk-bhbbdd dk-jijccj dk-cbbfgc">Click</button><button class="dk-jajadj dk-bgdgjb dk-bgcgba">Click</button><main class="dk-jajadj dk-jdcdef dk-bfdfeb">Click</main><div class="dk-jajadj dk-eaigha">Click</div><button class="dk-jajadj dk-bicagj">Click</button>',
    );
    expect(head.innerHTML).toBe(
      style(
        '.dk-jajadj{width:100%;font-size:1.5rem;}.dk-bejacb{background-color:red;}.dk-dhehda{background-color:yellow;}.dk-gjadfc{width:100%;font-size:1.5rem;border:2px solid pink;}.dk-bhbbdd{background-color:green;}.dk-jijccj{width:100%;font-size:1.5rem;border:2px solid pink;font-size:2rem;}.dk-cbbfgc{border-color:aliceblue;}.dk-bgdgjb{background-color:orange;}.dk-bgcgba{border:2px solid yellow;}.dk-jdcdef{background-color:purple;}.dk-bfdfeb{border:2px solid purple;}.dk-eaigha{background-color:pink;}.dk-bicagj{background-color:blue;}',
      ),
    );
  });

  test('contains tag factories', () => {
    expect(typeof styled.div).toBe('function');
    expect(typeof styled.span).toBe('function');
    expect(typeof styled.button).toBe('function');
    expect(typeof styled.form).toBe('function');
    expect(typeof styled.header).toBe('function');
    expect(typeof styled.footer).toBe('function');
    expect(typeof styled.table).toBe('function');

    const Box = styled.div`
      width: 100px;
      height: 100px;
      background-color: #11ed74;
    `;

    render(<Box />);

    expect(host.innerHTML).toBe('<div class="dk-ccaacd"></div>');
    expect(head.innerHTML).toBe(style('.dk-ccaacd{width:100px;height:100px;background-color:#11ed74;}'));
  });

  test('passes the render props function into slot', () => {
    const Root = styled.main`
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 50px minmax(50px, 1fr) 50px;
      height: 100vh;

      &_header {
        background-color: deepskyblue;
        border: 1px solid #fff;
      }

      &_body {
        background-color: limegreen;
        border: 1px solid #fff;
      }

      &_footer {
        background-color: salmon;
        border: 1px solid #fff;
      }
    `;

    render(
      <Root>
        {fn => (
          <>
            <div class={fn('header')} />
            <div class={fn('body')} />
            <div class={fn('footer')} />
          </>
        )}
      </Root>,
    );

    expect(host.innerHTML).toBe(
      '<main class="dk-ifejde"><div class="dk-ifejde_header"></div><div class="dk-ifejde_body"></div><div class="dk-ifejde_footer"></div></main>',
    );
    expect(head.innerHTML).toBe(
      style(
        '.dk-ifejde{display:grid;grid-template-columns:1fr;grid-template-rows:50px minmax(50px, 1fr) 50px;height:100vh;}.dk-ifejde_header{background-color:deepskyblue;border:1px solid #fff;}.dk-ifejde_body{background-color:limegreen;border:1px solid #fff;}.dk-ifejde_footer{background-color:salmon;border:1px solid #fff;}',
      ),
    );
  });

  test(`can call a css function within another a css function's call correctly`, () => {
    // https://github.com/atellmer/dark/issues/63
    const size = (s = 100) => css`
      width: ${s}px;
      height: ${s}px;
    `;
    const hover = () => css`
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: red;
      }
    `;
    const color = (c = '#fff') => css`
      background-color: ${c};
      ${hover()}
    `;
    const Box = styled.div<{ $size: number; $color: string } & DarkJSX.Elements['div']>`
      ${({ $size }) => size($size)}
      ${({ $color }) => color($color)}
    `;

    render(
      <>
        <Box $size={100} $color='green' />
        <Box $size={100} $color='yellow' />
      </>,
    );

    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div class="dk-cagiea dk-igjghg dk-bahfjd"></div><div class="dk-cagiea dk-igjghg dk-jbjabb"></div>"`,
    );
    expect(head.querySelector('style').innerHTML).toMatchInlineSnapshot(
      `".dk-igjghg{width:100px;height:100px;}.dk-bahfjd{background-color:green;transition:background-color 0.2s ease-in-out;}.dk-bahfjd:hover{background-color:red;}.dk-jbjabb{background-color:yellow;transition:background-color 0.2s ease-in-out;}.dk-jbjabb:hover{background-color:red;}"`,
    );
  });

  test(`can hydrate styles without duplicates`, () => {
    // https://github.com/atellmer/dark/issues/63
    const Box1 = styled.div`
      color: red;
    `;
    const Box2 = styled.div`
      color: yellow;
    `;
    const { head, body, hydrate } = createBrowserHydrateEnv({
      headHTML: `<style dark-styled="c">.dk-gahced{color:red;}.dk-cibihf{color:yellow;}</style>`,
      bodyHTML: `<div class="dk-gahced"></div><div class="dk-cibihf"></div>`,
    });

    hydrate(
      <>
        <Box1 />
        <Box2 />
      </>,
    );

    expect(head.innerHTML).toMatchInlineSnapshot(
      `"<style dark-styled="c">.dk-gahced{color:red;}.dk-cibihf{color:yellow;}</style>"`,
    );
    expect(body.innerHTML).toMatchInlineSnapshot(`"<div class="dk-gahced"></div><div class="dk-cibihf"></div>"`);
  });

  test(`can hydrate styles with different platform-specific values`, () => {
    // https://github.com/atellmer/dark/issues/63
    const Box = styled.div`
      inset: 0 15px auto 0; // scrollbar width is 0 on the server and 15 in the browser
    `;
    const { head, body, hydrate } = createBrowserHydrateEnv({
      headHTML: `<style dark-styled="c">.dk-bhhfgb{inset:0 0 auto 0;}</style>`,
      bodyHTML: `<div class="dk-bhhfgb"></div>`,
    });

    hydrate(<Box />);

    expect(head.innerHTML).toMatchInlineSnapshot(
      `"<style dark-styled="c">.dk-bhhfgb{inset:0 0 auto 0;}.dk-baebeb{inset:0 15px auto 0;}</style>"`,
    );
    expect(body.innerHTML).toMatchInlineSnapshot(`"<div class="dk-baebeb"></div>"`);
  });
});
