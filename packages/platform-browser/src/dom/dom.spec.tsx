/** @jsx h */
import { h, Fragment, Text, Comment, component, useState } from '@dark-engine/core';

import { setInputValue, dom, createBrowserEnv, replacer } from '@test-utils';
import { type SyntheticEvent } from '../events';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('[DOM]', () => {
  test('can render text correctly', () => {
    const content = 'hello';

    render(Text(content));
    expect(host.innerHTML).toBe(content);
  });

  test('can render comment correctly', () => {
    const content = 'some comment';

    render(Comment(content));
    expect(host.innerHTML).toBe(`<!--${content}-->`);
  });

  test('can render tag correctly', () => {
    const content = `<div></div>`;

    render(<div />);
    expect(host.innerHTML).toBe(content);
  });

  test('can render nullable correctly', () => {
    render(null);
    expect(host.innerHTML).toBe(replacer);

    render('');
    expect(host.innerHTML).toBe(replacer);

    render(0);
    expect(host.innerHTML).toBe(replacer);

    render(false);
    expect(host.innerHTML).toBe(replacer);

    render(undefined);
    expect(host.innerHTML).toBe(replacer);
  });

  test('can render nested tags correctly', () => {
    const content = () => dom`
      <div>
        <div>
          <div>ola</div>
        </div>
      </div>
    `;

    render(
      <div>
        <div>
          <div>ola</div>
        </div>
      </div>,
    );
    expect(host.innerHTML).toBe(content());
  });

  test('can set attributes correctly', () => {
    let div: HTMLDivElement = null;
    const class1 = 'open';
    const style1 = 'color: black';
    const App = component(() => <div class={class1} style={style1} />);

    render(App());
    div = host.querySelector('div');
    expect(div.getAttribute('class')).toBe(class1);
    expect(div.getAttribute('style')).toBe(style1);
  });

  test('can change attributes correctly', () => {
    type AppProps = { className: string; style: string };
    let div: HTMLDivElement = null;
    const class1 = 'open';
    const class2 = 'close';
    const style1 = 'color: black';
    const style2 = 'color: yellow';
    const App = component<AppProps>(({ className, style }) => <div class={className} style={style} />);

    render(App({ className: class1, style: style1 }));
    div = host.querySelector('div');
    expect(div.getAttribute('class')).toBe(class1);
    expect(div.getAttribute('style')).toBe(style1);

    render(App({ className: class2, style: style2 }));
    expect(div.getAttribute('class')).toBe(class2);
    expect(div.getAttribute('style')).toBe(style2);
  });

  test('can remove attributes correctly', () => {
    type AppProps = { className?: string; style?: string };
    let div: HTMLDivElement = null;
    const class1 = 'open';
    const style1 = 'color: black';
    const App = component<AppProps>(({ className, style }) => <div class={className} style={style} />);

    render(App({ className: class1, style: style1 }));
    div = host.querySelector('div');
    expect(div.getAttribute('class')).toBe(class1);
    expect(div.getAttribute('style')).toBe(style1);

    render(App());
    expect(div.getAttribute('class')).toBeNull();
    expect(div.getAttribute('style')).toBeNull();
  });

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

    render(App());
    inputOne = host.querySelector('#a');
    inputTwo = host.querySelector('#b');
    setInputValue(inputOne, 'Taylor');
    expect(inputTwo.value).toBe('Taylor');

    setInputValue(inputTwo, 'Taylor Swift');
    expect(inputOne.value).toBe('Taylor Swift');
  });

  test('can render data-attributes', () => {
    const content = () => dom`
      <input data-attr-1="true" data-attr-2="true" data-attr-3="false" data-attr-4="true" data-attr-5="666">
    `;
    const App = component(() => {
      return <input data-attr-1='true' data-attr-2={true} data-attr-3={false} data-attr-4 data-attr-5='666' />;
    });

    render(App());
    expect(host.innerHTML).toBe(content());
  });

  test('does not render falsy boolean attributes if it not data-attribute', () => {
    type AppProps = { required: boolean };
    const content = (required: boolean) => dom`
      <input ${required ? `required="" data-required="${required}"` : `data-required="${required}"`}>
    `;
    const App = component<AppProps>(({ required }) => <input required={required} data-required={required} />);

    render(App({ required: true }));
    expect(host.innerHTML).toBe(content(true));

    render(App({ required: false }));
    expect(host.innerHTML).toBe(content(false));
  });

  test('can render svg', () => {
    const content = () => dom`
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14" width="14" filter="drop-shadow( 0px 1px 1px rgba(0, 0, 0, .7))" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"></path>
      </svg>
    `;
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

    render(App());
    expect(host.innerHTML).toBe(content());
  });
});
