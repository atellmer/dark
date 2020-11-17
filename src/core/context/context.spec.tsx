/** @jsx createElement */
import { requestIdleCallback } from '@shopify/jest-dom-mocks';

import { createComponent } from '@core/component/component';
import { createElement } from '@core/element/element';
import { useState } from '../use-state';
import { createContext } from './context';
import { render } from '../../platform/browser/render';
import { dom } from '../../../test/utils';


let host: HTMLElement = null;
const fireRenders = () => requestIdleCallback.runIdleCallbacks();

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  host = document.createElement('div');
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) => cb());
});

test('context creates correctly', () => {
  const ThemeContext = createContext('light');

  expect(ThemeContext.Provider).toBeTruthy();
  expect(ThemeContext.Consumer).toBeTruthy();
});

test('context renders correctly', () => {
  const content = (theme) => dom`
    <div>${theme}</div>
  `;

  const ThemeContext = createContext('light');

  const Item = createComponent(() => {
    return (
      <ThemeContext.Consumer>
        {value => <div>{value}</div>}
      </ThemeContext.Consumer>
    )
  });

  const Content = createComponent(() => {
    return [
      <Item />,
    ];
  });

  let theme;
  let setTheme;

  const App = createComponent(() => {
    [theme, setTheme] = useState('light');

    return [
      <ThemeContext.Provider value={theme}>
        <Content />
      </ThemeContext.Provider>,
    ]
  });

  render(App(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(theme));
  setTheme('dark');
  fireRenders();
  expect(host.innerHTML).toBe(content(theme));
});

test('different nested context works correctly', () => {
  const content = (theme, lang) => dom`
    <div>${theme}:${lang}</div>
  `;

  const ThemeContext = createContext('light');
  const LangContext = createContext('ru');

  const Item = createComponent(() => {
    return (
      <ThemeContext.Consumer>
        {theme =>
          <LangContext.Consumer>
            {lang => <div>{theme}:{lang}</div>}
          </LangContext.Consumer>
        }
      </ThemeContext.Consumer>
    );
  });

  const Content = createComponent(() => {
    return [
      <Item />,
    ];
  });

  let theme;
  let setTheme;
  let lang;
  let setLang;

  const App = createComponent(() => {
    [theme, setTheme] = useState('light');
    [lang, setLang] = useState('ru');

    return [
      <ThemeContext.Provider value={theme}>
        <LangContext.Provider value={lang}>
          <Content />
        </LangContext.Provider>
      </ThemeContext.Provider>,
    ]
  });

  render(App(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(theme, lang));
  setTheme('dark');
  setLang('en');
  fireRenders();
  expect(host.innerHTML).toBe(content(theme, lang));
  setTheme('light');
  fireRenders();
  expect(host.innerHTML).toBe(content(theme, lang));
});


test('same nested context works correctly', () => {
  const content = (value) => dom`
    <div>${value}</div>
  `;

  const FormContext = createContext(1);
  const value = 20;

  const Item = createComponent(() => {
    return (
      <FormContext.Consumer>
        {value => <div>{value}</div>}
      </FormContext.Consumer>
    );
  });

  const Content = createComponent(() => {
    return [
      <FormContext.Provider value={value}>
        <Item />
      </FormContext.Provider>,
    ];
  });

  const App = createComponent(() => {
    return [
      <FormContext.Provider value={10}>
        <Content />
      </FormContext.Provider>,
    ]
  });

  render(App(), host);
  fireRenders();
  expect(host.innerHTML).toBe(content(value));
});
