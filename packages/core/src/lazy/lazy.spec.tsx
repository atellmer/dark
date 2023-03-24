/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom, createReplacerString } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { lazy } from './lazy';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[lazy]', () => {
  test('loads component correctly', done => {
    const LazyComponent = lazy(
      () => import('./lazy-component'),
      () => {
        expect(host.innerHTML).toBe(content());

        render(App(), host);
        expect(host.innerHTML).toBe(content());
        done();
      },
    );

    const content = () => dom`
      <div>lazy</div>
    `;

    const App = component(() => <LazyComponent />);

    render(App(), host);
    expect(host.innerHTML).toBe(createReplacerString());
    jest.runAllTimers();
  });
});
