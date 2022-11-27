/** @jsx h */
import { dom, createEmptyCommentString } from '@test-utils';
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { lazy } from './lazy';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[lazy]', () => {
  test('lazy loads component', done => {
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

    const App = createComponent(() => {
      return <LazyComponent />;
    });

    render(App(), host);
    expect(host.innerHTML).toBe(createEmptyCommentString());
    jest.runAllTimers();
  });
});
