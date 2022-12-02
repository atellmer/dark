/** @jsx h */
import { h, createComponent } from '@dark-engine/core';
import { render } from '../render';

let host: HTMLElement = null;

const addEventListener = document.addEventListener.bind(document);

beforeEach(() => {
  host?.parentElement === document.body && document.body.removeChild(host);
  host = document.createElement('div');
  document.body.appendChild(host);
});

afterEach(() => {
  document.addEventListener = addEventListener;
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
    let button: HTMLButtonElement = null;

    const render$ = () => {
      render(App(), host);
    };

    const App = createComponent(() => {
      const handleClick = () => mockFn();

      return <button onClick={handleClick}>click</button>;
    });

    render$();
    button = host.querySelector('button');
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
    let button: HTMLButtonElement = null;

    const App = createComponent(() => {
      const handleClick = () => mockFn();

      return <button onClick={handleClick}>click</button>;
    });

    render(App(), host);
    button = host.querySelector('button');
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);

    render(null, host);
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('delegates all events to document', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    document.addEventListener = function (...args: Array<any>) {
      mockFn1();
      return addEventListener(...args);
    };

    const App = createComponent(() => {
      const handleClick = () => mockFn2();

      return <button onClick={handleClick}>click</button>;
    });

    render(App(), host);
    click(host.querySelector('button'));
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn1.mock.invocationCallOrder[0]).toBeLessThan(mockFn2.mock.invocationCallOrder[0]);
  });
});
