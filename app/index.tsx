import runBench from './benchmark/dark';

//runBench();

// import {
//   h,
//   Text,
//   createComponent,
//   memo,
//   useState,
//   useEffect,
//   useCallback,
// } from '../src/core';
// import { render } from '../src/platform/browser';

// const domElement = document.getElementById('app');


// const targetSize = 25;

// const Dot = createComponent((props) => {
//   const s = props.size * 1.3;
//   const style = `
//     position: absolute;
//     background-color: #61dafb;
//     font: normal 15px sans-serif;
//     text-align: center;
//     cursor: pointer;
//     width: ${s}px;
//     height: ${s}px;
//     left: ${props.x}px;
//     top: ${props.y}px;
//     border-radius: ${s / 2}px;
//     line-height: ${s}px;
//     background-color: ${'#61dafb'};
//   `;

//   return (
//     <div style={style}>
//       {Text(props.slot)}
//     </div>
//   );
// });

// const MemoDot = memo(Dot, (p, n) =>
//   p.x !== n.x || p.y !== n.y || p.size !== n.size || Text(p.slot) !== Text(n.slot));

// const SierpinskiTriangle = createComponent(({ x, y, s, slot }) => {
//   if (s <= targetSize) {

//     return (
//       <MemoDot
//         x={x - (targetSize / 2)}
//         y={y - (targetSize / 2)}
//         size={targetSize}>
//         {slot}
//       </MemoDot>
//     );
//   }

//   s /= 2;

//   return (
//     <div>
//       <MemoSierpinskiTriangle x={x} y={y - (s / 2)} s={s}>
//         {slot}
//       </MemoSierpinskiTriangle>
//       <MemoSierpinskiTriangle x={x - s} y={y + (s / 2)} s={s}>
//         {slot}
//       </MemoSierpinskiTriangle>
//       <MemoSierpinskiTriangle x={x + s} y={y + (s / 2)} s={s}>
//         {slot}
//       </MemoSierpinskiTriangle>
//     </div>
//   );
// });

// const MemoSierpinskiTriangle = memo(SierpinskiTriangle, (p, n) => 
//   p.x !== n.x || p.y !== n.y || p.s !== n.s || Text(p.slot) !== Text(n.slot));

// let seconds = 0;

// const App = createComponent((props) => {
//   const elapsed = props.elapsed;
//   const t = (elapsed / 1000) % 10;
//   const scale = 1 + (t > 5 ? 10 - t : t) / 10;

//   useEffect(() => {
//     setInterval(tick, 1000);
//   }, []);

//   const tick = useCallback(() => {
//     seconds = (seconds % 10) + 1;
//     renderApp();
//   }, []);

//   const containerStyle = `
//     position: absolute;
//     transform-origin: 0 0;
//     left: 50%;
//     top: 50%;
//     width: 10px;
//     height: 10px;
//     background-color: #eee;
//     transform: ${'scaleX(' + (scale / 2.1) + ') scaleY(0.7) translateZ(0.1px)'};
//   `;

//   return (
//     <div style={containerStyle}>
//       <div>
//         <MemoSierpinskiTriangle x={0} y={0} s={1000}>
//           {seconds}
//         </MemoSierpinskiTriangle>
//       </div>
//     </div>
//   );
// });


// const start = new Date().getTime();

// function renderApp() {
//   render(
//     <App elapsed={new Date().getTime() - start} />,
//     domElement,
//   );
// }

// function update() {
//   renderApp();
//   requestAnimationFrame(update);
// }

// requestAnimationFrame(update);

// // const Some = createComponent(() => {
// //   return (
// //     <div data-some>
// //       <span>some component</span>
// //     </div>
// //   );
// // });

// // const MemoSome = memo(Some);

// // const App = createComponent(({ color }) => {

// //   // console.log('render: ', color);

// //   return(
// //     <div style={`color: ${color}`}>
// //       <div>1</div>
// //       <div>2</div>
// //       <MemoSome />
// //       <div>
// //         <div>3</div>
// //       </div>
// //     </div>
// //   )
// // });

// // render(App({ color: 'yellow' }), domElement);

// // let color = 'red';

// // function update() {
// //   color = color === 'red' ? 'yellow' : 'red';
// //   render(App({ color }), domElement);

// //   requestAnimationFrame(update);
// // }

// // requestAnimationFrame(update);


type FiberOptions = {
  checkLimit: (cb: () => any) => void;
  putToCache: (key, value) => void;
  takeFromCache: (key) => any;
};

const MAX_TIME = 16;

function createFiber() {
  let scope = null;

  function createScope() {
    return {
      executeTime: performance.now(),
      resolver: args => {},
      cache: new Map()
    };
  }

  function requestNextFrame(...args) {
    throw new Promise(resolve => {
      resolve([...args]);
    });
  }

  function detectLimit(startTime: number): boolean {
    return performance.now() - startTime >= MAX_TIME;
  }

  function make(fn: Function): Function {
    return (...args) => {
      const startTime = performance.now();
      const cb = args[args.length - 1];
      scope.resolver = (...args) => cb(...args);
      const check = () => detectLimit(startTime);
      const result = fn({
        checkLimit: (cb: Function) => check() && requestNextFrame(cb()),
        putToCache: (key, value) => scope.cache.set(key, value),
        takeFromCache: key => scope.cache.get(key)
      }, ...args);
      cb(result);
    };
  }

  function execute(fn: Function, fromRoot: boolean = true) {
    if (fromRoot) {
      scope = createScope();
    }

    try {
      fn();
    } catch (promise) {
      if (promise instanceof Promise) {
        const breakTime = performance.now();
        promise.then(args => {
          scope.resolver(args);
          requestAnimationFrame(() => {
            console.log('!!!new frame!!!');
            if (scope.executeTime < breakTime) {
              execute(fn, false);
            }
          });
        });
      }
    }
  }

  return {
    make,
    execute,
  };
}

const fiber = createFiber();

const hardWork = (options: FiberOptions) => {
  const {
    checkLimit,
    putToCache,
    takeFromCache,
  } = options;

  const start = takeFromCache('index') || 0;

  for (let i = start; i < 1000; i++) {
    checkLimit(() => {});
    console.log('work...', i);
    putToCache('index', i + 1);
  }
}

const syncHardWork = () => {
  for (let i = 0; i < 1000; i++) {
    console.log('work...', i);
  }
}

const asyncHardWork = fiber.make(hardWork);


setTimeout(() => {
  fiber.execute(() => {
    asyncHardWork(() => {});
  });
  //syncHardWork();
}, 3000);

