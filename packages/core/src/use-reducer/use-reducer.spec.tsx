/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { useReducer } from './use-reducer';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/use-reducer', () => {
  test('can update state with render', () => {
    type State = { count: number };
    type Action = { type: string };

    let state: State;
    let dispatch: (action: Action) => void;

    const content = (value: number) => dom`
      <div>Count: ${value}</div>
    `;

    const initialState: State = { count: 0 };

    function reducer(state: State, action: Action) {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 };
        case 'decrement':
          return { count: state.count - 1 };
        default:
          throw new Error();
      }
    }

    const App = component(() => {
      [state, dispatch] = useReducer(reducer, initialState);

      return <div>Count: {state.count}</div>;
    });

    render(<App />, host);
    expect(host.innerHTML).toBe(content(0));

    dispatch({ type: 'increment' });
    expect(host.innerHTML).toBe(content(1));

    dispatch({ type: 'increment' });
    expect(host.innerHTML).toBe(content(2));

    dispatch({ type: 'decrement' });
    expect(host.innerHTML).toBe(content(1));
  });
});
