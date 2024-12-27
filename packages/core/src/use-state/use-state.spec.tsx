import { createBrowserEnv, dom, setInputValue, sleep } from '@test-utils';
import { type SyntheticEvent } from '@dark-engine/platform-browser';

import { component } from '../component';
import { useState } from './use-state';
import { type MutableRef, useRef } from '../ref';

let { render, host } = createBrowserEnv();

beforeEach(() => {
  ({ render, host } = createBrowserEnv());
});

describe('@core/use-state', () => {
  test('works correctly by default', () => {
    const content = (count: number) => dom`
      <div>${count}</div>
    `;
    let count: number;
    let setCount: (x: number | ((x: number) => number)) => void;
    const App = component(() => {
      [count, setCount] = useState(0);

      return <div>{count}</div>;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    setCount(count + 1);
    expect(host.innerHTML).toBe(content(1));

    setCount(x => x + 1);
    expect(host.innerHTML).toBe(content(2));

    setCount(x => x + 1);
    setCount(x => x + 1);
    expect(host.innerHTML).toBe(content(4));
  });

  test('works correctly when component returns array of elements', () => {
    const content = (count: number) => dom`
      <div>text</div>
      <div>${count}</div>
    `;
    let count: number;
    let setCount: (value: number) => void;
    const App = component(() => {
      [count, setCount] = useState(0);

      return [<div>text</div>, <div>{count}</div>];
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    setCount(count + 1);
    expect(host.innerHTML).toBe(content(1));

    setCount(count + 1);
    expect(host.innerHTML).toBe(content(2));
  });

  test('can save the state when nodes swapped #1', () => {
    type Item = {
      id: number;
      count: number;
    };

    type ItemProps = {
      id: number;
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

    const CounterOne = component<ItemProps>(({ id }) => {
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

    const CounterTwo = component(() => {
      const [count, setCount] = useState(0);

      setCountsTwo.push(setCount);

      return <div>{count}</div>;
    });

    const App = component(() => {
      return items.map(x => {
        return <CounterOne key={x.id} id={x.id} />;
      });
    });

    const swap = () => {
      const temp = items[1];

      items[1] = items[items.length - 2];
      items[items.length - 2] = temp;
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(items));

    setCountsOne[1](1);
    setCountsTwo[1](1);
    items[1].count = 1;
    setCountsOne[items.length - 2](2);
    setCountsTwo[items.length - 2](2);
    items[items.length - 2].count = 2;
    expect(host.innerHTML).toBe(content(items));

    setCountsOne = [];
    setCountsTwo = [];
    swap();
    render(<App />);
    expect(host.innerHTML).toBe(content(items));

    setCountsOne = [];
    setCountsTwo = [];
    swap();
    render(<App />);
    expect(host.innerHTML).toBe(content(items));
  });

  test('can save the state when nodes swapped #2', () => {
    type Item = {
      id: number;
      count: number;
    };

    type ItemProps = {
      id: number;
    };

    const content = (items: Array<Item>) => dom`
    ${items
      .map(x => {
        return `
          <div>id: ${x.id}, count: ${x.count}</div>
        `;
      })
      .join('')}
  `;

    const items: Array<Item> = Array(10)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        count: 0,
      }));

    let setCounts: Array<(value: number) => void> = [];

    const Item = component<ItemProps>(({ id }) => {
      const [count, setCount] = useState(0);

      setCounts.push(setCount);

      return (
        <div>
          id: {id}, count: {count}
        </div>
      );
    });

    const App = component(() => {
      return items.map(x => <Item key={x.id} id={x.id} />);
    });

    const swap = () => {
      const temp = items[1];

      items[1] = items[items.length - 2];
      items[items.length - 2] = temp;
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(items));

    setCounts[1](1);
    setCounts[items.length - 2](2);
    items[1].count = 1;
    items[items.length - 2].count = 2;
    swap();
    setCounts = [];
    render(<App />);
    expect(host.innerHTML).toBe(content(items));

    setCounts[1](20);
    setCounts[items.length - 2](30);
    items[1].count = 20;
    items[items.length - 2].count = 30;
    swap();
    setCounts = [];
    render(<App />);
    expect(host.innerHTML).toBe(content(items));
  });

  test('can save the state when nodes swapped #3', () => {
    type Item = {
      id: number;
      count: number;
    };

    type ItemProps = {
      id: number;
    };

    const content = (items: Array<Item>) => dom`
    ${items
      .map(x => {
        return `
          <div>
            <div>
              <p>
                <div>id: ${x.id}, count: ${x.count}</div>
              </p>
            </div>
          </div>
        `;
      })
      .join('')}
  `;

    const items: Array<Item> = Array(10)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        count: 0,
      }));

    let setCounts: Array<(value: number) => void> = [];

    const Item = component<ItemProps>(({ id }) => {
      const [count, setCount] = useState(0);

      setCounts.push(setCount);

      return (
        <div>
          id: {id}, count: {count}
        </div>
      );
    });

    const App = component(() => {
      return items.map(x => {
        return (
          <div key={x.id}>
            <div>
              <p>
                <Item id={x.id} />
              </p>
            </div>
          </div>
        );
      });
    });

    const swap = () => {
      const temp = items[1];

      items[1] = items[items.length - 2];
      items[items.length - 2] = temp;
    };

    render(<App />);
    expect(host.innerHTML).toBe(content(items));

    setCounts[1](1);
    setCounts[items.length - 2](2);
    items[1].count = 1;
    items[items.length - 2].count = 2;
    swap();
    setCounts = [];
    render(<App />);
    expect(host.innerHTML).toBe(content(items));

    setCounts[1](20);
    setCounts[items.length - 2](30);
    items[1].count = 20;
    items[items.length - 2].count = 30;
    swap();
    setCounts = [];
    render(<App />);
    expect(host.innerHTML).toBe(content(items));
  });

  test('nodes removed correctly after set state when rendering a different number of elements', () => {
    const content = (hasFlag: boolean) =>
      hasFlag
        ? dom`<div>flag</div>`
        : dom`
            <div>1</div>
            <div>2</div>
            <div>3</div>
          `;
    let flag: boolean;
    let setFlag: (value: boolean) => void;
    const App = component(() => {
      [flag, setFlag] = useState(false);

      if (flag) return <div>flag</div>;

      return [<div>1</div>, <div>2</div>, <div>3</div>];
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(false));

    setFlag(true);
    expect(host.innerHTML).toBe(content(true));

    setFlag(false);
    expect(host.innerHTML).toBe(content(false));
  });

  test('forces direct update for input value', async () => {
    // https://github.com/atellmer/dark/issues/82
    let inputRef: MutableRef<HTMLInputElement> = null;
    const App = component(() => {
      inputRef = useRef<HTMLInputElement>(null);
      const [value, setValue] = useState('0');
      const handleSetValue = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => {
        const value = e.target.value;
        const $value = value.replace(/\D/g, '');

        setValue($value);

        return $value;
      };

      return <input ref={inputRef} value={value} onInput={handleSetValue} />;
    });

    render(<App />);
    const input = inputRef.current;

    setInputValue(input, '0rrrr');
    await sleep(20);
    expect(input.value).toBe('0');

    setInputValue(input, '0abc');
    await sleep(20);
    expect(input.value).toBe('0');

    setInputValue(input, '123abc');
    await sleep(20);
    expect(input.value).toBe('123');
  });
});
