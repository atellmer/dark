/** @jsx h */
import { setInputValue } from '@test-utils';
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
});
