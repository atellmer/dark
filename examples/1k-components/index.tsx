import { startFPSMonitor, startMemMonitor } from 'perf-monitor';
import { interpolateViridis } from 'd3-scale-chromatic';

import { h, View, component, useState, useEffect, useMemo, useUpdate, TaskPriority, Flag } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

startFPSMonitor();
startMemMonitor();

const Demo = component(() => {
  const [numPoints, setNumPoints] = useState(1000, { priority: TaskPriority.HIGH });

  const updateCount = e => {
    setNumPoints(Number(e.target.value));
  };

  return (
    <div class='app-wrapper'>
      <VizDemo count={numPoints} />
      <div class='controls'>
        # Points
        <input type='range' min={10} max={10000} value={numPoints} onInput={updateCount} />
        {numPoints}
      </div>
      <div class='about'>
        Dark 1k Components Demo based on the{' '}
        <a href='https://infernojs.github.io/inferno/1kcomponents/' target='_blank'>
          {' '}
          Inferno demo
        </a>{' '}
        based on Glimmer demo by{' '}
        <a href='http://mlange.io' target='_blank'>
          Michael Lange
        </a>
        .
      </div>
    </div>
  );
});

const Layout = {
  PHYLLOTAXIS: 0,
  GRID: 1,
  WAVE: 2,
  SPIRAL: 3,
};

const LAYOUT_ORDER = [Layout.PHYLLOTAXIS, Layout.SPIRAL, Layout.PHYLLOTAXIS, Layout.GRID, Layout.WAVE];

type VizDemoProps = {
  count: number;
};

const VizDemo = component<VizDemoProps>(({ count }) => {
  const update = useUpdate({ forceAsync: true });
  const scope = useMemo(
    () => ({
      layout: 0,
      phyllotaxis: genPhyllotaxis(100),
      grid: genGrid(100),
      wave: genWave(100),
      spiral: genSpiral(100),
      points: [] as Array<Point>,
      step: 0,
      numSteps: 60 * 2,
    }),
    [],
  );

  useEffect(() => {
    if (count === 0) return;

    scope.phyllotaxis = genPhyllotaxis(count);
    scope.grid = genGrid(count);
    scope.wave = genWave(count);
    scope.spiral = genSpiral(count);
    scope.points = makePoints(count, scope);
  }, [count]);

  useEffect(() => {
    next();
  }, []);

  const next = () => {
    scope.step = (scope.step + 1) % scope.numSteps;

    if (scope.step === 0) {
      scope.layout = (scope.layout + 1) % LAYOUT_ORDER.length;
    }

    // Clamp the linear interpolation at 80% for a pause at each finished layout state
    const pct = Math.min(1, scope.step / (scope.numSteps * 0.8));

    const currentLayout = LAYOUT_ORDER[scope.layout];
    const nextLayout = LAYOUT_ORDER[(scope.layout + 1) % LAYOUT_ORDER.length];

    // Keep these redundant computations out of the loop
    const pxProp = xForLayout(currentLayout);
    const nxProp = xForLayout(nextLayout);
    const pyProp = yForLayout(currentLayout);
    const nyProp = yForLayout(nextLayout);

    for (const point of scope.points) {
      point.x = lerp(point, pct, pxProp, nxProp);
      point.y = lerp(point, pct, pyProp, nyProp);
    }

    update();

    requestAnimationFrame(() => {
      next();
    });
  };

  return (
    <svg class='demo' flag={flag}>
      <g flag={flag}>{map(scope.points, renderPoint)}</g>
    </svg>
  );
});

const flag = { [Flag.NM]: true };

const setAnchors = (arr: Array<Point>, scope: any) => {
  arr.map((p, index) => {
    const [gx, gy] = project(scope.grid(index));
    const [wx, wy] = project(scope.wave(index));
    const [sx, sy] = project(scope.spiral(index));
    const [px, py] = project(scope.phyllotaxis(index));

    Object.assign(p, { gx, gy, wx, wy, sx, sy, px, py });
  });

  return arr;
};

const makePoints = (count: number, scope: any) => {
  const newPoints: Array<Point> = [];

  for (let i = 0; i < count; i++) {
    newPoints.push({
      x: 0,
      y: 0,
      color: interpolateViridis(i / count),
    });
  }

  return setAnchors(newPoints, scope);
};

const renderPoint = (point: Point, idx: number) => {
  return View({
    as: 'rect',
    class: 'point',
    key: idx,
    flag,
    transform: `translate(${Math.floor(point.x)}, ${Math.floor(point.y)})`,
    fill: point.color,
  });
};

const map = (items: Array<Point>, cb: (x: any, idx: number) => any) => {
  const points = [];

  for (let i = 0; i < items.length; i++) {
    points.push(cb(items[i], i));
  }

  return points;
};

type Point = {
  x: number;
  y: number;
  color: string;
};

const theta = Math.PI * (3 - Math.sqrt(5));

function xForLayout(layout) {
  switch (layout) {
    case Layout.PHYLLOTAXIS:
      return 'px';
    case Layout.GRID:
      return 'gx';
    case Layout.WAVE:
      return 'wx';
    case Layout.SPIRAL:
      return 'sx';
  }
}

function yForLayout(layout) {
  switch (layout) {
    case Layout.PHYLLOTAXIS:
      return 'py';
    case Layout.GRID:
      return 'gy';
    case Layout.WAVE:
      return 'wy';
    case Layout.SPIRAL:
      return 'sy';
  }
}

function lerp(obj, percent, startProp, endProp) {
  const px = obj[startProp];

  return px + (obj[endProp] - px) * percent;
}

function genPhyllotaxis(n) {
  return i => {
    const r = Math.sqrt(i / n);
    const th = i * theta;

    return [r * Math.cos(th), r * Math.sin(th)];
  };
}

function genGrid(n) {
  const rowLength = Math.round(Math.sqrt(n));

  return i => [-0.8 + (1.6 / rowLength) * (i % rowLength), -0.8 + (1.6 / rowLength) * Math.floor(i / rowLength)];
}

function genWave(n) {
  const xScale = 2 / (n - 1);
  return i => {
    const x = -1 + i * xScale;

    return [x, Math.sin(x * Math.PI * 3) * 0.3];
  };
}

function genSpiral(n) {
  return i => {
    const t = Math.sqrt(i / (n - 1));
    const phi = t * Math.PI * 10;

    return [t * Math.cos(phi), t * Math.sin(phi)];
  };
}

function scale(magnitude, vector) {
  return vector.map(p => p * magnitude);
}

function translate(translation, vector) {
  return vector.map((p, i) => p + translation[i]);
}

function project(vector) {
  const wh = window.innerHeight / 2;
  const ww = window.innerWidth / 2;

  return translate([ww, wh], scale(Math.min(wh, ww), vector));
}

render(<Demo />, document.getElementById('root'));
