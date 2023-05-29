import { h, component, useState, useEffect } from '@dark-engine/core';
import { render, Window, Text } from '@dark-engine/platform-desktop';

type AppProps = {
  title: string;
};

const minSize = { width: 500, height: 500 };

const App = component<AppProps>(({ title }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(x => x + 1);
    }, 1000);
  }, []);

  return (
    <Window windowTitle={title} minSize={minSize}>
      <Text>xxx {count}</Text>
    </Window>
  );
});

render(<App title={`Dark`} />);
