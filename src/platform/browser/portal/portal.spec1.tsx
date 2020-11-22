/** @jsx h */
import { waitNextIdle, dom, createEmptyCommentString } from '@test-utils';
import { createElement as h } from '@core/element/element';
import { createComponent } from '@core/component/component';
import { useMemo } from '@core/use-memo';
import { render } from '../render';
import { createPortal } from './portal';


let host: HTMLElement = null;
let portal: HTMLElement = null;
let nextId = 0;

const generateItems = (count: number) => {
  return Array(count).fill(0).map(x => ({
    id: ++nextId,
    name: nextId.toString(),
  }));
}

beforeEach(() => {
  nextId = 0;
  host = document.createElement('div');
  portal = document.createElement('div');
  document.body.innerHTML = '';
  document.body.appendChild(host);
});

test(`createPortal renders correctly`, () => {
  const value = 'hello from portal';

  const content = (value: string) => {
    return dom`
      <div>${value}</div>
    `
  };
  const compile = () => {
    render(Component(), host);
    waitNextIdle();
  };

  const Component = createComponent(() => {
    return [
      <div>app</div>,
      createPortal(<div>{value}</div>, portal),
    ]
  });

  compile();
  expect(portal.innerHTML).toBe(content(value));
});

test(`createPortal works correctly with conditional rendering`, () => {
  const value = 'hello from portal';

  const content = (value: string) => {
    return dom`
      <div>${value}</div>
    `
  };
  const compile = (props) => {
    render(Component(props), host);
    waitNextIdle();
  };

  const Component = createComponent<{isOpen: boolean}>(({ isOpen }) => {
    return [
      <div>header</div>,
      isOpen && createPortal(<div>{value}</div>, portal),
      <div>footer</div>,
    ]
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
