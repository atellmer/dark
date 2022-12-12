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
  //show?: boolean;
};

const App = createComponent<AppProps>(() => {
  return (
    <div>
      <Box />
      <Box />
    </div>
  );
});

type BoxProps = {
  //show?: boolean;
};

const Box = createComponent<BoxProps>(
  () => {
    const [show, setShow] = useState(true);

    const handleClick = () => {
      setShow(x => !x);
    };

    return (
      <>
        {show && (
          <>
            <div>1*</div>
            <div>2*</div>
            <div>3*</div>
          </>
        )}
        <button onClick={handleClick}>toggle</button>
      </>
    );
  },
  { displayName: 'Box' },
);

const root = createRoot(document.getElementById('root'));

root.render(<App />);

// setTimeout(() => {
//   root.render(<App />);
// }, 3000);
