import {
  h,
  View,
  Text,
  Fragment,
  createComponent,
  memo,
  useCallback,
  SplitUpdate,
  useSplitUpdate,
} from '@dark-engine/core';
import { createRoot, render } from '@dark-engine/platform-browser';

const host = document.getElementById('root');

type AppProps = {
  dynamic: boolean;
};

const text = 'I am dynamic tag';

const render$ = (props: AppProps) => {
  render(App(props), host);
};

const CustomItem = createComponent(
  ({ slot }) => {
    return <span>{slot}</span>;
  },
  { displayName: 'CustomItem' },
);

const App = createComponent<AppProps>(({ dynamic }) => {
  const Tag = dynamic ? CustomItem : 'div';

  return <Tag>{text}</Tag>;
});

render$({ dynamic: false });

setTimeout(() => {
  render$({ dynamic: true });
}, 3000);

setTimeout(() => {
  render$({ dynamic: false });
}, 6000);
