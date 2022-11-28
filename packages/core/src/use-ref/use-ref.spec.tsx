/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { MutableRef } from '../ref';
import { useRef } from './use-ref';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-ref]', () => {
  test('can store ref correctly', () => {
    let ref: MutableRef<HTMLDivElement> = null;

    const App = createComponent(() => {
      ref = useRef(null);

      return <div ref={ref} />;
    });

    render(App(), host);
    expect(ref.current).toBeTruthy();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
