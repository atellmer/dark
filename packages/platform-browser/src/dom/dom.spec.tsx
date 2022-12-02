/** @jsx h */
import { setInputValue, dom } from '@test-utils';
import { h, Fragment, createComponent, useState } from '@dark-engine/core';
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

    const App = createComponent(() => {
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
    const App = createComponent(() => {
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

    const App = createComponent<AppProps>(({ required }) => {
      return <input required={required} data-required={required} />;
    });

    render$({ required: true });
    expect(host.innerHTML).toBe(content(true));

    render$({ required: false });
    expect(host.innerHTML).toBe(content(false));
    root.unmount();
  });
});
