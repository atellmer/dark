/** @jsx h */
import { dom } from '@test-utils';
import { h, createComponent } from '@dark-engine/core';
import { render } from '../render';
import { createPortal } from './portal';

let host: HTMLElement = null;
let portal: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
  portal = document.createElement('div');
});

describe('[createPortal]', () => {
  test(`createPortal renders correctly`, () => {
    const value = 'hello from portal';

    const content = (value: string) => {
      return dom`
      <div>${value}</div>
    `;
    };
    const compile = () => {
      render(Component(), host);
    };

    const Component = createComponent(() => {
      return [<div>app</div>, createPortal(<div>{value}</div>, portal)];
    });

    compile();
    expect(portal.innerHTML).toBe(content(value));
  });

  test(`createPortal works correctly with conditional rendering`, () => {
    const value = 'hello from portal';

    const content = (value: string) => {
      return dom`
      <div>${value}</div>
    `;
    };
    const compile = props => {
      render(Component(props), host);
    };

    const Component = createComponent<{ isOpen: boolean }>(({ isOpen }) => {
      return [<div>header</div>, isOpen && createPortal(<div>{value}</div>, portal), <div>footer</div>];
    });

    compile({ isOpen: true });
    expect(portal.innerHTML).toBe(content(value));

    compile({ isOpen: false });
    expect(portal.innerHTML).toBe('');

    compile({ isOpen: true });
    expect(portal.innerHTML).toBe(content(value));

    compile({ isOpen: false });
    expect(portal.innerHTML).toBe('');
  });

  test(`any nested portals work correctly`, () => {
    const portalOne = document.createElement('div');
    const portalTwo = document.createElement('div');
    const portalThree = document.createElement('div');

    const content = (value: string) => {
      return dom`
      <div>${value}</div>
    `;
    };
    const compile = () => {
      render(Component(), host);
    };

    const Component = createComponent(() => {
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

    compile();
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));
  });

  test(`any nested portals work correctly with conditional rendering`, () => {
    const portalOne = document.createElement('div');
    const portalTwo = document.createElement('div');
    const portalThree = document.createElement('div');

    const content = (value: string) => {
      return dom`
      <div>${value}</div>
    `;
    };
    const compile = props => {
      render(Component(props), host);
    };

    const Component = createComponent<{ isOpen: boolean }>(({ isOpen }) => {
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

    compile({ isOpen: true });
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));

    compile({ isOpen: false });
    expect(portalOne.innerHTML).toBe('');
    expect(portalTwo.innerHTML).toBe('');
    expect(portalThree.innerHTML).toBe('');

    compile({ isOpen: true });
    expect(portalOne.innerHTML).toBe(content('portal 1'));
    expect(portalTwo.innerHTML).toBe(content('portal 2'));
    expect(portalThree.innerHTML).toBe(content('portal 3'));

    compile({ isOpen: false });
    expect(portalOne.innerHTML).toBe('');
    expect(portalTwo.innerHTML).toBe('');
    expect(portalThree.innerHTML).toBe('');
  });
});
