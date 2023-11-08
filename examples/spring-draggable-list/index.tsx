import { h, component, useMemo, useLayoutEffect } from '@dark-engine/core';
import { createRoot, type SyntheticEvent } from '@dark-engine/platform-browser';
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
const NOISE = 10;
type SpringProps = 'y' | 'scale' | 'shadow';

const createConfig =
  (order: Array<number>, isMove: boolean, activeIdx = -1, y = 0) =>
  (idx: number) => {
    const isActive = idx === activeIdx;
    const y1 = order.indexOf(idx) * FULL_HEIGHT;
    const y2 = isActive && isMove ? y : y1;
    const scale = isActive ? 1.1 : 1;
    const shadow = isActive ? 16 : 1;
    const options: BaseOptions<SpringProps> = {
      from: { y: y1, scale: 1, shadow: 1 },
      to: { y: y2, scale, shadow },
      immediate: key => isActive && key === 'y',
      config: () => ({ tension: 300, friction: 50, precision: 4 }),
    };

    return options;
  };

const App = component(() => {
  const size = 4;
  const scope = useMemo(
    () => ({
      isActive: false,
      activeIdx: -1,
      order: range(size),
      originalOrder: null,
      initialY: null,
      time: null,
    }),
    [],
  );
  const [springs, api] = useSprings(size, idx => ({
    ...createConfig(scope.order, false)(idx),
    onEnd: () => {
      if (!scope.isActive && idx === scope.activeIdx) {
        scope.activeIdx = -1;
        scope.initialY = null;
      }
    },
  }));

  useLayoutEffect(() => {
    const handleDrag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!scope.isActive) return;
      const pageY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
      const { activeIdx, originalOrder, initialY } = scope;
      const movement = Number((pageY - initialY).toFixed(0));
      if (Math.abs(movement) < NOISE) return;
      const idx = originalOrder.indexOf(activeIdx);
      const y = idx * FULL_HEIGHT + movement;
      const nextIdx = clamp(Math.round(y / FULL_HEIGHT), 0, size - 1);

      scope.order = reorder(scope.originalOrder, idx, nextIdx);
      api.start(createConfig(scope.order, true, activeIdx, y) as StartFn<SpringProps>);
    };
    document.addEventListener('pointermove', handleDrag);
    document.addEventListener('touchmove', handleDrag);
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('touchmove', handleDrag);
    };
  }, []);

  useLayoutEffect(() => {
    const handleDragEnd = () => {
      scope.isActive = false;
      if (performance.now() - scope.time < 100) {
        setTimeout(() => {
          api.start(createConfig(scope.order, false) as StartFn<SpringProps>);
        }, 16);
      } else {
        api.start(createConfig(scope.order, false) as StartFn<SpringProps>);
      }
    };
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    return () => {
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  });

  const handleDragStart = (idx: number) => (e: SyntheticEvent<MouseEvent | TouchEvent>) => {
    const { sourceEvent } = e;
    const pageY = sourceEvent instanceof MouseEvent ? sourceEvent.pageY : sourceEvent.touches[0].pageY;

    scope.time = performance.now();
    scope.isActive = true;
    scope.activeIdx = idx;
    scope.originalOrder = scope.order;
    scope.initialY = pageY;
    api.start(createConfig(scope.order, false, idx) as StartFn<SpringProps>);
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
            <div
              key={idx}
              class='item'
              style={style}
              onMouseDown={handleDragStart(idx)}
              onTouchStart={handleDragStart(idx)}>
              {idx + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
});

createRoot(document.getElementById('root')).render(<App />);
