import { h, createComponent, useState, useRef, useEffect, DarkElement, batch } from '@dark-engine/core';
import { createRoot, SyntheticEvent, useStyle } from '@dark-engine/platform-browser';

type SurfaceProps = {
  slot?: (options: SurfaceSlotOptions) => DarkElement;
};

type SurfaceSlotOptions = {
  isDragging: boolean;
  activeDraggableID: string | number;
  setActiveDraggableID: (value: string | number) => void;
  setIsDragging: (value: boolean) => void;
};

const Surface = createComponent<SurfaceProps>(({ slot }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeDraggableID, setActiveDraggableID] = useState(null);
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

    return () => {
      document.removeEventListener('mouseup', handleEvent);
    };
  }, []);

  return <div style={style.root}>{slot({ isDragging, activeDraggableID, setActiveDraggableID, setIsDragging })}</div>;
});

type DraggableProps = {
  draggableID: number | string;
  activeDraggableID: number | string;
  isDragging: boolean;
  setActiveDraggableID: (value: string | number) => void;
  setIsDragging: (value: boolean) => void;
};

const Draggable = createComponent<DraggableProps>(
  ({ isDragging, draggableID, activeDraggableID, setIsDragging, setActiveDraggableID, slot }) => {
    const [coord, setCoord] = useState({ x: 0, y: 0 });
    const [rect, setRect] = useState<DOMRect>(null);
    const rootRef = useRef<HTMLElement>(null);
    const isActive = isDragging && draggableID === activeDraggableID;
    const style = useStyle(styled => ({
      root: styled`
      position: relative;
      cursor: move;
      display: inline-block;
      transform: translate(${coord.x}px, ${coord.y}px);
      z-index: ${isActive ? 10 : 1};
      user-select: none;
    `,
    }));

    useEffect(() => {
      setRect(rootRef.current.getBoundingClientRect());
    }, []);

    const handleDragStart = () => {
      batch(() => {
        setIsDragging(true);
        setActiveDraggableID(draggableID);
      });
    };

    const handleDrag = (e: SyntheticEvent<MouseEvent>) => {
      if (!isDragging || draggableID !== activeDraggableID || e.sourceEvent.x === 0 || e.sourceEvent.y === 0) return;
      const x = e.sourceEvent.x - rect.width / 2 - rect.left;
      const y = e.sourceEvent.y - rect.height / 2 - rect.top;

      setCoord({ x, y });
    };

    return (
      <div ref={rootRef} style={style.root} draggable={false} onMouseDown={handleDragStart} onMouseMove={handleDrag}>
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
      {({ isDragging, activeDraggableID, setActiveDraggableID, setIsDragging }: SurfaceSlotOptions) => {
        return ['🍉', '🍇', '🍌'].map((x, idx) => {
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

const root = createRoot(document.getElementById('root'));

root.render(<App />);
