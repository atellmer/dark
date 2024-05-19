import {
  type DarkElement,
  component,
  createContext,
  useContext,
  useState,
  useMemo,
  useLayoutEffect,
  memo,
} from '@dark-engine/core';
import { type DarkJSX, createRoot } from '@dark-engine/platform-browser';
import { styled, createGlobalStyle, keyframes, css } from '@dark-engine/styled';

type Theme = 'light' | 'dark';

type ThemeMode = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeMode>(null);

const useTheme = () => useContext(ThemeContext);

const Body = component(() => {
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

const DarkModeSwitch = component(() => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const handleClick = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <div style='text-align: center'>
      <Icon key={theme}>{isDark ? '🌛' : '🌞'}</Icon>
      <Button $isDark={isDark} onClick={handleClick}>
        Switch theme
      </Button>
    </div>
  );
});

let renders = 0;

type StaticLayoutProps = {
  slot: DarkElement;
};

const StaticLayout = memo(
  component<StaticLayoutProps>(({ slot }) => {
    renders++;

    return (
      <>
        <span class='mark'>renders: {renders}</span>
        {slot}
      </>
    );
  }),
);

const App = component(() => {
  const [theme, setTheme] = useState<Theme>('light');
  const context = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <>
      <GlobalStyle />
      <ThemeContext value={context}>
        <Body />
        <Root>
          <StaticLayout>
            <DarkModeSwitch />
          </StaticLayout>
        </Root>
      </ThemeContext>
    </>
  );
});

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: 14px;
  }
  body {
    font-family: 'Roboto';
    transition: background-color 0.4s ease-in-out, color 0.4s ease-in-out;
  }

  .dark {
    background-color: #12005e;
    color: #fff;
  }

  .mark {
    position: fixed;
    top: 20px;
    left: 20px;
  }
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Icon = styled.div`
  font-size: 10rem;
  margin-bottom: 16px;
  animation-name: ${fade};
  animation-iteration-count: 1;
  animation-duration: 0.4s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
`;

const Button = styled.button<{ $isDark: boolean } & DarkJSX.Elements['button']>`
  transition: all 0.4s ease-in-out;
  width: 200px;
  padding: 16px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;

  ${p => css`
    background-color: ${p.$isDark ? '#7b1fa2' : '#4fc3f7'};
    border: 3px solid ${p.$isDark ? '#4a0072' : '#03a9f4'};
  `}
`;

createRoot(document.getElementById('root')).render(<App />);
