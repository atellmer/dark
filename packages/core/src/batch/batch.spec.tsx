/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { createComponent } from '../component';
import { useEffect } from '../use-effect';
import { useUpdate } from '../use-update';
import { batch } from './batch';
import { platform } from '../platform';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
  jest.spyOn(platform, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback): number => {
    return setTimeout(() => cb(0));
  });
});

describe('[batch]', () => {
  test('component renders many times after several updates without batch', () => {
    const mockFn = jest.fn();

    const App = createComponent(() => {
      const update = useUpdate();

      useEffect(() => {
        update();
        update();
        update();
      }, []);

      mockFn();

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(4);
  });

  test('component renders 1 time per batch', () => {
    const mockFn = jest.fn();

    const App = createComponent(() => {
      const update = useUpdate();

      useEffect(() => {
        batch(() => {
          update();
          update();
          update();
        });
      }, []);

      mockFn();

      return null;
    });

    render(App(), host);
    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
