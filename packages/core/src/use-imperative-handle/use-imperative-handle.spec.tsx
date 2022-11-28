/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { useRef } from '../use-ref';
import { forwardRef, MutableRef } from '../ref';
import { useLayoutEffect } from '../use-layout-effect';
import { useImperativeHandle } from './use-imperative-handle';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-imperative-handle]', () => {
  test('mutates ref object correctly', () => {
    const mockFn = jest.fn();

    type MyRef = { run: () => void };

    let ref: MutableRef<MyRef> = null;

    const Child = forwardRef<{}, MyRef>(
      createComponent((_, ref) => {
        useImperativeHandle(ref as MutableRef<MyRef>, () => ({
          run: mockFn,
        }));

        return null;
      }),
    );

    const App = createComponent(() => {
      ref = useRef<MyRef>(null);

      useLayoutEffect(() => ref.current.run());

      return <Child ref={ref} />;
    });

    render(App(), host);
    expect(mockFn).toHaveBeenCalled();
  });
});
