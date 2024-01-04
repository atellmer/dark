/** @jsx h */
import { createBrowserEnv, dom, replacer, sleep } from '@test-utils';

import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component';
import { useState } from '../use-state';
import { memo } from '../memo';
import { getTime } from '../utils';
import { startTransition, useTransition } from './start-transition';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useRealTimers();
  ({ host, render } = createBrowserEnv());
});

describe('@core/start-transition', () => {
  test('can make a transition via start-transition', async () => {
    const size = 10;
    const content = (idx: number) => dom`
      ${idx === 0 ? `<normal-tab>1</normal-tab>${replacer}${replacer}` : ''}
      ${idx === 1 ? `${replacer}<normal-tab>2</normal-tab>${replacer}` : ''}
      ${
        idx === 2
          ? `${replacer}${replacer}<slow-tab>${Array(size)
              .fill(null)
              .map(() => replacer)
              .join('')}</slow-tab>`
          : ''
      }
    `;
    let setIdx: (x: number) => void = null;
    const NormalTab1 = component(() => <normal-tab>1</normal-tab>);
    const NormalTab2 = component(() => <normal-tab>2</normal-tab>);
    const SlowTab = memo(
      component(() => {
        const items = [];

        for (let i = 0; i < size; i++) {
          items.push(<SlowItem key={i} />);
        }

        return <slow-tab>{items}</slow-tab>;
      }),
    );

    const SlowItem = component(() => {
      const startTime = getTime();

      while (getTime() - startTime < 1) {
        //
      }

      return null;
    });

    const App = component(() => {
      const [idx, _setIdx] = useState(0);

      setIdx = _setIdx;

      return (
        <>
          {idx === 0 && <NormalTab1 />}
          {idx === 1 && <NormalTab2 />}
          {idx === 2 && <SlowTab />}
        </>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    setIdx(1);
    expect(host.innerHTML).toBe(content(1));

    setIdx(2);
    expect(host.innerHTML).toBe(content(2));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    startTransition(() => setIdx(2));
    expect(host.innerHTML).toBe(content(0));

    await sleep(1);
    expect(host.innerHTML).toBe(content(0));

    await sleep(100);
    expect(host.innerHTML).toBe(content(2));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    startTransition(() => setIdx(2));
    expect(host.innerHTML).toBe(content(0));

    await sleep(1);
    expect(host.innerHTML).toBe(content(0));

    setIdx(1);
    await sleep(1);
    expect(host.innerHTML).toBe(content(1));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    setIdx(1);
    expect(host.innerHTML).toBe(content(1));

    setIdx(2);
    expect(host.innerHTML).toBe(content(2));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    startTransition(() => setIdx(2));
    expect(host.innerHTML).toBe(content(0));

    await sleep(1);
    expect(host.innerHTML).toBe(content(0));

    await sleep(100);
    expect(host.innerHTML).toBe(content(2));
  });

  test('can make a transition via use-transition', async () => {
    const size = 10;
    const content = (idx: number, isPending = false) => dom`
      <div class="${isPending ? 'pending' : 'normal'}">
        ${idx === 0 ? `<normal-tab>1</normal-tab>${replacer}${replacer}` : ''}
        ${idx === 1 ? `${replacer}<normal-tab>2</normal-tab>${replacer}` : ''}
        ${
          idx === 2
            ? `${replacer}${replacer}<slow-tab>${Array(size)
                .fill(null)
                .map(() => replacer)
                .join('')}</slow-tab>`
            : ''
        }
      </div>
    `;
    let setIdx: (x: number) => void = null;
    let startTransition: (cb: Function) => void = null;
    const NormalTab1 = component(() => <normal-tab>1</normal-tab>);
    const NormalTab2 = component(() => <normal-tab>2</normal-tab>);
    const SlowTab = memo(
      component(() => {
        const items = [];

        for (let i = 0; i < size; i++) {
          items.push(<SlowItem key={i} />);
        }

        return <slow-tab>{items}</slow-tab>;
      }),
    );

    const SlowItem = component(() => {
      const startTime = getTime();

      while (getTime() - startTime < 1) {
        //
      }

      return null;
    });

    const App = component(() => {
      const [isPending, _startTransition] = useTransition();
      const [idx, _setIdx] = useState(0);

      setIdx = _setIdx;
      startTransition = _startTransition;

      return (
        <div class={isPending ? 'pending' : 'normal'}>
          {idx === 0 && <NormalTab1 />}
          {idx === 1 && <NormalTab2 />}
          {idx === 2 && <SlowTab />}
        </div>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(0));

    setIdx(1);
    expect(host.innerHTML).toBe(content(1));

    setIdx(2);
    expect(host.innerHTML).toBe(content(2));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    startTransition(() => setIdx(2));
    expect(host.innerHTML).toBe(content(0));

    await sleep(1);
    expect(host.innerHTML).toBe(content(0, true));

    await sleep(100);
    expect(host.innerHTML).toBe(content(2));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    startTransition(() => setIdx(2));
    expect(host.innerHTML).toBe(content(0));

    await sleep(1);
    expect(host.innerHTML).toBe(content(0, true));

    setIdx(1);
    await sleep(1);
    expect(host.innerHTML).toBe(content(1));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    setIdx(1);
    expect(host.innerHTML).toBe(content(1));

    setIdx(2);
    expect(host.innerHTML).toBe(content(2));

    setIdx(0);
    expect(host.innerHTML).toBe(content(0));

    startTransition(() => setIdx(2));
    expect(host.innerHTML).toBe(content(0));

    await sleep(1);
    expect(host.innerHTML).toBe(content(0, true));

    await sleep(100);
    expect(host.innerHTML).toBe(content(2));
  });
});
