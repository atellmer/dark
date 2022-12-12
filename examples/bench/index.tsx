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
  useEffect,
  useState,
} from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

type AppProps = {
  count: number;
};

const NestedArray = createComponent<AppProps>(
  ({ count }) => {
    return Array(count)
      .fill(0)
      .map((_, idx) => <p key={idx}>{idx}</p>);
  },
  { displayName: 'NestedArray' },
);

const App = createComponent<AppProps>(({ count }) => {
  return (
    <>
      <div>1*</div>
      <div>2*</div>
      <NestedArray count={count} />
      <div>3*</div>
    </>
  );
});

// render$({ count: 3 });
// expect(host.innerHTML).toBe(content(3));

// render$({ count: 5 });
// expect(host.innerHTML).toBe(content(5));

// render$({ count: 1 });
// expect(host.innerHTML).toBe(content(1));

const root = createRoot(document.getElementById('root'));

root.render(<App count={3} />);

setTimeout(() => {
  root.render(<App count={5} />);
}, 3000);
