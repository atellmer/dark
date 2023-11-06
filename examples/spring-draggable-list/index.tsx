import { h, component, useMemo, useLayoutEffect } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { useSprings, range, type BaseOptions, type StartFn } from '@dark-engine/animations';

function reorder(arr: Array<any>, from: number, to: number) {
  const buffer = arr.slice(0);
  const val = buffer[from];
  buffer.splice(from, 1);
  buffer.splice(to, 0, val);
  return buffer;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

const HEIGHT = 90;
const MARGINS = 10;
const FULL_HEIGHT = HEIGHT + MARGINS;
type SpringProps = 'y' | 'scale' | 'shadow';

const createConfig =
  (order: Array<number>, activeIdx = -1, y = 0) =>
  (idx: number) => {
    const isActive = idx === activeIdx;
    const y1 = order.indexOf(idx) * FULL_HEIGHT;
    const y2 = isActive ? y : y1;
    const scale = isActive ? 1.1 : 1;
    const shadow = isActive ? 16 : 1;
    const options: BaseOptions<SpringProps> = {
      from: { y: y1, scale: 1, shadow: 1 },
      to: { y: y2, scale, shadow },
      immediate: key => isActive && key === 'y',
      config: () => ({ tension: 250, friction: 50 }),
    };

    return options;
  };

const App = component(() => {
  const size = 4;
  const scope = useMemo(
    () => ({ isActive: false, activeIdx: -1, order: range(size), originalOrder: null, initialY: null }),
    [],
  );
  const [springs, api] = useSprings(size, idx => ({
    ...createConfig(scope.order)(idx),
    onEnd: () => {
      if (!scope.isActive && idx === scope.activeIdx) {
        scope.activeIdx = -1;
        scope.initialY = null;
      }
    },
  }));

  useLayoutEffect(() => {
    const handler = (e: PointerEvent) => {
      e.preventDefault();
      if (!scope.isActive) return;
      if (e.type === 'pointerdown') scope.initialY = e.pageY;
      const { activeIdx, originalOrder, initialY } = scope;
      const movement = Number((e.pageY - initialY).toFixed(0));
      const idx = originalOrder.indexOf(activeIdx);
      const y = idx * FULL_HEIGHT + movement;
      const nextIdx = clamp(Math.round(y / FULL_HEIGHT), 0, size - 1);

      scope.order = reorder(scope.originalOrder, idx, nextIdx);
      api.start(createConfig(scope.order, activeIdx, y) as StartFn<SpringProps>);
    };
    document.addEventListener('pointerdown', handler);
    document.addEventListener('pointermove', handler);
    return () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('pointermove', handler);
    };
  }, []);

  useLayoutEffect(() => {
    const handler = () => {
      scope.isActive = false;
      api.start(createConfig(scope.order) as StartFn<SpringProps>);
    };
    document.addEventListener('pointerup', handler);
    return () => document.removeEventListener('pointerup', handler);
  });

  const handleSetActiveIdx = (idx: number) => {
    scope.isActive = true;
    scope.activeIdx = idx;
    scope.originalOrder = scope.order;
  };

  return (
    <div class='container'>
      <div class='content'>
        {springs.map(({ scale, shadow, y }, idx) => {
          const isActive = idx === scope.activeIdx;
          const zIndex = isActive ? 1 : 0;
          const style = `
            height: ${HEIGHT}px;
            transform: translate3d(0, ${y}px, 0) scale(${scale});
            box-shadow: rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px;
            z-index: ${zIndex};
          `;

          return (
            <div key={idx} class='item' style={style} onPointerDown={() => handleSetActiveIdx(idx)}>
              {idx}
            </div>
          );
        })}
      </div>
    </div>
  );
});

createRoot(document.getElementById('root')).render(<App />);
