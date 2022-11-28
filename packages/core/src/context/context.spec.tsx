/** @jsx h */
import { dom } from '@test-utils';
import { render } from '@dark-engine/platform-browser';
import { createComponent } from '../component';
import { h } from '../element';
import { useState } from '../use-state';
import { createContext } from './context';

let host: HTMLElement = null;

type Theme = 'light' | 'dark';
type Lang = 'en' | 'de';

beforeEach(() => {
  host = document.createElement('div');
});

describe('[context]', () => {
  test('is created correctly', () => {
    const ThemeContext = createContext<Theme>('light');

    expect(ThemeContext.Provider).toBeTruthy();
    expect(ThemeContext.Consumer).toBeTruthy();
  });

  test('renders correctly', () => {
    const content = (theme: Theme) => dom`
      <div>${theme}</div>
    `;

    const ThemeContext = createContext<Theme>('light');

    const Item = createComponent(() => {
      return <ThemeContext.Consumer>{value => <div>{value}</div>}</ThemeContext.Consumer>;
    });

    const Content = createComponent(() => {
      return [<Item />];
    });

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = createComponent(() => {
      [theme, setTheme] = useState<Theme>('light');

      return [
        <ThemeContext.Provider value={theme}>
          <Content />
        </ThemeContext.Provider>,
      ];
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(theme));

    setTheme('dark');
    expect(host.innerHTML).toBe(content(theme));
  });

  test('nested contexts work correctly', () => {
    const content = (theme: Theme, lang: string) => dom`
      <div>${theme}:${lang}</div>
    `;

    const ThemeContext = createContext<Theme>('light');
    const LangContext = createContext('ru');

    const Item = createComponent(() => {
      return (
        <ThemeContext.Consumer>
          {theme => (
            <LangContext.Consumer>
              {lang => (
                <div>
                  {theme}:{lang}
                </div>
              )}
            </LangContext.Consumer>
          )}
        </ThemeContext.Consumer>
      );
    });

    const Content = createComponent(() => {
      return [<Item />];
    });

    let theme: Theme;
    let setTheme: (value: Theme) => void;
    let lang: Lang;
    let setLang: (value: Lang) => void;

    const App = createComponent(() => {
      [theme, setTheme] = useState<Theme>('light');
      [lang, setLang] = useState<Lang>('de');

      return [
        <ThemeContext.Provider value={theme}>
          <LangContext.Provider value={lang}>
            <Content />
          </LangContext.Provider>
        </ThemeContext.Provider>,
      ];
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(theme, lang));

    setTheme('dark');
    setLang('en');
    expect(host.innerHTML).toBe(content(theme, lang));

    setTheme('light');
    expect(host.innerHTML).toBe(content(theme, lang));
  });

  test('same nested context works correctly', () => {
    const content = (value: number) => dom`
      <div>${value}</div>
    `;

    const FormContext = createContext(1);
    const value = 20;

    const Item = createComponent(() => {
      return <FormContext.Consumer>{value => <div>{value}</div>}</FormContext.Consumer>;
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
      ];
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(value));
  });
});
