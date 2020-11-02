/** @jsx createElement */
import { requestIdleCallback } from '@shopify/jest-dom-mocks';

import { createComponent } from '@core/component/component';
import { createElement } from '@core/element/element';
import { useState } from './use-state';
import { render } from '../../platform/browser/render';
import { dom } from '../../../test/utils';


let host: HTMLElement = null;
const fireRenders = () => requestIdleCallback.runIdleCallbacks();

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  host = document.createElement('div');
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) => cb());
});

test('[use-state]: use-state works correctly', () => {
  const content = (count: number) => dom`
    <div>${count}</div>
  `;
  let count;
  let setCount;
  const Component = createComponent(() => {
    [count, setCount] = useState(0);

    return (
      <div>{count}</div>
    );
  });

  render(Component(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(0));
  setCount(count + 1);
  fireRenders();
  expect(host.innerHTML).toBe(content(1));
  setCount(x => x + 1);
  fireRenders();
  expect(host.innerHTML).toBe(content(2));
  setCount(x => x + 1);
  setCount(x => x + 1);
  fireRenders();
  expect(host.innerHTML).toBe(content(4));
});

test('[use-state]: state saves when nodes swapped', () => {
  type Item = {
    id: number;
    count: number;
  };

  const content = (items: Array<Item>) => dom`
    ${items.map(x => {
      return `
        <div>id: ${x.id}, count: ${x.count}</div>
      `
    }).join('')}
  `;

  const items = Array(5).fill(null).map((_, idx) => ({
    id: idx + 1,
    count: 0,
  }));

  let setCounts = [];
  const Counter = createComponent<{id: number}>(({ id }) => {
    const [count, setCount] = useState(0);

    setCounts.push(setCount);

    return (
      <div>id: {id}, count: {count}</div>
    );
  });

  const List = createComponent(() => {
    return items.map(x => {
      return <Counter key={x.id} id={x.id} />
    })
  })

  const swap = () => {
    const temp = items[1];
    items[1] = items[items.length - 2];
    items[items.length - 2] = temp;
  };

  render(List(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));

  setCounts[1](1);
  items[1].count = 1;
  setCounts[items.length - 2](2);
  items[items.length - 2].count = 2;
  fireRenders();
  expect(host.innerHTML).toBe(content(items));
  setCounts = [];
  swap();

  render(List(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));
  setCounts = [];
  swap();

  render(List(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(items));
  setCounts = [];
});
