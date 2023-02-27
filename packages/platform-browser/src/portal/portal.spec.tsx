/** @jsx h */
import { h, createComponent } from '@dark-engine/core';

import { dom } from '@test-utils';
import { render } from '../render';
import { createPortal } from './portal';

let host: HTMLElement = null;
let portal: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
  portal = document.createElement('div');
});

describe('[createPortal]', () => {
  test('renders correctly', () => {
    const value = 'hello from portal';

    const content = (value: string) => {
      return dom`
      <div>${value}</div>
    `;
    };

    const App = createComponent(() => {
      return [<div>app</div>, createPortal(<div>{value}</div>, portal)];
    });

    render(App(), host);
    expect(portal.innerHTML).toBe(content(value));
  });

  test('can unmount portal', () => {
    type AppProps = {
      isOpen: boolean;
    };
    const value = 'hello from portal';
    const content = (value: string) => dom`
      <div>${value}</div>
    `;
    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const App = createComponent<AppProps>(({ isOpen }) => {
      return [<div>header</div>, isOpen && createPortal(<div>{value}</div>, portal), <div>footer</div>];
    });

    render$({ isOpen: true });
    expect(portal.innerHTML).toBe(content(value));

    render$({ isOpen: false });
    expect(portal.innerHTML).toBe('');

    render$({ isOpen: true });
    expect(portal.innerHTML).toBe(content(value));

    render$({ isOpen: false });
    expect(portal.innerHTML).toBe('');
  });

  test('can mount nested portals', () => {
    const portalOne = document.createElement('div');
    const portalTwo = document.createElement('div');
    const portalThree = document.createElement('div');

    const content = (value: string) => dom`
      <div>${value}</div>
    `;

    const App = createComponent(() => {
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

    render(App(), host);
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));
  });

  test('can unmount nested portals', () => {
    type AppProps = {
      isOpen: boolean;
    };
    const portalOne = document.createElement('div');
    const portalTwo = document.createElement('div');
    const portalThree = document.createElement('div');

    const content = (value: string) => dom`
      <div>${value}</div>
    `;

    const render$ = (props: AppProps) => {
      render(App(props), host);
    };

    const App = createComponent<AppProps>(({ isOpen }) => {
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

    render$({ isOpen: true });
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));

    render$({ isOpen: false });
    expect(portalOne.innerHTML).toBe('');
    expect(portalTwo.innerHTML).toBe('');
    expect(portalThree.innerHTML).toBe('');

    render$({ isOpen: true });
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));

    render$({ isOpen: false });
    expect(portalOne.innerHTML).toBe('');
    expect(portalTwo.innerHTML).toBe('');
    expect(portalThree.innerHTML).toBe('');
  });
});
