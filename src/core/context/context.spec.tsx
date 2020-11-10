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