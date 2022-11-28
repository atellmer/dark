/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useUpdate } from './use-update';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-update]', () => {
  test('can make update', () => {
    const mockFn = jest.fn();
    let update: () => void = null;
    const App = createComponent(() => {
      update = useUpdate();

      mockFn();

      return null;
    });

    render(App(), host);
    expect(mockFn).toBeCalledTimes(1);

    update();
    expect(mockFn).toBeCalledTimes(2);

    update();
    expect(mockFn).toBeCalledTimes(3);
  });

  test('can trigger render only its own component', () => {
    const appFn = jest.fn();
    const childFn = jest.fn();
    let update: () => void = null;

    const Child = createComponent(() => {
      update = useUpdate();

      childFn();

      return null;
    });

    const App = createComponent(() => {
      appFn();

      return <Child />;
    });

    render(App(), host);
    expect(appFn).toBeCalledTimes(1);
    expect(childFn).toBeCalledTimes(1);

    update();
    expect(appFn).toBeCalledTimes(1);
    expect(childFn).toBeCalledTimes(2);

    update();
    expect(appFn).toBeCalledTimes(1);
    expect(childFn).toBeCalledTimes(3);
  });
});
