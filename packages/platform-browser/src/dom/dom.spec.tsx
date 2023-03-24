/** @jsx h */
import { h, Fragment, component, useState } from '@dark-engine/core';

import { setInputValue, dom } from '@test-utils';
import { createRoot } from '../create-root';
import { type SyntheticEvent } from '../events';

let host: HTMLElement = null;

beforeEach(() => {
  host?.parentElement === document.body && document.body.removeChild(host);
  host = document.createElement('div');
  document.body.appendChild(host);
});

describe('[DOM]', () => {
  test('set IDL properties for inputs correctly', () => {
    let inputOne: HTMLInputElement = null;
    let inputTwo: HTMLInputElement = null;

    const App = component(() => {
      const [value, setValue] = useState('');

      const handleInput = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => {
        setValue(e.target.value);
      };

      return (
        <>
          <input id='a' value={value} onInput={handleInput} />
          <input id='b' value={value} onInput={handleInput} />
        </>
      );
    });

    const root = createRoot(host);

    root.render(App());
    inputOne = host.querySelector('#a');
    inputTwo = host.querySelector('#b');
    setInputValue(inputOne, 'Taylor');
    expect(inputTwo.value).toBe('Taylor');

    setInputValue(inputTwo, 'Taylor Swift');
    expect(inputOne.value).toBe('Taylor Swift');
    root.unmount();
  });

  test('can render data-attributes', () => {
    const content = () => dom`
      <input data-attr-1="true" data-attr-2="true" data-attr-3="false" data-attr-4="true" data-attr-5="666">
    `;
    const App = component(() => {
      return <input data-attr-1='true' data-attr-2={true} data-attr-3={false} data-attr-4 data-attr-5='666' />;
    });
    const root = createRoot(host);

    root.render(App());
    expect(host.innerHTML).toBe(content());
    root.unmount();
  });

  test('does not render falsy boolean attributes if it not data-attribute', () => {
    const content = (required: boolean) => dom`
      <input ${required ? `required="" data-required="${required}"` : `data-required="${required}"`}>
    `;

    type AppProps = {
      required: boolean;
    };

    const root = createRoot(host);
    const render$ = (props: AppProps) => root.render(App(props));

    const App = component<AppProps>(({ required }) => {
      return <input required={required} data-required={required} />;
    });

    render$({ required: true });
    expect(host.innerHTML).toBe(content(true));

    render$({ required: false });
    expect(host.innerHTML).toBe(content(false));
    root.unmount();
  });

  test('can render svg', () => {
    const content = () => dom`
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14" width="14" filter="drop-shadow( 0px 1px 1px rgba(0, 0, 0, .7))" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"></path>
      </svg>
    `;

    const root = createRoot(host);

    const render$ = (props = {}) => {
      root.render(App(props));
    };

    const App = component(() => {
      return (
        <svg
          stroke='currentColor'
          fill='currentColor'
          stroke-width='0'
          viewBox='0 0 512 512'
          height={14}
          width={14}
          filter='drop-shadow( 0px 1px 1px rgba(0, 0, 0, .7))'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            fill='none'
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='48'
            d='M184 112l144 144-144 144'
          />
        </svg>
      );
    });

    render$();
    expect(host.innerHTML).toBe(content());
    root.unmount();
  });
});
