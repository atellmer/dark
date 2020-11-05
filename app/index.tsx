// // import { run } from './sierpinski-triangle';

// // run();

// import {
//   h,
//   View,
//   Text,
//   createComponent,
//   Fragment,
//   memo,
//   forwardRef,
//   useState,
//   Reducer,
//   useReducer,
//   useUpdate,
//   useCallback,
//   useMemo,
//   useEffect,
//   useContext,
//   createContext,
//   useRef,
//   useImperativeHandle,
// } from '../src/core';
// import { render, createPortal } from '../src/platform/browser';


// const domElement = document.getElementById('root');

// const div = (props = {}) => View({ ...props, as: 'div' });
// const button = (props = {}) => View({ ...props, as: 'button' });
// const table = (props = {}) => View({ ...props, as: 'table' });
// const tbody = (props = {}) => View({ ...props, as: 'tbody' });
// const tr = (props = {}) => View({ ...props, as: 'tr' });
// const td = (props = {}) => View({ ...props, as: 'td' });

// const createMeasurer = () => {
//   let startTime;
//   let lastMeasureName;
//   const start = (name: string) => {
//     startTime = performance.now();
//     lastMeasureName = name;
//   };
//   const stop = () => {
//     const last = lastMeasureName;

//     if (lastMeasureName) {
//       setTimeout(() => {
//         lastMeasureName = null;
//         const stopTime = performance.now();
//         const diff = stopTime - startTime;

//         console.log(`${last}: ${diff}`);
//       }, 0);
//     }
//   };

//   return {
//     start,
//     stop,
//   };
// };

// const measurer = createMeasurer();

// let nextId = 0;
// const buildData = (count, prefix = '') => {
//   return Array(count).fill(0).map((_, idx) => ({
//     id: ++nextId,
//     name: `item: ${idx + 1} ${prefix}`,
//     select: false,
//   }))
// }

// const state = {
//   list: [],
// };

// type HeaderProps = {
//   onCreate: Function;
//   onAdd: Function;
//   onUpdateAll: Function;
//   onSwap: Function;
//   onClear: Function;
// }

// const Header = createComponent<HeaderProps>(({ onCreate, onAdd, onUpdateAll, onSwap, onClear }) => {
//   return div({
//     style: 'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
//     slot: [
//       button({
//         slot: Text('create 10000 rows'),
//         onClick: onCreate,
//       }),
//       button({
//         slot: Text('Add 1000 rows'),
//         onClick: onAdd,
//       }),
//       button({
//         slot: Text('update every 10th row'),
//         onClick: onUpdateAll,
//       }),
//       button({
//         slot: Text('swap rows'),
//         onClick: onSwap,
//       }),
//       button({
//         slot: Text('clear rows'),
//         onClick: onClear,
//       }),
//     ],
//   });
// });

// const MemoHeader = memo(Header);

// type RowProps = {
//   id: number,
//   name: string;
//   selected: boolean;
//   onRemove: Function;
//   onHighlight: Function;
// };

// const Row = createComponent<RowProps>(({ id, name, selected, onRemove, onHighlight }) => {
//   const handleRemove = useCallback(() => onRemove(id), []);
//   const handleHighlight = useCallback(() => onHighlight(id), []);
//   const className = `${selected ? 'selected' : ''}`;

//   // console.log('render', id);

//   return [
//       <div class='item'>{id} 1</div>,
//       <div class='item'>{id} 2</div>,
//       <div class='item'>{id} 3</div>,
//   ];
// });

// const MemoRow = memo<RowProps>(Row, (props, nextProps) =>
//   props.name !== nextProps.name ||
//   props.selected !== nextProps.selected,
// );

// type ListProps = {
//   items: Array<{ id: number, name: string; select: boolean }>;
//   onRemove: Function;
//   onHighlight: Function;
// };

// const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {
//   return items.map((item) => {
//           return <Fragment key={item.id}>
//             <div class='item'>{item.id} 1</div>
//             <div class='item'>{item.id} 2</div>
//             <div class='item'>{item.id} 3</div>
//           </Fragment>
//         })
// });

// const MemoList = memo(List);

// const Bench = createComponent(() => {
//   const handleCreate = useCallback(() => {
//     state.list = buildData(10);
//     measurer.start('create');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleAdd = useCallback(() => {
//     state.list.push(...buildData(5, '!!!'));
//     state.list = [...state.list];
//     measurer.start('add');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleUpdateAll = useCallback(() => {
//     state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
//     measurer.start('update every 10th');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleRemove = useCallback((id) => {
//     state.list = state.list.filter((z) => z.id !== id);
//     measurer.start('remove');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleHightlight = useCallback((id) => {
//     const idx = state.list.findIndex(z => z.id === id);
//     state.list[idx].select = !state.list[idx].select;
//     state.list = [...state.list];
//     measurer.start('highlight');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleSwap = useCallback(() => {
//     if (state.list.length === 0) return;
//     const temp = state.list[1];
//     state.list[1] = state.list[state.list.length - 2];
//     state.list[state.list.length - 2] = temp;
//     state.list = [...state.list];
//     measurer.start('swap');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleClear = useCallback(() => {
//     state.list = [];
//     measurer.start('clear');
//     forceUpdate();
//     measurer.stop();
//   }, []);

