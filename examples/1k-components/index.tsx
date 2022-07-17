import { startFPSMonitor, startMemMonitor } from 'perf-monitor';
import { interpolateViridis } from 'd3-scale-chromatic';

import { h, createComponent, useState, useMemo, useEffect, useUpdate } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

startFPSMonitor();
startMemMonitor();

const Demo = createComponent(() => {
  const [numPoints, setNumPoints] = useState(1000);
  const update = useUpdate();

  const updateCount = e => {
    setNumPoints(Number(e.target.value));
  };

  return (
    <div class='app-wrapper'>
      <VizDemo count={numPoints} update={update} />
      <div class='controls'>
        # Points
        <input type='range' min={10} max={1000} value={numPoints} onInput={updateCount} />
        {numPoints}
      </div>
      <div class='about'>
        Dark 1k Components Demo based on the Glimmer demo by{' '}
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
  update: () => void;
};

const VizDemo = createComponent<VizDemoProps>(({ count, update }) => {
  const scope = useMemo(() => {
    return {
      layout: 0,
      phyllotaxis: genPhyllotaxis(100),
      grid: genGrid(100),
      wave: genWave(100),
      spiral: genSpiral(100),
      points: [],
      step: 0,
      numSteps: 60 * 2,
    };
  }, []);

  useEffect(() => next(), []);

  useEffect(() => {
    if (count === 0) return;

    scope.phyllotaxis = genPhyllotaxis(count);
    scope.grid = genGrid(count);
    scope.wave = genWave(count);
    scope.spiral = genSpiral(count);

    makePoints(count);
  }, [count]);

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

    scope.points = scope.points.map(point => {
      const newPoint = { ...point };
      newPoint.x = lerp(newPoint, pct, pxProp, nxProp);
      newPoint.y = lerp(newPoint, pct, pyProp, nyProp);

      return newPoint;
    });

    update();
    requestAnimationFrame(() => next());
  };

  const setAnchors = arr => {
    arr.map((p, index) => {
      const [gx, gy] = project(scope.grid(index));
      const [wx, wy] = project(scope.wave(index));
      const [sx, sy] = project(scope.spiral(index));
      const [px, py] = project(scope.phyllotaxis(index));

      Object.assign(p, { gx, gy, wx, wy, sx, sy, px, py });
    });

    scope.points = arr;
  };

  const makePoints = count => {
    const newPoints = [];
    for (let i = 0; i < count; i++) {
      newPoints.push({
        x: 0,
        y: 0,
        color: interpolateViridis(i / count),
      });
    }
    setAnchors(newPoints);
  };

  const renderPoint = (point, idx) => {
    return <Point key={idx} x={point.x} y={point.y} color={point.color} />;
  };

  return (
    <svg class='demo'>
      <g>{scope.points.map((x, idx) => renderPoint(x, idx))}</g>
    </svg>
  );
});

type PointProps = {
  x: number;
  y: number;
  color: string;
};

const Point = createComponent<PointProps>(({ x, y, color }) => {
  return <rect class='point' transform={`translate(${Math.floor(x)}, ${Math.floor(y)})`} fill={color} />;
});

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
