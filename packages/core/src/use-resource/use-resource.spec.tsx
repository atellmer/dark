/** @jsx h */
import { createBrowserEnv, sleep } from '@test-utils';

import { h } from '../element';
import { component } from '../component';
import { useResource } from './use-resource';

jest.spyOn(console, 'error').mockImplementation(() => {});

let { render } = createBrowserEnv();

beforeEach(() => {
  jest.useRealTimers();
  ({ render } = createBrowserEnv());
});

const fetchData = async (x: number) => {
  await sleep(10);
  return x * 10;
};
const fetchError = async () => {
  await sleep(10);
  throw new Error('oops!');
};

describe('@core/use-resource', () => {
  test('can resolve an async resource correctly', async () => {
    const spy = jest.fn();
    const App = component(() => {
      const { loading, data, error } = useResource(() => fetchData(1));

      spy([loading, data, error]);

      return null;
    });

    render(<App />);
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
  });

  test('can resolve an async resource with error correctly', async () => {
    const spy = jest.fn();
    const App = component(() => {
      const { loading, data, error } = useResource(() => fetchError());

      spy([loading, data, error]);

      return null;
    });

    render(<App />);
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, null, 'Error: oops!']);
  });

  test('can refetch an async resource with deps correctly', async () => {
    const spy = jest.fn();
    const App = component<{ id: number }>(({ id }) => {
      const { loading, data, error } = useResource(() => fetchData(id), [id]);

      spy([loading, data, error]);

      return null;
    });

    render(<App id={1} />);
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
    spy.mockClear();

    render(<App id={2} />);
    await sleep(10);
    expect(spy).toHaveBeenCalledWith([true, 10, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 20, null]);
    spy.mockClear();

    render(<App id={3} />);
    await sleep(10);
    expect(spy).toHaveBeenCalledWith([true, 20, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 30, null]);
  });
});
