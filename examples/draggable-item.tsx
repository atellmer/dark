import { h, createComponent, useState, useRef, useEffect } from '@dark-engine/core';
import { createRoot, SyntheticEvent, useStyle } from '@dark-engine/platform-browser';

const DraggableZone = createComponent(({ slot }) => {
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

  return <div style={style.root}>{slot}</div>;
});

const DraggableItem = createComponent(({ slot }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [rect, setRect] = useState<DOMRect>(null);
  const rootRef = useRef<HTMLElement>(null);
  const style = useStyle(styled => ({
    root: styled`
      cursor: move;
      position: relative;
      display: inline-block;
      transform: translate(${coord.x}px, ${coord.y}px);
      z-index: ${isDragging ? 10 : 0};
    `,
  }));

  useEffect(() => {
    setRect(rootRef.current.getBoundingClientRect());
  }, []);

  const handleDragStart = (e: SyntheticEvent<MouseEvent>) => {
    const target = e.target as HTMLElement;

    target.style.setProperty('opacity', '0');
    setIsDragging(true);
  };

  const handleDrag = (e: SyntheticEvent<MouseEvent>) => {
    if (e.sourceEvent.x === 0 || e.sourceEvent.y === 0) return;
    const x = e.sourceEvent.x - rect.width / 2 - rect.left;
    const y = e.sourceEvent.y - rect.height / 2 - rect.top;

    setCoord({ x, y });
  };

  const onDragEnd = (e: SyntheticEvent<MouseEvent>) => {
    if (
      e.sourceEvent.x < 0 ||
      e.sourceEvent.x > window.innerWidth ||
      e.sourceEvent.y < 0 ||
      e.sourceEvent.y > window.innerHeight
    ) {
      setCoord({ x: 0, y: 0 });
    } else {
      const x = e.sourceEvent.x - rect.width / 2 - rect.left;
      const y = e.sourceEvent.y - rect.height / 2 - rect.top;

      setCoord({ x, y });
    }

    setIsDragging(false);
  };

  return (
    <div
      ref={rootRef}
      style={style.root}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={onDragEnd}>
      {slot}
    </div>
  );
});

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
    `,
  }));

  return (
    <DraggableZone>
      {['🍉', '🍌', '🍒', '🍎', '🥑', '🍇'].map((x, idx) => {
        return (
          <DraggableItem key={idx}>
            <div style={style.box}>{x}</div>
          </DraggableItem>
        );
      })}
    </DraggableZone>
  );
});

createRoot(document.getElementById('root')).render(<App />);
