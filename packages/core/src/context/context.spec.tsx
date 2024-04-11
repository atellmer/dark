import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { component } from '../component';
import { useState } from '../use-state';
import { memo } from '../memo';
import { type DarkElement } from '../shared';
import { createContext, useContext } from './context';

let host: HTMLElement = null;

jest.useFakeTimers();

type Theme = 'light' | 'dark';
type Lang = 'en' | 'de';

beforeEach(() => {
  host = document.createElement('div');
});

describe('@core/context', () => {
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

    const Item = component(() => {
      return <ThemeContext.Consumer>{value => <div>{value}</div>}</ThemeContext.Consumer>;
    });

    const Content = component(() => {
      return [<Item />];
    });

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = component(() => {
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

    const Item = component(() => {
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

    const Content = component(() => {
      return [<Item />];
    });

    let theme: Theme;
    let setTheme: (value: Theme) => void;
    let lang: Lang;
    let setLang: (value: Lang) => void;

    const App = component(() => {
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

    const Item = component(() => {
      return <FormContext.Consumer>{value => <div>{value}</div>}</FormContext.Consumer>;
    });

    const Content = component(() => {
      return [
        <FormContext.Provider value={value}>
          <Item />
        </FormContext.Provider>,
      ];
    });

    const App = component(() => {
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

describe('[use-context]', () => {
  test('works correctly', () => {
    const content = (theme: Theme) => dom`
      <div>${theme}</div>
    `;
    const ThemeContext = createContext<Theme>('light');

    const Item = component(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');

      return [
        <ThemeContext.Provider value={theme}>
          <Item />
        </ThemeContext.Provider>,
      ];
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(theme));

    setTheme('dark');
    // In this case, there is no need to wait for timers.
    expect(host.innerHTML).toBe(content(theme));

    setTheme('light');
    expect(host.innerHTML).toBe(content(theme));
  });

  test('works correctly inside static layout #1', () => {
    const content = (theme: Theme) => dom`
      <div>${theme}</div>
    `;

    type Theme = 'light' | 'dark';
    const ThemeContext = createContext<Theme>('light');

    const Consumer = component(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });

    const StaticLayout = memo(component(() => <Consumer />));

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');

      return (
        <ThemeContext.Provider value={theme}>
          <StaticLayout />
        </ThemeContext.Provider>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(theme));

    setTheme('dark');
    // Waiting for the execution of the timers is mandatory, since we are in a static layout and the value will be distributed through the effect.
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(theme));

    setTheme('dark');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(theme));
  });

  test('works correctly inside static layout #2', () => {
    const content = (theme: Theme) => dom`
      <div>${theme}</div>
    `;
    const ThemeContext = createContext<Theme>('light');

    const Consumer = component(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });

    type StaticLayoutProps = {
      slot: DarkElement;
    };

    const StaticLayout = memo(component<StaticLayoutProps>(({ slot }) => slot));

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');

      return (
        <ThemeContext.Provider value={theme}>
          <StaticLayout>
            <Consumer />
          </StaticLayout>
        </ThemeContext.Provider>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content(theme));

    setTheme('dark');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(theme));

    setTheme('dark');
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(theme));
  });
});
