/** @jsx h */
import { h, createComponent } from '@dark-engine/core';
import { render } from '../render';

let host: HTMLElement = null;

beforeEach(() => {
  host?.parentElement === document.body && document.body.removeChild(host);
  host = document.createElement('div');
  document.body.appendChild(host);
});

const click = (element: Element) => {
  const event = new Event('click', {
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);
};

describe('[events]', () => {
  test('can fire events', () => {
    const mockFn = jest.fn();

    const render$ = () => {
      render(App(), host);
    };

    const App = createComponent(() => {
      const handleClick = () => mockFn();

      return <button onClick={handleClick}>click</button>;
    });

    render$();
    const button = host.querySelector('button');
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);

    click(button);
    expect(mockFn).toHaveBeenCalledTimes(2);

    render$();
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('can remove event listeners when unmount', () => {
    const mockFn = jest.fn();

    const App = createComponent(() => {
      const handleClick = () => mockFn();

      return <button onClick={handleClick}>click</button>;
    });

    render(App(), host);
    const button = host.querySelector('button');
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);

    render(null, host);
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
