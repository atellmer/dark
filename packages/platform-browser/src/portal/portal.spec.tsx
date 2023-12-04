/** @jsx h */
import { h, component } from '@dark-engine/core';

import { dom, createBrowserEnv } from '@test-utils';
import { createPortal } from './portal';

let { render } = createBrowserEnv();
let portalOne: HTMLElement = null;
let portalTwo: HTMLElement = null;
let portalThree: HTMLElement = null;

beforeEach(() => {
  ({ render } = createBrowserEnv());
  portalOne = document.createElement('div');
  portalTwo = document.createElement('div');
  portalThree = document.createElement('div');
});

describe('[createPortal]', () => {
  test('renders correctly', () => {
    const value = 'hello from portal';
    const content = (value: string) => dom`
      <div>${value}</div>
    `;
    const App = component(() => {
      return [<div>app</div>, createPortal(<div>{value}</div>, portalOne)];
    });

    render(App());
    expect(portalOne.innerHTML).toBe(content(value));
  });

  test('can unmount portal', () => {
    type AppProps = { isOpen: boolean };
    const value = 'hello from portal';
    const content = (value: string) => dom`
      <div>${value}</div>
    `;
    const App = component<AppProps>(({ isOpen }) => {
      return [<div>header</div>, isOpen && createPortal(<div>{value}</div>, portalOne), <div>footer</div>];
    });

    render(App({ isOpen: true }));
    expect(portalOne.innerHTML).toBe(content(value));

    render(App({ isOpen: false }));
    expect(portalOne.innerHTML).toBe('');

    render(App({ isOpen: true }));
    expect(portalOne.innerHTML).toBe(content(value));

    render(App({ isOpen: false }));
    expect(portalOne.innerHTML).toBe('');
  });

  test('can mount nested portals', () => {
    const content = (value: string) => dom`
      <div>${value}</div>
    `;

    const App = component(() => {
      return [
        <div>header</div>,
        createPortal(
          [
            <div>portal 1</div>,
            createPortal([<div>portal 2</div>, createPortal([<div>portal 3</div>], portalThree)], portalTwo),
          ],
          portalOne,
        ),
        <div>footer</div>,
      ];
    });

    render(App());
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));
  });

  test('can unmount nested portals', () => {
    type AppProps = { isOpen: boolean };
    const content = (value: string) => dom`
      <div>${value}</div>
    `;

    const App = component<AppProps>(({ isOpen }) => {
      return [
        <div>header</div>,
        isOpen &&
          createPortal(
            [
              <div>portal 1</div>,
              createPortal([<div>portal 2</div>, createPortal([<div>portal 3</div>], portalThree)], portalTwo),
            ],
            portalOne,
          ),
        <div>footer</div>,
      ];
    });

    render(App({ isOpen: true }));
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));

    render(App({ isOpen: false }));
    expect(portalOne.innerHTML).toBe('');
    expect(portalTwo.innerHTML).toBe('');
    expect(portalThree.innerHTML).toBe('');

    render(App({ isOpen: true }));
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));

    render(App({ isOpen: false }));
    expect(portalOne.innerHTML).toBe('');
    expect(portalTwo.innerHTML).toBe('');
    expect(portalThree.innerHTML).toBe('');
  });
});
