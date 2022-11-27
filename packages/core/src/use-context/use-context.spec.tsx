/** @jsx h */
import { dom } from '@test-utils';
import { render } from '@dark-engine/platform-browser/render';
import { createComponent } from '../component';
import { h } from '../element';
import { useState } from '../use-state';
import { createContext } from '../context';
import { useContext } from './use-context';
import { memo } from '../memo';
import { DarkElement } from '../shared';

let host: HTMLElement = null;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[use-context]', () => {
  test('use-context works correctly', () => {
    const content = theme => dom`
      <div>${theme}</div>
    `;

    type Theme = 'light' | 'dark';
    const ThemeContext = createContext<Theme>('light');

    const Item = createComponent(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = createComponent(() => {
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

  test('use-context works correctly inside static layout #1', () => {
    const content = theme => dom`
      <div>${theme}</div>
    `;

    type Theme = 'light' | 'dark';
    const ThemeContext = createContext<Theme>('light');

    const Consumer = createComponent(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });

    const StaticLayout = memo(createComponent(() => <Consumer />));

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = createComponent(() => {
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

  test('use-context works correctly inside static layout #2', () => {
    const content = theme => dom`
      <div>${theme}</div>
    `;

    type Theme = 'light' | 'dark';
    const ThemeContext = createContext<Theme>('light');

    const Consumer = createComponent(() => {
      const value = useContext(ThemeContext);

      return <div>{value}</div>;
    });

    type StaticLayoutProps = {
      slot: DarkElement;
    };

    const StaticLayout = memo(createComponent<StaticLayoutProps>(({ slot }) => slot));

    let theme: Theme;
    let setTheme: (value: Theme) => void;

    const App = createComponent(() => {
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
