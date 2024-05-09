import { render } from '@dark-engine/platform-browser';

import { component } from '../component';
import { type MutableRef, useRef } from '../ref';
import { useLayoutEffect } from '../use-layout-effect';
import { useImperativeHandle } from './use-imperative-handle';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/use-imperative-handle', () => {
  test('mutates ref object correctly', () => {
    const mockFn = jest.fn();

    type MyRef = { run: () => void };

    let ref: MutableRef<MyRef> = null;

    const Child = component<{ ref?: MutableRef<MyRef> }>(({ ref }) => {
      useImperativeHandle(ref, () => ({
        run: mockFn,
      }));

      return null;
    });

    const App = component(() => {
      ref = useRef<MyRef>(null);

      useLayoutEffect(() => ref.current.run());

      return <Child ref={ref} />;
    });

    render(App(), host);
    expect(mockFn).toHaveBeenCalled();
  });
});
