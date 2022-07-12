/** @jsx createElement */
import { dom, waitNextIdle } from '@test-utils';
import { render } from '@dark-engine/platform-browser/render';
import { createComponent } from '../component/component';
import { createElement } from '../element/element';
import { useState } from './use-state';

let host: HTMLElement = null;

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

    return <div>{count}</div>;
  });

  render(Component(), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(0));
  setCount(count + 1);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(1));
  setCount(x => x + 1);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(2));
  setCount(x => x + 1);
  waitNextIdle();
  setCount(x => x + 1);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(4));
});

test('[use-state]: use-state works correctly when component returns array of elements', () => {
  const content = (count: number) => dom`
    <div>text</div>
    <div>${count}</div>
  `;
  let count;
  let setCount;
  const Component = createComponent(() => {
    [count, setCount] = useState(0);

    return [<div>text</div>, <div>{count}</div>];
  });

  render(Component(), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(0));
  setCount(count + 1);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(1));
  setCount(count + 1);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(2));
});

test('[use-state]: state saves when nodes swapped', () => {
  type Item = {
    id: number;
    count: number;
  };

  const content = (items: Array<Item>) => dom`
    ${items
      .map(x => {
        return `
        <div>
          <div>id: ${x.id}, count: ${x.count}</div>
          <div>${x.count}</div>
        </div>
      `;
      })
      .join('')}
  `;

  const items = Array(5)
    .fill(null)
    .map((_, idx) => ({
      id: idx + 1,
      count: 0,
    }));

  let setCountsOne = [];
  let setCountsTwo = [];

  const CounterOne = createComponent<{ id: number }>(({ id }) => {
    const [count, setCount] = useState(0);

    setCountsOne.push(setCount);

    return (
      <div>
        <div>
          id: {id}, count: {count}
        </div>
        <CounterTwo />
      </div>
    );
  });

  const CounterTwo = createComponent(() => {
    const [count, setCount] = useState(0);

    setCountsTwo.push(setCount);

    return <div>{count}</div>;
  });

  const List = createComponent(() => {
    return items.map(x => {
      return <CounterOne key={x.id} id={x.id} />;
    });
  });

  const swap = () => {
    const temp = items[1];
    items[1] = items[items.length - 2];
    items[items.length - 2] = temp;
  };

  render(List(), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(items));

  setCountsOne[1](1);
  waitNextIdle();
  setCountsTwo[1](1);
  waitNextIdle();
  items[1].count = 1;
  setCountsOne[items.length - 2](2);
  waitNextIdle();
  setCountsTwo[items.length - 2](2);
  items[items.length - 2].count = 2;
  waitNextIdle();
  expect(host.innerHTML).toBe(content(items));
  setCountsOne = [];
  setCountsTwo = [];
  swap();

  render(List(), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(items));
  setCountsOne = [];
  setCountsTwo = [];
  swap();

  render(List(), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(items));
  setCountsOne = [];
  setCountsTwo = [];
});

test('[use-state]: state saves after conditional rendering', () => {
  const content = (count: number) => dom`
    <div>count: ${count}</div>
  `;

  let count;
  let setCount;

  const Counter = createComponent(() => {
    [count, setCount] = useState(0);

    return [<div>count: {count}</div>];
  });

  const App = createComponent<{ isOpen: boolean }>(({ isOpen }) => {
    return [isOpen && <Counter />];
  });

  render(App({ isOpen: true }), host);
  waitNextIdle();
  setCount(1);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(1));
  render(App({ isOpen: false }), host);
  waitNextIdle();
  expect(host.innerHTML).toBe('');
  render(App({ isOpen: true }), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(1));
});

test('[use-state]: nodes remove correctly after use-state when rendering a different number of elements', () => {
  const content = (hasFlag: boolean) =>
    hasFlag
      ? dom`<div>flag</div>`
      : dom`
    <div>1</div>
    <div>2</div>
    <div>3</div>
  `;
  let hasFlag;
  let setHasFlag;
  const Component = createComponent(() => {
    [hasFlag, setHasFlag] = useState(false);

    if (hasFlag) return <div>flag</div>;

    return [<div>1</div>, <div>2</div>, <div>3</div>];
  });

  render(Component(), host);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(false));
  setHasFlag(true);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(true));
  setHasFlag(false);
  waitNextIdle();
  expect(host.innerHTML).toBe(content(false));
});
