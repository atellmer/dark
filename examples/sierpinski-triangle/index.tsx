import { startFPSMonitor, startMemMonitor } from 'perf-monitor';

import { h, Text, createComponent, memo, useState, useEffect, useCallback, TaskPriority } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

startFPSMonitor();
startMemMonitor();

const domElement = document.getElementById('root');

const targetSize = 25;

const Dot = createComponent<{ size: number; x: number; y: number }>(props => {
  const [hover, setHover] = useState(false, TaskPriority.HIGH);
  const s = props.size * 1.3;
  const style = `
    position: absolute;
    background-color: #61dafb;
    font: normal 15px sans-serif;
    text-align: center;
    cursor: pointer;
    width: ${s}px;
    height: ${s}px;
    left: ${props.x}px;
    top: ${props.y}px;
    border-radius: ${s / 2}px;
    line-height: ${s}px;
    background-color: ${hover ? 'yellow' : '#61dafb'};
  `;

  const enter = useCallback(() => {
    setHover(true);
  }, []);

  const leave = useCallback(() => {
    setHover(false);
  }, []);

  return (
    <div style={style} onMouseEnter={enter} onMouseLeave={leave}>
      {hover ? `* ${Text(props.slot)} *` : Text(props.slot)}
    </div>
  );
});

const MemoDot = memo(Dot, (p, n) => p.x !== n.x || p.y !== n.y || p.size !== n.size || Text(p.slot) !== Text(n.slot));

const SierpinskiTriangle = createComponent<{ s: number; x: number; y: number }>(({ x, y, s, slot }) => {
  if (s <= targetSize) {
    return (
      <MemoDot x={x - targetSize / 2} y={y - targetSize / 2} size={targetSize}>
        {slot}
      </MemoDot>
    );
  }

  s /= 2;

  return (
    <div>
      <MemoSierpinskiTriangle x={x} y={y - s / 2} s={s}>
        {slot}
      </MemoSierpinskiTriangle>
      <MemoSierpinskiTriangle x={x - s} y={y + s / 2} s={s}>
        {slot}
      </MemoSierpinskiTriangle>
      <MemoSierpinskiTriangle x={x + s} y={y + s / 2} s={s}>
        {slot}
      </MemoSierpinskiTriangle>
    </div>
  );
});

const MemoSierpinskiTriangle = memo(
  SierpinskiTriangle,
  (p, n) => p.x !== n.x || p.y !== n.y || p.s !== n.s || Text(p.slot) !== Text(n.slot),
);

type AppProps = {
  elapsed: number;
};

const App = createComponent<AppProps>(props => {
  const [seconds, setSeconds] = useState(0, TaskPriority.LOW);
  const elapsed = props.elapsed;
  const t = (elapsed / 1000) % 10;
  const scale = 1 + (t > 5 ? 10 - t : t) / 10;

  useEffect(() => {
    setInterval(() => tick(), 1000);
  }, []);

  const tick = useCallback(() => setSeconds(seconds => (seconds % 10) + 1), []);

  const containerStyle = `
    position: absolute;
    transform-origin: 0 0;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    background-color: #eee;
    transform: ${'scaleX(' + scale / 2.1 + ') scaleY(0.7) translateZ(0.1px)'};
    zoom: 1;
  `;

  return (
    <main style={containerStyle}>
      <div>
        <MemoSierpinskiTriangle x={0} y={0} s={1000}>
          {seconds}
        </MemoSierpinskiTriangle>
      </div>
    </main>
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
