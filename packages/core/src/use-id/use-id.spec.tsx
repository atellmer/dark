/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { component } from '../component';
import { useId } from './use-id';

let hostOne: HTMLElement = null;
let hostTwo: HTMLElement = null;

beforeEach(() => {
  hostOne = document.createElement('div');
  hostTwo = document.createElement('div');
});

describe('[use-id]', () => {
  test('can generate stable id', () => {
    const render$ = (props = {}) => {
      render(App(props), hostOne);
    };

    let firstId: string = null;
    let id: string = null;

    const App = component(() => {
      id = useId();

      return null;
    });

    render$();
    firstId = id;
    expect(typeof id).toBe('string');
    render$();
    expect(id).toBe(firstId);
    render$();
    expect(id).toBe(firstId);
  });

  test('can generate many unique ids', () => {
    const render$ = (props = {}) => {
      render(App(props), hostOne);
    };

    let firstId: string = null;
    let secondId: string = null;
    let idOne: string = null;
    let idTwo: string = null;

    const App = component(() => {
      idOne = useId();
      idTwo = useId();

      return null;
    });

    render$();
    firstId = idOne;
    secondId = idTwo;
    render$();
    expect(idOne).not.toBe(idTwo);
    expect(firstId).toBe(idOne);
    expect(secondId).toBe(idTwo);
    render$();
    expect(idOne).not.toBe(idTwo);
    expect(firstId).toBe(idOne);
    expect(secondId).toBe(idTwo);
  });

  test('can support many roots app', () => {
    const render$ = (props = {}) => {
      render(AppOne(props), hostOne);
      render(AppTwo(props), hostTwo);
    };

    let firstId: string = null;
    let secondId: string = null;
    let idOne: string = null;
    let idTwo: string = null;

    const AppOne = component(() => {
      idOne = useId();

      return null;
    });

    const AppTwo = component(() => {
      idTwo = useId();

      return null;
    });

    render$();
    firstId = idOne;
    secondId = idTwo;
    render$();
    expect(idOne).not.toBe(idTwo);
    expect(firstId).toBe(idOne);
    expect(secondId).toBe(idTwo);
    render$();
    expect(idOne).not.toBe(idTwo);
    expect(firstId).toBe(idOne);
    expect(secondId).toBe(idTwo);
  });
});
