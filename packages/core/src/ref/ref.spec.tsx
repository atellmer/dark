/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { h } from '../element';
import { component } from '../component';
import { type MutableRef, forwardRef, useRef } from './ref';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/ref', () => {
  test('component ref is not available without forwarding', () => {
    let ref: MutableRef = null;

    const Child = component(() => {
      return <div />;
    });

    const App = component(() => {
      ref = useRef(null);

      return <Child ref={ref} />;
    });

    render(App(), host);
    expect(ref.current).toBeFalsy();
  });

  test('can forward ref', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const Child = forwardRef(component((_, ref) => <div ref={ref} />));

    const App = component(() => {
      ref = useRef(null);

      return <Child ref={ref} />;
    });

    render(App(), host);
    expect(ref.current).toBeTruthy();
    expect(ref.current instanceof HTMLDivElement).toBeTruthy();
  });

  test('can store ref correctly', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const App = component(() => {
      ref = useRef(null);

      return <div ref={ref} />;
    });

    render(App(), host);
    expect(ref.current).toBeTruthy();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
