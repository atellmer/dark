import { startFPSMonitor, startMemMonitor } from 'perf-monitor';

import {
  h,
  Text,
  createComponent,
  memo,
  useState,
  useEffect,
  useCallback,
  Fragment,
  TaskPriority,
  DarkElement,
  useDeferredValue,
} from '@dark-engine/core';
import { render, useStyle } from '@dark-engine/platform-browser';

startFPSMonitor();
startMemMonitor();

const domElement = document.getElementById('root');

const targetSize = 25;

type DotProps = {
  size: number;
  x: number;
  y: number;
  slot: DarkElement;
};

const Dot = createComponent<DotProps>(props => {
  const [hover, setHover] = useState(false, { priority: TaskPriority.HIGH });
  const s = props.size * 1.3;
  const style = useStyle(styled => ({
    dot: styled`
      position: absolute;
      background-color: #61dafb;
      text-align: center;
      cursor: pointer;
      width: ${s}px;
      height: ${s}px;
      left: ${props.x}px;
      top: ${props.y}px;
      border-radius: ${s / 2}px;
      line-height: ${s}px;
      background-color: ${hover ? 'yellow' : '#61dafb'};
    `,
  }));

  const enter = useCallback(() => {
    setHover(true);
  }, []);

  const leave = useCallback(() => {
    setHover(false);
  }, []);

  return (
    <div style={style.dot} onMouseEnter={enter} onMouseLeave={leave}>
      {hover ? `* ${Text.from(props.slot)} *` : Text.from(props.slot)}
    </div>
  );
});

const MemoDot = memo(
  Dot,
  (p, n) => p.x !== n.x || p.y !== n.y || p.size !== n.size || Text.from(p.slot) !== Text.from(n.slot),
);

type SierpinskiTriangleProps = {
  s: number;
  x: number;
  y: number;
  slot: DarkElement;
};

const SierpinskiTriangle = createComponent<SierpinskiTriangleProps>(({ x, y, s, slot }) => {
  if (s <= targetSize) {
    return (
      <MemoDot x={x - targetSize / 2} y={y - targetSize / 2} size={targetSize}>
        {slot}
      </MemoDot>
    );
  }

  s /= 2;

  return (
    <>
      <MemoSierpinskiTriangle x={x} y={y - s / 2} s={s}>
        {slot}
      </MemoSierpinskiTriangle>
      <MemoSierpinskiTriangle x={x - s} y={y + s / 2} s={s}>
        {slot}
      </MemoSierpinskiTriangle>
      <MemoSierpinskiTriangle x={x + s} y={y + s / 2} s={s}>
        {slot}
      </MemoSierpinskiTriangle>
    </>
  );
});

const MemoSierpinskiTriangle = memo(
  SierpinskiTriangle,
  (p, n) => p.x !== n.x || p.y !== n.y || p.s !== n.s || Text.from(p.slot) !== Text.from(n.slot),
);

type AppProps = {
  elapsed: number;
};

const App = createComponent<AppProps>(props => {
  const [seconds, setSeconds] = useState(0);
  const defferedSeconds = useDeferredValue(seconds);
  const elapsed = props.elapsed;
  const t = (elapsed / 1000) % 10;
  const scale = 1 + (t > 5 ? 10 - t : t) / 10;

  useEffect(() => {
    setInterval(() => setSeconds(seconds => (seconds % 10) + 1), 1000);
  }, []);

  const style = useStyle(styled => ({
    container: styled`
      position: absolute;
      left: 50%;
      top: 50%;
      transform-origin: 0 0;
      background-color: #eee;
      transform: scaleX(${scale / 2.1}) scaleY(0.7);
    `,
  }));

  return (
    <div style={style.container}>
      <MemoSierpinskiTriangle x={0} y={0} s={1000}>
        {defferedSeconds}
      </MemoSierpinskiTriangle>
    </div>
  );
});

const start = new Date().getTime();

function update() {
  render(<App elapsed={new Date().getTime() - start} />, domElement);

  requestAnimationFrame(update);
}

function run() {
  requestAnimationFrame(update);
}

run();
