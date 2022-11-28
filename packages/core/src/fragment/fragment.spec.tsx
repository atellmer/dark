/** @jsx h */
import { dom } from '@test-utils';
import { render } from '@dark-engine/platform-browser';
import { h } from '../element';
import { createComponent } from '../component';
import { Fragment } from './fragment';

let host: HTMLElement = null;

beforeEach(() => {
  host = document.createElement('div');
});

describe('[Fragment]', () => {
  test('renders children correctly', () => {
    const content = () => dom`
      <div>1</div>
      <div>2</div>
      <div>3</div>
    `;
    const App = createComponent(() => {
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
