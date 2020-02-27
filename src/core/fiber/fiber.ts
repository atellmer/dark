import { getRegistery, getAppUid } from '../scope';
import { getTime } from '@helpers';


type FiberScope = {
  startTime: number;
  stack: Array<any>;
  isStackBlocked: boolean;
  isDeadLineBlocked: boolean;
}

export type FiberInstance<T = {}, O = {}, V = {}> = {
  run: (context: T) => void;
  pushToStack: (context: T) => void;
  putToCache: (value: any, key: () => any) => void;
  takeFromCache: TakeFormCache<V>;
  checkDeadline: (getOptions: O) => void;
};

type TakeFormCache<V = {}> = (key: () => any) => V | null;

type FiberOptions<O, T> = {
  fn: FiberFunction<O, T>;
  effect: FiberEffect<O>;
  mutateOptions?: (options: O) => O;
};
type FiberFunction<O, T> = (effect: FiberEffect<O>, args: T) => void;
type FiberEffect<O> = (options: O) => void;


const MAX_TIME = 32;

const mutateOptionsDefault = x => x;

const Fiber = <O, T>(options: FiberOptions<O, T>) => {
  const {
    fn,
    effect,
    mutateOptions = mutateOptionsDefault,
  } = options;
  let instance;
  const cache = new Map();
  let scope: FiberScope = createFiberScope();

  setCurrentFiber(null);

  function run(args: T) {
    try {
      scope = createFiberScope();
      fn((options) => effect(options), args);
    } catch (e) {
      if (e instanceof Promise) {
        e.then((options: O) => {
          scope.isStackBlocked = true;
          const stack = [...scope.stack].reverse();

          // console.log('stack', stack);

          effect(mutateOptions(options));
          requestAnimationFrame(() => {
            try {
              for (const context of stack) {
                const fiber = getCurrentFiber();

                if (fiber === instance) {
                  run(context);
                  scope.stack.pop();
                } else {
                  throw new Promise(resolve => resolve());
                }
              }
            } catch (e) {}
          });
        });
      }
    }
  };

  function pushToStack(context: T) {
    !scope.isStackBlocked && scope.stack.push(context);
  }

  function putToCache<T>(value: T, key: () => any) {
    cache.set(key(), value);
  }

  function takeFromCache<V>(key: () => any): V | null {
    return cache.get(key()) || null;
  }

  function checkDeadline(getOptions: () => O) {
    const timeDiff = getTime() - scope.startTime;
    const deadline = timeDiff >= MAX_TIME;

    if (deadline) {
      throw new Promise<O>(resolve => resolve(getOptions()));
    }
  }

  function createFiberScope(): FiberScope {
    return {
      startTime: getTime(),
      stack: [],
      isStackBlocked: false,
      isDeadLineBlocked: false,
    };
  }

  instance = {
    run,
    pushToStack,
    putToCache,
    takeFromCache,
    checkDeadline,
  };

  setCurrentFiber(instance);

  return instance;
}

function getCurrentFiber<T, O, V>() {
  const { fiber } = getRegistery().get(getAppUid());

  return fiber.current as FiberInstance<T, O, V>;
}

function setCurrentFiber(current: FiberInstance) {
  const { fiber } = getRegistery().get(getAppUid());

  fiber.current = current;
}

export {
  getCurrentFiber,
  setCurrentFiber,
}

export default Fiber;


// function asyncMountVirtualDOM(options: MountVirtualDOMOptions, cb: Function) {
//   fromAsync = true;
//   try {
//     const vNode = mountVirtualDOM({ ...options, fromRoot: true }) as VirtualNode;
//     console.log('full render', deepClone(vNode));
//     isBlockStack = false;
//     deadline = false;
//     vNodeMap = {};
//     stack = [];
//     cb(vNode, true);
//   } catch (e) {
//     if (e instanceof Promise) {
//       e.then(vNode => {
//         isBlockStack = true;
//         //console.log('stack', [...stack]);
//         console.log('request new frame', deepClone(vNode));
//         cb(vNode); // provide only attrs or text changes

//         requestAnimationFrame(() => {
//           stack.pop();
//           for (const context of stack.reverse()) {
//             // console.log('context', context);
//             // console.log('vNodeMap', vNodeMap);
//             asyncMountVirtualDOM({ ...context }, (...args) => {
//               context.fromRoot && cb(...args);
//             });
//           }
//         })
//       });
//     }
//   }
// }