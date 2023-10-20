/** @jsx h */
import { h, component } from '@dark-engine/core';

import { click, createEnv } from '@test-utils';
import { SyntheticEvent } from './events';

let { host, render } = createEnv();

beforeEach(() => {
  ({ host, render } = createEnv());
});

describe('[events]', () => {
  test('can pass synthetic event', () => {
    let event: SyntheticEvent<MouseEvent> = null;
    const App = component(() => {
      const handleClick = (e: SyntheticEvent<MouseEvent>) => {
        event = e;
      };

      return <button onClick={handleClick}>click</button>;
    });

    render(App());
    click(host.querySelector('button'));
    expect(event).toBeInstanceOf(SyntheticEvent);
    expect(event.stopPropagation).toBeInstanceOf(Function);
    expect(event.preventDefault).toBeInstanceOf(Function);
    expect(event.sourceEvent).toBeInstanceOf(Event);
  });

  test('can fire events', () => {
    let button: HTMLButtonElement = null;
    const spy = jest.fn();
    const App = component(() => {
      const handleClick = () => spy();

      return <button onClick={handleClick}>click</button>;
    });

    render(App());
    button = host.querySelector('button');
    click(button);
    expect(spy).toHaveBeenCalledTimes(1);

    click(button);
    expect(spy).toHaveBeenCalledTimes(2);

    render(App());
    click(button);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('can remove event listeners when unmount', () => {
    let button: HTMLButtonElement = null;
    const spy = jest.fn();
    const App = component(() => {
      return <button onClick={spy}>click</button>;
    });

    render(App());
    button = host.querySelector('button');
    click(button);
    expect(spy).toHaveBeenCalledTimes(1);

    render(null);
    click(button);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('delegates all events to document', () => {
    const spy = jest.fn();
    const listenerSpy = jest.spyOn(document, 'addEventListener');
    const App = component(() => {
      return <button onClick={spy}>click</button>;
    });

    render(App());
    click(host.querySelector('button'));
    expect(listenerSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(listenerSpy.mock.invocationCallOrder[0]).toBeLessThan(spy.mock.invocationCallOrder[0]);
  });

  test('can fire event propagation', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const App = component(() => {
      return (
        <div onClick={spy1}>
          <button onClick={spy2}>click</button>
        </div>
      );
    });

    render(App());
    click(host.querySelector('button'));
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test('can stop event propagation', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const App = component(() => {
      const handleButtonClick = (e: SyntheticEvent<MouseEvent, HTMLButtonElement>) => {
        e.stopPropagation();
        spy2();
      };

      return (
        <div onClick={spy1}>
          <button onClick={handleButtonClick}>click</button>
        </div>
      );
    });

    render(App());
    click(host.querySelector('button'));
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  test('can prevent default behaviour', () => {
    let event: SyntheticEvent<MouseEvent> = null;
    const App = component(() => {
      const handleClick = (e: SyntheticEvent<MouseEvent>) => {
        e.preventDefault();
        event = e;
      };

      return <button onClick={handleClick}>click</button>;
    });

    render(App());
    click(host.querySelector('button'));
    expect(event.sourceEvent.defaultPrevented).toBe(true);
  });

  test('can fire event with tuple handler', () => {
    let button: HTMLButtonElement = null;
    const spy = jest.fn();
    const App = component(() => {
      const handleClick = (arg: string) => spy(arg);

      return <button onClick={[handleClick, 'Hello']}>click</button>;
    });

    render(App());
    button = host.querySelector('button');
    click(button);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Hello');

    click(button);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('Hello');

    render(App());
    click(button);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith('Hello');
  });
});
