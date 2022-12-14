import {
  h,
  Fragment,
  createComponent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useReactiveState,
  useRef,
  type DarkElement,
  type MutableRef,
  type Ref,
  type ComponentFactory,
  type StandardComponentProps,
} from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';

type Item = {
  id: number;
  name: string;
};

function randomize(list: Array<Item>) {
  let currentIndex = list.length;
  let randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];
  }

  return list;
}

const shuffle = (count: number) => {
  let nextId = 0;
  const items = Array(count)
    .fill(0)
    .map(() => ({
      id: ++nextId,
      name: `${nextId}`,
    }));
  const list = randomize(items);

  return list;
};

const forceBrowserReflow = () => document.body.clientHeight;

type AnimatedListProps<T = unknown> = {
  items: Array<T>;
  getKey: (x: T) => Key;
  duration?: number;
  slot: (options: AnimatedListSlotOptions<T>) => DarkElement;
};

type Key = string | number;

type AnimatedListSlotOptions<T> = {
  items: Array<T>;
  containerRef: MutableRef<HTMLElement>;
  itemRef: (idx: number, key: Key) => (ref: HTMLElement) => void;
};

const XAnimatedList = createComponent<AnimatedListProps>(({ items: xItems, getKey, duration = 1000, slot }) => {
  const [items, setItems] = useState(xItems);
  const containerRef = useRef<HTMLElement>(null);
  const scope = useMemo<Scope>(
    () => ({
      refs: { indexed: {}, keyed: {} },
      rects: {},
      items,
      timerId: null,
      timerId2: null,
      firstRender: true,
      isTransition: false,
    }),
    [],
  );

  useEffect(() => {
    const setRects = () => {
      let idx = 0;

      for (const node of Array.from(containerRef.current.children)) {
        scope.rects[idx] = node.getBoundingClientRect();
        idx++;
      }
    };

    setRects();
    window.addEventListener('resize', setRects);

    return () => window.removeEventListener('resize', setRects);
  }, []);

  useLayoutEffect(() => {
    if (scope.firstRender) return;
    scope.isTransition = true;
    !scope.timerId && addStyles(items, true);
    scope.items = xItems;
    requestAnimationFrame(() => {
      forceBrowserReflow();
      addStyles(xItems, false);
    });
  }, [xItems]);

  useEffect(() => {
    if (scope.firstRender) return;
    removeStyles(items);
  }, [items]);

  useEffect(() => {
    scope.firstRender = false;
  }, [items]);

  const addStyles = (items: Array<unknown>, mount: boolean) => {
    let idx = 0;

    for (const item of items) {
      const rect = scope.rects[idx];
      const key = getKey(item);
      const ref = scope.refs.keyed[key];

      ref.style.setProperty('position', 'absolute');
      ref.style.setProperty('width', `${rect.width}px`);
      ref.style.setProperty('height', `${rect.height}px`);
      ref.style.setProperty('transform', `translate(${rect.left}px, ${rect.top}px)`);

      if (!mount) {
        ref.style.setProperty(
          'transition',
          `transform ${duration}ms ease-in-out, opacity ${duration / 2}ms ease-in-out`,
        );
        ref.style.setProperty('opacity', `0.5`);
      }

      idx++;
    }

    !mount && scope.timerId && window.clearTimeout(scope.timerId);
    scope.timerId = window.setTimeout(() => {
      scope.timerId = null;
      setItems(scope.items);
    }, duration);
  };

  const removeStyles = (items: Array<unknown>) => {
    for (const item of items) {
      const key = getKey(item);
      const ref = scope.refs.keyed[key];

      ref.style.setProperty('transition', `opacity ${duration / 2}ms ease-in-out`);
      ref.style.setProperty('opacity', `1`);
      ref.style.removeProperty('position');
      ref.style.removeProperty('width');
      ref.style.removeProperty('height');
      ref.style.removeProperty('transform');
    }

    scope.isTransition = false;

    scope.timerId2 && window.clearTimeout(scope.timerId2);
    scope.timerId2 = window.setTimeout(() => {
      scope.timerId2 = null;
      if (scope.isTransition) return;
      for (const item of items) {
        const key = getKey(item);
        const ref = scope.refs.keyed[key];

        ref.removeAttribute('style');
      }
    }, duration / 2);
  };

  const itemRef = (idx: number, key: Key) => (ref: HTMLElement) => {
    scope.refs.indexed[idx] = ref;
    scope.refs.keyed[key] = ref;
  };

  return slot({ items, containerRef, itemRef });
});

type Scope<T = unknown> = {
  refs: {
    indexed: Record<number, HTMLElement>;
    keyed: Record<number, HTMLElement>;
  };
  rects: Record<number, DOMRect>;
  items: Array<T>;
  timerId: number;
  timerId2: number;
  firstRender: boolean;
  isTransition: boolean;
};

type MergedProps<T> = AnimatedListProps<T> & StandardComponentProps;

const AnimatedList = XAnimatedList as <T>(props?: MergedProps<T>, ref?: Ref) => ComponentFactory<MergedProps<T>>;

// usage

const App = createComponent(() => {
  const state = useReactiveState({ items: shuffle(100) });

  const handleShuffle = () => {
    state.items = shuffle(state.items.length);
  };

  return (
    <>
      <div class='content'>
        <AnimatedList items={state.items} getKey={x => x.id} duration={1000}>
          {({ items, containerRef, itemRef }) => {
            return (
              <div ref={containerRef} class='grid'>
                {items.map((x, idx) => {
                  const key = x.id;

                  return (
                    <div ref={itemRef(idx, key)} key={key} class='grid-item'>
                      <span>{x.name}</span>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </AnimatedList>
        <div class='button-layout'>
          <button class='button' onClick={handleShuffle}>
            shuffle
          </button>
        </div>
      </div>
    </>
  );
});

createRoot(document.getElementById('root')).render(<App />);
