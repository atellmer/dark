/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { Fragment } from './fragment';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[Fragment]', () => {
  test('can render children correctly', () => {
    const content = () => dom`
      <div>1</div>
      <div>2</div>
      <div>3</div>
    `;
    const App = component(() => {
      return (
        <Fragment>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Fragment>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content());
  });
});
