import { h, Fragment, component, useEffect, useLayoutEffect, useState, useMemo, useRef } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { SpringValue, Animated, useTransition } from '@dark-engine/animations';

function shuffle<T = unknown>(list: Array<T>) {
  let currentIndex = list.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];
  }

  return [...list];
}

function useMedia(queries: string[], values: number[], defaultValue: number) {
  const match = () => values[queries.findIndex(q => matchMedia(q).matches)] || defaultValue;
  const [value, set] = useState(match);

  useEffect(() => {
    const handler = () => set(match);

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);

  return value;
}

type GridItem = {
  width?: number;
  height: number;
  x?: number;
  y?: number;
  src: string;
};

type DataItem = Pick<GridItem, 'src' | 'height'>;

const data: Array<DataItem> = [
  { src: 'https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg', height: 150 },
  { src: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg', height: 300 },
  { src: 'https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg', height: 300 },
  { src: 'https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg', height: 300 },
  { src: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg', height: 300 },
  { src: 'https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg', height: 300 },
  { src: 'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg', height: 200 },
  { src: 'https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg', height: 300 },
  { src: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg', height: 200 },
  { src: 'https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg', height: 400 },
  { src: 'https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg', height: 200 },
  { src: 'https://images.pexels.com/photos/249074/pexels-photo-249074.jpeg', height: 150 },
  { src: 'https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg', height: 400 },
  { src: 'https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg', height: 200 },
];

type SpringProps = 'x' | 'y' | 'width' | 'height' | 'opacity';

const App = component(() => {
  const ref = useRef<HTMLDivElement>(null);
  const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2);
  const [items, setItems] = useState(data);
  const [width, setWidth] = useState(0);
  const [heights, gridItems] = useMemo(() => {
    const heights = new Array(columns).fill(0); // Each column gets a height starting with zero
    const gridItems: Array<GridItem> = items.map(child => {
      const column = heights.indexOf(Math.min(...heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
      const x = Number(((width / columns) * column).toFixed(0)); // x = container width / number of columns * column index,
      const y = (heights[column] += child.height / 2) - child.height / 2; // y = it's just the height of the current column

      return {
        ...child,
        x,
        y,
        width: Number((width / columns).toFixed(0)),
        height: child.height / 2,
      };
    });

    return [heights, gridItems];
  }, [columns, items, width]);

  const [transition] = useTransition<SpringProps, GridItem>(
    gridItems,
    x => x.src,
    (_, { x, y, width, height }) => ({
      from: { x, y, width, height, opacity: 0 },
      enter: { x, y, width, height, opacity: 1 },
      update: { x, y, width, height, opacity: 1 },
      leave: { x, y, width, height: 0, opacity: 0 },
      config: () => ({ mass: 5, tension: 500, friction: 100 }),
      trail: 25,
    }),
  );

  useEffect(() => {
    const t = setInterval(() => setItems(shuffle), 2000);

    return () => clearInterval(t);
  }, []);

  useLayoutEffect(() => {
    const setSize = () => {
      const { width } = ref.current.getBoundingClientRect();

      setWidth(width);
    };

    setSize();

    window.addEventListener('resize', setSize);

    return () => window.removeEventListener('resize', setSize);
  }, []);

  return (
    <>
      <div ref={ref} class='list' style={{ height: Math.max(...heights) + 'px' }}>
        {transition(({ spring, item }) => {
          return (
            <Animated spring={spring} fn={styleFn}>
              <div>
                <div style={{ 'background-image': `url(${item.src}?auto=compress&dpr=2&h=500&w=500)` }} />
              </div>
            </Animated>
          );
        })}
      </div>
    </>
  );
});

const styleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  const { x, y, width, height, opacity } = value;
  const setProp = setPropOf(element);

  setProp('width', `${width}px`);
  setProp('height', `${height}px`);
  setProp('opacity', `${opacity}`);
  setProp('transform', `translate3d(${x}px, ${y}px, 0)`);
};

const setPropOf = (element: HTMLElement) => (k: string, v: string) => element.style.setProperty(k, v);

createRoot(document.getElementById('root')).render(<App />);
