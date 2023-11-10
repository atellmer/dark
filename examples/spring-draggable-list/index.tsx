import { h, component, useMemo, useLayoutEffect } from '@dark-engine/core';
import { createRoot, type SyntheticEvent } from '@dark-engine/platform-browser';
import { type SpringValue, type BaseOptions, type StartFn, Animated, useSprings, range } from '@dark-engine/animations';

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
const height = HEIGHT;
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
    () => ({ isActive: false, activeIdx: -1, order: range(size), originalOrder: null, initialY: null }),
    [],
  );
  const [items, api] = useSprings(size, idx => createConfig(scope.order, false)(idx));

  useLayoutEffect(() => {
    const handleDrag = (e: PointerEvent) => {
      e.preventDefault();
      if (!scope.isActive) return;
      const pageY = e.pageY;
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
    return () => document.removeEventListener('pointermove', handleDrag);
  }, []);

  useLayoutEffect(() => {
    const handleDragEnd = () => {
      scope.isActive = false;
      api.start(createConfig(scope.order, false) as StartFn<SpringProps>);
    };
    document.addEventListener('pointerup', handleDragEnd);
    return () => document.removeEventListener('pointerup', handleDragEnd);
  });

  useLayoutEffect(() => {
    const off = api.on('series-end', () => {
      scope.activeIdx = -1;
      scope.initialY = null;
    });
    return off;
  }, []);

  const handleDragStart = (idx: number) => (e: SyntheticEvent<PointerEvent>) => {
    e.stopPropagation();
    const { sourceEvent } = e;
    const pageY = sourceEvent.pageY;

    scope.isActive = true;
    scope.activeIdx = idx;
    scope.originalOrder = scope.order;
    scope.initialY = pageY;
    api.start(createConfig(scope.order, false, idx) as StartFn<SpringProps>);
  };

  return (
    <div class='container'>
      <div class='content'>
        {items.map((item, idx) => {
          return (
            <Animated key={idx} item={item} style={styleFn(idx, height, scope)}>
              <div class='item' onPointerDown={handleDragStart(idx)}>
                {idx + 1}
              </div>
            </Animated>
          );
        })}
      </div>
    </div>
  );
});

const styleFn =
  (idx: number, height: number, scope: { activeIdx: number }) =>
  (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
    const { y, scale, shadow } = value;
    const setProp = setPropOf(element);

    setProp('height', `${height}px`);
    setProp('z-index', `${idx === scope.activeIdx ? 1 : 0}`);
    setProp('transform', `translate3d(0, ${y}px, 0) scale(${scale})`);
    setProp('box-shadow', `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`);
  };

const setPropOf = (element: HTMLDivElement) => (k: string, v: string) => element.style.setProperty(k, v);

createRoot(document.getElementById('root')).render(<App />);
