import {
  h,
  Fragment,
  createComponent,
  createContext,
  useContext,
  useState,
  useMemo,
  useLayoutEffect,
  memo,
  type DarkElement,
} from '@dark-engine/core';
import { createRoot, useStyle } from '@dark-engine/platform-browser';

type Theme = 'light' | 'dark';

type ThemeMode = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeMode>(null);

const useTheme = () => useContext(ThemeContext);

const Body = createComponent(() => {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const isDark = theme === 'dark';

    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return null;
});

const DarkModeSwitch = createComponent(() => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const style = useStyle(styled => ({
    root: styled`
      text-align: center;
    `,
    icon: styled`
      font-size: 10rem;
      margin-bottom: 16px;
    `,
    button: styled`
      transition: all 0.4s ease-in-out;
      width: 200px;
      cursor: pointer;
      background-color: ${isDark ? '#7b1fa2' : '#4fc3f7'};
      border: 3px solid ${isDark ? '#4a0072' : '#03a9f4'};
      padding: 16px;
      color: #fff;
      text-transform: uppercase;
      font-weight: 700;
    `,
  }));

  const handleClick = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <div style={style.root}>
      <div key={theme} style={style.icon} class='fade'>
        {isDark ? '🌛' : '🌞'}
      </div>
      <button style={style.button} onClick={handleClick}>
        Switch theme
      </button>
    </div>
  );
});

let renders = 0;

type StaticLayoutProps = {
  slot: DarkElement;
};

const StaticLayout = memo(
  createComponent<StaticLayoutProps>(({ slot }) => {
    renders++;

    return (
      <>
        <span class='mark'>renders: {renders}</span>
        {slot}
      </>
    );
  }),
);

const App = createComponent(() => {
  const [theme, setTheme] = useState<Theme>('light');
  const context = useMemo(() => ({ theme, setTheme }), [theme]);
  const style = useStyle(styled => ({
    root: styled`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    `,
  }));

  return (
    <ThemeContext.Provider value={context}>
      <Body />
      <div style={style.root}>
        <StaticLayout>
          <DarkModeSwitch />
        </StaticLayout>
      </div>
    </ThemeContext.Provider>
  );
});

createRoot(document.getElementById('root')).render(<App />);
