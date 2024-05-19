import { type DarkElement, component, useMemo, useLayoutEffect } from '@dark-engine/core';
import { createPortal } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';
import { type SpringValue, Animated, useTransition } from '@dark-engine/animations';

type SpringProps = 'opacity' | 'scale';

type DialogProps = {
  isOpen: boolean;
  slot: DarkElement;
  onRequestClose: () => void;
};

const Dialog = component<DialogProps>(({ isOpen, slot, onRequestClose }) => {
  const host = useMemo(() => document.createElement('div'), []);
  const items = useMemo(() => [isOpen].filter(Boolean), [isOpen]);
  const scope = useMemo(() => ({ isOpen }), []);
  const [transition, api] = useTransition<SpringProps, boolean>(
    items,
    x => String(x),
    () => ({
      from: { opacity: 0, scale: 0 },
      enter: { opacity: 1, scale: 1 },
      leave: { opacity: 0, scale: 0 },
      config: () => ({ tension: 160, friction: 24 }),
    }),
  );

  scope.isOpen = isOpen;

  useLayoutEffect(() => {
    const offs = [
      api.on('series-start', () => scope.isOpen && document.body.appendChild(host)),
      api.on('series-end', () => !scope.isOpen && host.remove()),
    ];

    return () => {
      offs.forEach(x => x());
      host.remove();
    };
  }, []);

  return createPortal(
    <Container>
      {transition(({ spring }) => (
        <Animated spring={spring} fn={styleFn(true)}>
          <Overlay onClick={onRequestClose} />
        </Animated>
      ))}
      {transition(({ spring }) => (
        <Animated spring={spring} fn={styleFn(false)}>
          <Content>{slot}</Content>
        </Animated>
      ))}
    </Container>,
    host,
  );
});

const styleFn = (isOverlay: boolean) => (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  const { opacity, scale } = value;
  const setProp = setPropOf(element);

  if (isOverlay) {
    setProp('opacity', `${opacity}`);

    if (opacity < 0.5) {
      setProp('pointer-events', `none`);
    } else {
      element.style.removeProperty('pointer-events');
    }
  } else {
    setProp('opacity', `${opacity}`);
    setProp('transform', `scale(${scale})`);
  }
};

const setPropOf = (element: HTMLElement) => element.style.setProperty.bind(element.style);

const Container = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
`;

const Content = styled.div`
  position: relative;
  width: 600px;
  height: 300px;
  max-width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 16px;
  will-change: opacity, transform;
  margin: auto;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  background-color: #303f9f;
  cursor: pointer;
`;

export { Dialog };
