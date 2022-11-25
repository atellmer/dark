/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { h, createComponent, useState, useRef, useEffect, useMemo, DarkElement, batch } from '@dark-engine/core';
import { createRoot, SyntheticEvent, useStyle } from '@dark-engine/platform-browser';

type ID = string | number;

type SurfaceProps = {
  slot: (options: SurfaceSlotOptions) => DarkElement;
};

type SurfaceSlotOptions = {
  isDragging: boolean;
  activeDraggableID: ID | null;
  setActiveDraggableID: (value: ID | null) => void;
  setIsDragging: (value: boolean) => void;
};

const Surface = createComponent<SurfaceProps>(({ slot }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDraggableID, setActiveDraggableID] = useState<ID | null>(null);
  const style = useStyle(styled => ({
    root: styled`
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      border: 1px solid red;
      background-color: #fafafa;
    `,
  }));

  useEffect(() => {
    const handleEvent = () => {
      batch(() => {
        setIsDragging(false);
        setActiveDraggableID(null);
      });
    };

    document.addEventListener('mouseup', handleEvent);
    document.addEventListener('touchend', handleEvent);

    return () => {
      document.removeEventListener('mouseup', handleEvent);
      document.removeEventListener('touchend', handleEvent);
    };
  }, []);

  return (
    <div style={style.root}>
      {slot({
        isDragging,
        activeDraggableID,
        setActiveDraggableID,
        setIsDragging,
      })}
    </div>
  );
});

type DraggableProps = {
  draggableID: ID;
  activeDraggableID: ID | null;
  isDragging: boolean;
  slot: DarkElement;
  setActiveDraggableID: (value: ID | null) => void;
  setIsDragging: (value: boolean) => void;
};

const Draggable = createComponent<DraggableProps>(
  ({ isDragging, draggableID, activeDraggableID, setIsDragging, setActiveDraggableID, slot }) => {
    const [coord, setCoord] = useState({ x: 0, y: 0 });
    const [rect, setRect] = useState<DOMRect | null>(null);
    const scope = useMemo(() => ({ fromResize: false }), []);
    const rootRef = useRef<HTMLElement | null>(null);
    const isActive = isDragging && draggableID === activeDraggableID;
    const style = useStyle(styled => ({
      root: styled`
        position: relative;
        cursor: move;
        display: inline-block;
        transform: translate(${coord.x}px, ${coord.y}px);
        z-index: ${isActive ? 2 : 1};
        user-select: none;
        touch-action: none;
      `,
    }));

    useEffect(() => {
      setRect(rootRef.current!.getBoundingClientRect());
    }, []);

    useEffect(() => {
      if (!scope.fromResize) return;
      setRect(rootRef.current!.getBoundingClientRect());
      scope.fromResize = false;
    }, [scope, scope.fromResize]);

    useEffect(() => {
      const handleEvent = () => {
        scope.fromResize = true;
        setCoord({ x: 0, y: 0 });
      };

      window.addEventListener('resize', handleEvent);
      return () => window.removeEventListener('resize', handleEvent);
    }, [scope]);

    const handleDragStart = () => {
      batch(() => {
        setIsDragging(true);
        setActiveDraggableID(draggableID);
      });
    };

    const handleDrag = (e: SyntheticEvent<MouseEvent | TouchEvent>) => {
      if (!isDragging || draggableID !== activeDraggableID) return;
      const mouseEvent = e.sourceEvent as MouseEvent;
      const touchEvent = e.sourceEvent as TouchEvent;
      const touch = mouseEvent instanceof MouseEvent ? mouseEvent : touchEvent.touches[0];

      if (touch.clientX === 0 || touch.clientY === 0) return;

      const x = touch.clientX - rect!.width / 2 - rect!.left;
      const y = touch.clientY - rect!.height / 2 - rect!.top;

      setCoord({ x, y });
    };

    return (
      <div
        ref={rootRef}
        style={style.root}
        draggable={false}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onMouseMove={handleDrag}
        onTouchMove={handleDrag}>
        {slot}
      </div>
    );
  },
);

const App = createComponent(() => {
  const style = useStyle(styled => ({
    box: styled`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 200px;
      font-size: 5rem;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      margin: 4px;
      color: #000;
    `,
  }));

  return (
    <Surface>
      {({ isDragging, activeDraggableID, setActiveDraggableID, setIsDragging }) => {
        return ['🍉', '🍇', '🍌', '🍒', '🍎'].map((x, idx) => {
          return (
            <Draggable
              key={x}
              draggableID={idx}
              activeDraggableID={activeDraggableID}
              isDragging={isDragging}
              setActiveDraggableID={setActiveDraggableID}
              setIsDragging={setIsDragging}>
              <div style={style.box}>{x}</div>
            </Draggable>
          );
        });
      }}
    </Surface>
  );
});

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
