
// const DraggableZone = createComponent(({ slot }) => {
//   const style = `
//     position: relative;
//     width: 100%;
//     height: 100vh;
//     overflow: hidden;
//     backgroud-color: #444;
//     border: 1px solid red;
//   `;

//   return [
//     <div style={style}>
//       {slot}
//     </div>,
//   ];
// })

// const DraggableItem = createComponent(({ slot }) => {
//   const [coord, setCoord] = useState({ x: 0, y: 0 });
//   const [rect, setRect] = useState<ClientRect>(null);
//   const rootRef = useRef<HTMLElement>(null);
//   const style = `
//     display: inline-block;
//     transform: translate(${coord.x}px, ${coord.y}px);
//     cursor: move;
//   `;

//   useEffect(() => {
//     setRect(rootRef.current.getBoundingClientRect());
//   }, []);

//   const handleDragStart = (e: DarkSyntheticEvent<MouseEvent>) => {
//     const target = e.target as HTMLElement;

//     target.style.setProperty('opacity', '0');
//   };

//   const handleDrag = (e: DarkSyntheticEvent<MouseEvent>) => {
//     const x = e.sourceEvent.x - rect.width / 2 - rect.left;
//     const y = e.sourceEvent.y - rect.height / 2 - rect.top;

//     setCoord({
//       x,
//       y,
//     });
//   };

//   const onDragEnd = (e: DarkSyntheticEvent<MouseEvent>) => {
//     const target = e.target as HTMLElement;
//     const x = e.sourceEvent.x - rect.width / 2 - rect.left;
//     const y = e.sourceEvent.y - rect.height / 2 - rect.top;

//     target.style.setProperty('opacity', '1');
//     setCoord({
//       x,
//       y,
//     });
//   };

//   return (
//     <div
//       ref={rootRef}
//       style={style}
//       draggable
//       onDragStart={handleDragStart}
//       onDrag={handleDrag}
//       onDragEnd={onDragEnd}>
//       {slot}
//     </div>
//   )
// });

// const App = createComponent(() => {
//   const styleA = `
//     width: 100px;
//     height: 100px;
//     background-color: green;
//     border: 5px solid yellow;
//   `;
//   const styleB = `
//     width: 100px;
//     height: 100px;
//     background-color: pink;
//     border: 5px solid yellow;
//   `;
//   const styleC = `
//     width: 100px;
//     height: 100px;
//     background-color: purple;
//     border: 5px solid yellow;
//   `;

//   return (
//     <DraggableZone>
//       <DraggableItem>
//         <div style={styleA}>A</div>
//       </DraggableItem>
//       <DraggableItem>
//         <div style={styleB}>B</div>
//       </DraggableItem>
//       <DraggableItem>
//         <div style={styleC}>C</div>
//       </DraggableItem>
//     </DraggableZone>
//   );
// });

// render(App(), domElement);
