/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom, createReplacerString } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { type LazyModule, lazy } from '../lazy';
import { Suspense } from './suspense';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[Suspense]', () => {
  test('shows fallback correctly', done => {
    const LazyComponent = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          resolve({ default: component(() => <div>lazy</div>) });
        }),
      () => {
        expect(host.innerHTML).toBe(content());
        render(App(), host);
        expect(host.innerHTML).toBe(content());
        done();
      },
    );

    const loaderContent = () => dom`
      ${createReplacerString()}<div>loading...</div>
    `;

    const content = () => dom`
      <div>lazy</div>
    `;

    const App = component(() => {
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
