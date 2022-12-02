/** @jsx h */
import { click } from '@test-utils';
import { h, createComponent } from '@dark-engine/core';
import { createRoot } from '../create-root';
import { SyntheticEvent } from './events';

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

describe('[events]', () => {
  test('can pass synthetic event', () => {
    let event: SyntheticEvent<MouseEvent, HTMLButtonElement> = null;

    const App = createComponent(() => {
      const handleClick = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
        event = e;
      };

      return <button onClick={handleClick}>click</button>;
    });

    const root = createRoot(host);

    root.render(App());
    click(host.querySelector('button'));
    expect(event).toBeInstanceOf(SyntheticEvent);
    expect(event.stopPropagation).toBeInstanceOf(Function);
    expect(event.preventDefault).toBeInstanceOf(Function);
    expect(event.sourceEvent).toBeInstanceOf(Event);
    root.unmount();
  });

  test('can fire events', () => {
    const mockFn = jest.fn();
    let button: HTMLButtonElement = null;

    const App = createComponent(() => {
      const handleClick = () => mockFn();

      return <button onClick={handleClick}>click</button>;
    });

    const root = createRoot(host);

    root.render(App());
    button = host.querySelector('button');
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);

    click(button);
    expect(mockFn).toHaveBeenCalledTimes(2);

    root.render(App());
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(3);
    root.unmount();
  });

  test('can remove event listeners when unmount', () => {
    const mockFn = jest.fn();
    let button: HTMLButtonElement = null;

    const App = createComponent(() => {
      const handleClick = () => mockFn();

      return <button onClick={handleClick}>click</button>;
    });

    const root = createRoot(host);

    root.render(App());
    button = host.querySelector('button');
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);

    root.render(null);
    click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
    root.unmount();
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

    const root = createRoot(host);

    root.render(App());
    click(host.querySelector('button'));
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    expect(mockFn1.mock.invocationCallOrder[0]).toBeLessThan(mockFn2.mock.invocationCallOrder[0]);
    root.unmount();
  });

  test('can fire event propagation', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    const App = createComponent(() => {
      const handleDivClick = () => mockFn1();
      const handleButtonClick = () => mockFn2();

      return (
        <div onClick={handleDivClick}>
          <button onClick={handleButtonClick}>click</button>
        </div>
      );
    });

    const root = createRoot(host);

    root.render(App());
    click(host.querySelector('button'));
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
    root.unmount();
  });

  test('can stop event propagation', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    const App = createComponent(() => {
      const handleDivClick = () => mockFn1();
      const handleButtonClick = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
        e.stopPropagation();
        mockFn2();
      };

      return (
        <div onClick={handleDivClick}>
          <button onClick={handleButtonClick}>click</button>
        </div>
      );
    });

    const root = createRoot(host);

    root.render(App());
    click(host.querySelector('button'));
    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
    root.unmount();
  });

  test('can prevent default behaviour', () => {
    let event: SyntheticEvent<MouseEvent, HTMLButtonElement> = null;

    const App = createComponent(() => {
      const handleClick = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
        e.preventDefault();
        event = e;
      };

      return <button onClick={handleClick}>click</button>;
    });

    const root = createRoot(host);

    root.render(App());
    click(host.querySelector('button'));
    expect(event.sourceEvent.defaultPrevented).toBe(true);
    root.unmount();
  });
});
