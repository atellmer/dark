import { component, useState } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { type SpringValue, Animated, useTransition, useSpring, useChain, preset } from '@dark-engine/animations';

type SpringProps = 'size' | 'green' | 'blue';
type TransitionProps = 'opacity' | 'scale';

const App = component(() => {
  const [isOpen, setIsOpen] = useState<boolean>(null);
  const [spring, springApi] = useSpring<SpringProps>(
    {
      from: { size: 20, green: 105, blue: 180 },
      to: { size: isOpen ? 100 : 20, green: isOpen ? 255 : 105, blue: isOpen ? 255 : 180 },
      config: () => preset('stiff'),
    },
    [isOpen],
  );
  const [transition, transitionApi] = useTransition<TransitionProps, typeof data[0]>(
    isOpen ? data : [],
    x => x.name,
    () => ({
      from: { opacity: 0, scale: 0 },
      enter: { opacity: 1, scale: 1 },
      leave: { opacity: 0, scale: 0 },
      trail: 400 / data.length,
    }),
  );

  useChain(isOpen ? [springApi, transitionApi] : [transitionApi, springApi], [0, isOpen ? 0.1 : 0.6]);

  //console.log('render');

  return (
    <>
      <div class='wrapper'>
        <Animated spring={spring} fn={springStyleFn}>
          <div class='container' onClick={() => setIsOpen(x => !x)}>
            {transition(({ spring, item }) => {
              return (
                <Animated spring={spring} fn={transitionStyleFn(item)}>
                  <div class='item' />
                </Animated>
              );
            })}
          </div>
        </Animated>
      </div>
    </>
  );
});

const springStyleFn = (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  const { size, green, blue } = value;
  const setProp = setPropOf(element);

  setProp('width', `${size}%`);
  setProp('height', `${size}%`);
  setProp('background-color', `rgb(255, ${green}, ${blue})`);
};

const transitionStyleFn = (item: DataItem) => (element: HTMLDivElement, value: SpringValue<TransitionProps>) => {
  const { opacity, scale } = value;
  const setProp = setPropOf(element);

  setProp('opacity', `${opacity}`);
  setProp('transform', `scale(${scale})`);
  setProp('background-image', `${item.css}`);
};

const setPropOf = (element: HTMLDivElement) => (k: string, v: string) => element.style.setProperty(k, v);

type DataItem = {
  name: string;
  description: string;
  css: string;
  height: number;
};

const data: Array<DataItem> = [
  {
    name: 'Rare Wind',
    description: '#a8edea → #fed6e3',
    css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    height: 200,
  },
  {
    name: 'Saint Petersburg',
    description: '#f5f7fa → #c3cfe2',
    css: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    height: 400,
  },
  {
    name: 'Deep Blue',
    description: '#e0c3fc → #8ec5fc',
    css: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    height: 400,
  },
  {
    name: 'Ripe Malinka',
    description: '#f093fb → #f5576c',
    css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    height: 400,
  },
  {
    name: 'Perfect White',
    description: '#fdfbfb → #ebedee',
    css: 'linear-gradient(135deg, #E3FDF5 0%, #FFE6FA 100%)',
    height: 400,
  },
  {
    name: 'Near Moon',
    description: '#5ee7df → #b490ca',
    css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
    height: 400,
  },
  {
    name: 'Wild Apple',
    description: '#d299c2 → #fef9d7',
    css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    height: 200,
  },
  {
    name: 'Ladoga Bottom',
    description: '#ebc0fd → #d9ded8',
    css: 'linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)',
    height: 400,
  },
  {
    name: 'Sunny Morning',
    description: '#f6d365 → #fda085',
    css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    height: 200,
  },
  {
    name: 'Lemon Gate',
    description: '#96fbc4 → #f9f586',
    css: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
    height: 400,
  },
  {
    name: 'Salt Mountain',
    description: ' #FFFEFF → #D7FFFE',
    css: 'linear-gradient(135deg, #FFFEFF 0%, #D7FFFE 100%)',
    height: 200,
  },
  {
    name: 'New York',
    description: ' #fff1eb → #ace0f9',
    css: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)',
    height: 400,
  },
  {
    name: 'Soft Grass',
    description: ' #c1dfc4 → #deecdd',
    css: 'linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)',
    height: 400,
  },
  {
    name: 'Japan Blush',
    description: ' #ddd6f3 → #faaca8',
    css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
    height: 200,
  },
];

createRoot(document.getElementById('root')).render(<App />);
