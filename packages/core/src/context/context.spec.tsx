import { createBrowserEnv } from '@test-utils';

import { component, detectIsComponent } from '../component';
import { type DarkElement } from '../shared';
import { useState } from '../use-state';
import { memo } from '../memo';
import { detectIsFunction } from '../utils';
import { createContext, useContext } from './context';

type Theme = 'light' | 'dark';
type Lang = 'en' | 'de';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
});

describe('@core/context', () => {
  test('returns a component factory as context', () => {
    const Context = createContext<Theme>('light');

    expect(detectIsFunction(Context)).toBe(true);
    expect(detectIsComponent(Context())).toBe(true);
  });

  test('works correctly by default', () => {
    let theme: Theme;
    let setTheme: (value: Theme) => void;
    const ThemeContext = createContext<Theme>('light');
    const Item = component(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });
    const Content = component(() => {
      return [<Item />];
    });
    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');

      return [
        <ThemeContext value={theme}>
          <Content />
        </ThemeContext>,
      ];
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);

    setTheme('light');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);
  });

  test('nested contexts can work together', () => {
    let theme: Theme;
    let lang: Lang;
    let setTheme: (value: Theme) => void;
    let setLang: (value: Lang) => void;
    const ThemeContext = createContext<Theme>('light');
    const LangContext = createContext('ru');
    const Item = component(() => {
      const theme = useContext(ThemeContext);
      const lang = useContext(LangContext);

      return (
        <div>
          {theme}:{lang}
        </div>
      );
    });
    const Content = component(() => <Item />);
    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');
      [lang, setLang] = useState<Lang>('de');

      return [
        <ThemeContext value={theme}>
          <LangContext value={lang}>
            <Content />
          </LangContext>
        </ThemeContext>,
      ];
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light:de</div>"`);

    setTheme('dark');
    setLang('en');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark:en</div>"`);

    setTheme('light');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light:en</div>"`);
  });

  test('the same nested context works correctly', () => {
    const FormContext = createContext(1);
    const Item = component(() => {
      const value = useContext(FormContext);

      return <div>{value}</div>;
    });
    const Content = component(() => {
      return [
        <FormContext value={20}>
          <Item />
        </FormContext>,
      ];
    });
    const App = component(() => {
      return [
        <FormContext value={10}>
          <Content />
        </FormContext>,
      ];
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>20</div>"`);
  });

  test('works inside static layout #1', () => {
    let theme: Theme;
    let setTheme: (value: Theme) => void;
    const ThemeContext = createContext<Theme>('light');
    const Consumer = component(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });
    const StaticLayout = memo(component(() => <Consumer />));
    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');

      return (
        <ThemeContext value={theme}>
          <StaticLayout />
        </ThemeContext>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);

    setTheme('light');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('light');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);
  });

  test('works inside static layout #2', () => {
    let theme: Theme;
    let setTheme: (value: Theme) => void;
    const ThemeContext = createContext<Theme>('light');
    const Consumer = component(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });
    const StaticLayout = memo(component<{ slot: DarkElement }>(({ slot }) => slot));
    const App = component(() => {
      [theme, setTheme] = useState<Theme>('light');

      return (
        <ThemeContext value={theme}>
          <StaticLayout>
            <Consumer />
          </StaticLayout>
        </ThemeContext>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);

    setTheme('light');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('light');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>light</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);

    setTheme('dark');
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>dark</div>"`);
  });
});
