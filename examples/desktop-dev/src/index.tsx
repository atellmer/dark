import { h, component } from '@dark-engine/core';
import { render, Window } from '@dark-engine/platform-desktop';

type AppProps = {
  title: string;
};

const App = component<AppProps>(({ title }) => {
  return <Window windowTitle={title}></Window>;
});

let count = 0;

render(<App title={`Dark ${count}`} />);

setInterval(() => {
  count++;
  render(<App title={`Dark ${count}`} />);
}, 1000);

// const win = new QMainWindow();

// win.setWindowTitle('Dark Hello World');

// win.show();

// (global as any).win = win;