//   return (
//     <Fragment>
//       <MemoHeader
//         onCreate={handleCreate}
//         onAdd={handleAdd}
//         onUpdateAll={handleUpdateAll}
//         onSwap={handleSwap}
//         onClear={handleClear}
//       />
//       <MemoList
//         items={state.list}
//         onRemove={handleRemove}
//         onHighlight={handleHightlight}
//       />
//     </Fragment>
//   );
// });

// function forceUpdate() {
//   render(Bench(), domElement);
// }

// render(Bench(), domElement);


type Task = {
  id?: number;
  execute: (deadline: IdleDeadline, isHightPriority: boolean, onComplete: () => void) => void;
};

class Scheduler {
  private nextId = 0;
  private mainTaskId = 1;
  private branchTaskId = 1;
  private taskMap: Map<number, Task> = new Map();
  private isMainThreadBusy = false;
  private isBranchThreadBusy = false;

  public run = () => {
    requestIdleCallback((deadline: IdleDeadline) => {
      this.runMainThread(deadline);
      this.runBranchThread(deadline);
    });
  };

  public addTask = (task: Task) => {
    const id = ++this.nextId;

    this.taskMap.set(id, { ...task, id });
  };

  public runMainThread = (deadline: IdleDeadline) => {

    if (!this.isMainThreadBusy) {
      const task = this.taskMap.get(this.mainTaskId);

      if (task) {
        this.isMainThreadBusy = true;
        this.taskMap.delete(this.mainTaskId);

        if (this.branchTaskId <= this.mainTaskId) {
          this.branchTaskId = this.mainTaskId + 1;
        }

        task.execute(deadline, false, () => {
          this.isMainThreadBusy = false;
          this.mainTaskId++;
          //console.log('main-thread', task.id);
        });
      }
    }

    requestIdleCallback(this.runMainThread);
  };

  public runBranchThread = (deadline: IdleDeadline) => {

    if (!this.isBranchThreadBusy && this.isMainThreadBusy) {
      const task = this.branchTaskId > this.mainTaskId
        ? this.taskMap.get(this.branchTaskId)
        : null;

      if (task) {
        this.isBranchThreadBusy = true;
        task.execute(deadline, true, () => {
          this.isBranchThreadBusy = false;
          this.branchTaskId++;
          //console.log('branch-thread', task.id);
        });
      }
    }

    requestIdleCallback(this.runBranchThread);
  };
}

const scheduler = new Scheduler();

scheduler.run();

function requestCallback(callback: (deadline: IdleDeadline, isHightPriority: boolean) => boolean) {
  scheduler.addTask({
    execute: (deadline, isHightPriority, onComplete) => {
      const run = (deadline: IdleDeadline) => {
        const shouldYeild = callback(deadline, isHightPriority);

        if (!shouldYeild) {
          onComplete();
        } else {
          if (isHightPriority) {
            onComplete();
          } else {
            requestIdleCallback(run);
          }
        }
      }

      run(deadline);
    },
  });
}

const box = document.createElement('div');
const style = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: blueviolet;
`;
box.setAttribute('style', style);

document.body.appendChild(box);

let shift = 0;
let q = 1;

const animateBox = (deadline: IdleDeadline) => {
  shift = shift + q;
  box.style.setProperty('transform', `translateX(${shift}px)`);

  if (shift >= window.innerWidth - (box.clientWidth)) {
    q = -1;
  }

  if (shift <= 0) {
    q = 1;
  }

  const shouldYeild = deadline ? deadline.timeRemaining() < 1 : false;

  return shouldYeild;
};


let count = 0;
let random = 0;

function doHardWork(deadline: IdleDeadline, isHightPriority: boolean) {
  let shouldYeild = false;

  while (count < 10000000 && !shouldYeild) {
    // long execution time.
    if (!isHightPriority) {
      count++;
    }
    random = Math.random();
    shouldYeild = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!shouldYeild) {
    console.log('hard-work', count);
    count = 0;
  }

  return shouldYeild;
}

setInterval(() => {
  requestCallback(doHardWork);
}, 1000);

const update = () => {
  requestCallback(animateBox);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
