/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { createComponent } from '../component';
import { lazy } from '../lazy';
import { Suspense } from './suspense';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[Suspense]', () => {
  test('shows fallback correctly', done => {
    const LazyComponent = lazy(
      () => import('../lazy/lazy-component'),
      () => {
        expect(host.innerHTML).toBe(content());

        render(App(), host);
        expect(host.innerHTML).toBe(content());
        done();
      },
    );

    const loaderContent = () => dom`
      <div>loading...</div>
    `;

    const content = () => dom`
      <div>lazy</div>
    `;

    const App = createComponent(() => {
      return (
        <Suspense fallback={<div>loading...</div>}>
          <LazyComponent />
        </Suspense>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(loaderContent());
    jest.runAllTimers();
  });
});
