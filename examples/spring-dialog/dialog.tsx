import { type DarkElement, component, useMemo, useLayoutEffect, useRef, __useSSR as useSSR } from '@dark-engine/core';
import { type DarkJSX, createPortal } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';
import { type SpringValue, Animated, useTransition } from '@dark-engine/animations';

type DialogProps = {
  isOpen: boolean;
  width?: string;
  height?: string;
  slot: DarkElement;
  onRequestClose: () => void;
};

const Dialog = component<DialogProps>(({ isOpen, width = '600px', height = '300px', slot, onRequestClose }) => {
  const { isServer, isSSR } = useSSR();
  const host = useMemo(() => (isServer ? null : document.createElement('div')), []);
  const rootRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => [isOpen].filter(Boolean), [isOpen]);
  const scope = useMemo<Scope>(() => ({ isOpen, container: null }), []);
  const [transition, api] = useTransition<SpringProps, boolean>(
    items,
    x => String(x),
    () => ({
      from: { opacity: 0, scale: 0 },
      enter: { opacity: 1, scale: 1 },
      leave: { opacity: 0, scale: 0 },
      config: () => ({ tension: 160, friction: 24, precision: 4 }),
    }),
  );

  scope.isOpen = isOpen;
  scope.container = rootRef.current;

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

  if (isSSR) return null;

  return createPortal(
    <Container ref={rootRef}>
      {transition(({ spring }) => (
        <Animated spring={spring} fn={styleFn(true, scope)}>
          <Overlay onClick={onRequestClose} />
        </Animated>
      ))}
      {transition(({ spring }) => (
        <Animated spring={spring} fn={styleFn(false, scope)}>
          <Window $width={width} $height={height}>
            {slot}
            <CloseButton onClick={onRequestClose} /> {/*should be last for tab focus*/}
          </Window>
        </Animated>
      ))}
    </Container>,
    host,
  );
});

const styleFn = (isOverlay: boolean, scope: Scope) => (element: HTMLDivElement, value: SpringValue<SpringProps>) => {
  const { opacity, scale } = value;
  const { isOpen, container } = scope;
  const setElementProp = setPropOf(element);
  const removeElementProp = removePropOf(element);

  if (isOverlay) {
    const setContainerProp = container ? setPropOf(container) : null;
    const removeContainerProp = container ? removePropOf(container) : null;

    if (isOpen) {
      opacity < 0.95 && setElementProp('opacity', `${opacity}`);
    } else {
      opacity < 0.95 && setElementProp('opacity', `${opacity}`);
    }

    if (!isOpen) {
      setElementProp('pointer-events', 'none');
      setContainerProp && setContainerProp('pointer-events', 'none');
    } else {
      removeElementProp('pointer-events');
      removeContainerProp && removeContainerProp('pointer-events');
    }
  } else {
    setElementProp('opacity', `${opacity}`);
    setElementProp('transform', `scale(${scale})`);
  }
};

const setPropOf = (element: HTMLElement) => element.style.setProperty.bind(element.style);

const removePropOf = (element: HTMLElement) => element.style.removeProperty.bind(element.style);

type CloseButtonProps = {
  onClick: () => void;
};

const CloseButton = component<CloseButtonProps>(({ onClick }) => {
  return (
    <Button onClick={onClick} aria-label='Close'>
      <svg aria-hidden='true' width='24' height='24' viewBox='0 0 50 50'>
        <path d='M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z' />
      </svg>
    </Button>
  );
});

const Container = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
`;

const Button = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  stroke-width: 4px;
  stroke: #303f9f;
`;

const Window = styled.div<{ $width: string; $height: string } & DarkJSX.Elements['div']>`
  position: relative;
  width: ${p => p.$width};
  min-height: ${p => p.$height};
  max-width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 32px;
  will-change: opacity, transform;
  margin: auto;
  transform-origin: 50% 50%;

  & ${Button} {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 200%;
  inset: 0;
  background-color: #303f9f;
  cursor: pointer;
  will-change: opacity;
`;

type SpringProps = 'opacity' | 'scale';

type Scope = { isOpen: boolean; container: HTMLDivElement };

export { Dialog };
