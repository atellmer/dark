/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { h } from '../element';
import { createComponent } from '../component';
import { useRef } from '../use-ref';
import { forwardRef } from './ref';
import { MutableRef } from './types';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[forward-ref]', () => {
  test('component ref is not available without forwarding', () => {
    let ref: MutableRef = null;

    const Child = createComponent(() => {
      return <div />;
    });

    const App = createComponent(() => {
      ref = useRef(null);

      return <Child ref={ref} />;
    });

    render(App(), host);
    expect(ref.current).toBeFalsy();
  });

  test('can forward ref', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const Child = forwardRef(createComponent((_, ref) => <div ref={ref} />));

    const App = createComponent(() => {
      ref = useRef(null);

      return <Child ref={ref} />;
    });

    render(App(), host);
    expect(ref.current).toBeTruthy();
    expect(ref.current instanceof HTMLDivElement).toBeTruthy();
  });
});
