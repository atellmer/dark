import { type DarkElement, component, useMemo, useRef, useLayoutEffect } from '@dark-engine/core';
import { useLocation } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';
import { type SpringValue, Animated, useTransition } from '@dark-engine/animations';

type PageTransitionProps = {
  slot: DarkElement;
};

const PageTransition = component<PageTransitionProps>(({ slot }) => {
  const { pathname } = useLocation();
  const scope = useMemo(() => ({ pathname, slots: {} }), []);
  const items = useMemo(() => [pathname], [pathname]);
  const rootRef = useRef<HTMLDivElement>();
  const [transition, api] = useTransition(
    items,
    x => x,
    () => ({
      from: { y: 100, opacity: 0, scale: 1 },
      enter: { y: 0, opacity: 0, scale: 1 },
      leave: { y: 0, opacity: 0.4, scale: 0.8 },
      config: () => ({ tension: 45, friction: 28, mass: 5 }),
    }),
  );

  scope.pathname = pathname;
  scope.slots[pathname] = slot;

  useLayoutEffect(() => {
    const node = rootRef.current;
    const fns = [
      api.on('series-start', () => node.style.setProperty('pointer-events', 'none')),
      api.on('item-change', x => {
        if (scope.pathname === x.key && x.value.y < 5) {
          node.removeAttribute('style');
        }
      }),
    ];

    return () => fns.forEach(x => x());
  }, []);

  return (
    <div ref={rootRef}>
      {transition(({ spring, item }) => {
        return (
          <Animated spring={spring} fn={styleFn}>
            <Item>{scope.slots[item]}</Item>
          </Animated>
        );
      })}
    </div>
  );
});

const styleFn = (element: HTMLDivElement, value: SpringValue<'y' | 'opacity' | 'scale'>) => {
  element.style.setProperty('transform', `translate3d(0, ${value.y}vh, 0) scale(${value.scale})`);
  element.style.setProperty('--opacity', `${value.opacity}`);
};

const Item = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, var(--opacity));
    pointer-events: none;
  }
`;

export { PageTransition };
