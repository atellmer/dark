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
      ${idx === 0 ? `<normal-tab-1></normal-tab-1>${replacer}${replacer}` : ''}
      ${idx === 1 ? `${replacer}<normal-tab-2></normal-tab-2>${replacer}` : ''}
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
    const NormalTab1 = component(() => <normal-tab-1></normal-tab-1>);
    const NormalTab2 = component(() => <normal-tab-2></normal-tab-2>);
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
        ${idx === 0 ? `<normal-tab-1></normal-tab-1>${replacer}${replacer}` : ''}
        ${idx === 1 ? `${replacer}<normal-tab-2></normal-tab-2>${replacer}` : ''}
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
    const NormalTab1 = component(() => <normal-tab-1></normal-tab-1>);
    const NormalTab2 = component(() => <normal-tab-2></normal-tab-2>);
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

  test('cancels the transition after the same updates', async () => {
    const size = 20;
    const content = (marker: string) => dom`
      <div>${marker}:${Array(size)
      .fill(null)
      .map(() => replacer)
      .join('')}
      </div>
    `;
    let setMarker: (x: string) => void = null;
    const Slow = memo(
      component<{ marker: string }>(({ marker }) => {
        const items = [];

        for (let i = 0; i < size; i++) {
          items.push(<SlowItem key={i} />);
        }

        return (
          <div>
            {marker}:{items}
          </div>
        );
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
      const [marker, _setMarker] = useState('a');

      setMarker = _setMarker;

      return <Slow marker={marker} />;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content('a'));

    startTransition(() => setMarker('b'));
    expect(host.innerHTML).toBe(content('a'));

    await sleep(1);
    expect(host.innerHTML).toBe(content('a'));

    startTransition(() => setMarker('c'));
    await sleep(1);
    expect(host.innerHTML).toBe(content('a'));

    startTransition(() => setMarker('d'));
    await sleep(1);
    expect(host.innerHTML).toBe(content('a'));

    await sleep(200);
    expect(host.innerHTML).toBe(content('d'));
  });

  test('cancels the transition after child updates', async () => {
    const size = 20;
    const content = (marker1: string, marker2: string) => dom`
      <div>${marker1}:${marker2}:${Array(size)
      .fill(null)
      .map(() => replacer)
      .join('')}
      </div>
    `;
    let setMarker1: (x: string) => void = null;
    let setMarker2: (x: string) => void = null;
    const Slow = memo(
      component<{ marker: string }>(({ marker }) => {
        const [$marker, _setMarker] = useState('[a]');
        const items = [];

        setMarker2 = _setMarker;

        for (let i = 0; i < size; i++) {
          items.push(<SlowItem key={i} />);
        }

        return (
          <div>
            {marker}:{$marker}:{items}
          </div>
        );
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
      const [marker, _setMarker] = useState('a');

      setMarker1 = _setMarker;

      return <Slow marker={marker} />;
    });

    render(<App />);
    expect(host.innerHTML).toBe(content('a', '[a]'));

    startTransition(() => setMarker1('b'));
    expect(host.innerHTML).toBe(content('a', '[a]'));

    await sleep(1);
    expect(host.innerHTML).toBe(content('a', '[a]'));

    setMarker2('[b]');
    await sleep(100);
    expect(host.innerHTML).toBe(content('a', '[b]'));
  });
});
