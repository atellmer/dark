type FiberScope = {
  stack: Array<Function>;
  isFreezed: boolean;
  isExecuting: boolean;
  startTime: number;
  resolver: (...args: Array<any>) => void,
  cache: Map<any, any>;
}

const MAX_TIME = 160000;

function createFiber() {
  let scope: FiberScope = null;

  function createScope(): FiberScope {
    return {
      stack: [],
      isFreezed: false,
      isExecuting: false,
      startTime: performance.now(),
      resolver: () => {},
      cache: new Map(),
    };
  }

  function detectOverLimit(startTime: number): boolean {
    return performance.now() - startTime >= MAX_TIME;
  }

  function addToStack(fn: Function) {
    !scope.isFreezed && scope.stack.push(fn);
  }

  function requestFrame(...args) {
    if (!detectOverLimit(scope.startTime)) return;
    throw new Promise(resolve => {
      resolve([...args]);
    });
  }

  function putToCache(key: any, value: any) {
    scope.cache.set(key, value);
  }

  function takeFromCache(key: any) {
    return scope.cache.get(key);
  }

  function detectExecuting() {
    return scope && scope.isExecuting;;
  }

  function make(fn: (...args: Array<unknown>) => any): (...args: Array<any>) => void {
    return (...args) => {
      scope.startTime = performance.now();
      scope.resolver = args[args.length - 1];
      scope.resolver(fn(...args), true);
      scope = createScope();
    };
  }

  function execute(fn: Function, fromRoot = true) {
    fromRoot && (scope = createScope());
    scope.isExecuting = true;

    try {
      fn();
    } catch (promise) {
      if (promise instanceof Promise) {
        scope.isFreezed = true;
        const breakTime = performance.now();

        promise.then(args => {
          scope.resolver(args, false);
          const stack = [...scope.stack].reverse();
          requestAnimationFrame(() => {
            console.log('!!!new frame!!!');

            for (const fn of stack) {
              execute(fn, false);
            }

            scope.stack = [];
            scope.isFreezed = false;
          });
        });
      }
    }
  }

  return {
    make,
    execute,
    detectExecuting,
    addToStack,
    requestFrame,
    putToCache,
    takeFromCache,
  };
}

function debounce(fn: Function, delay: number = 0) {
  let calls = [];
  let prevResult;
  let timerId = null;

  if (process.env.NODE_ENV === 'test') {
    return fn;
  }

  return (...args) => {
    calls.push(() => fn(...args));
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      if (calls.length > 0) {
        prevResult = calls[calls.length - 1]();
        calls = [];
      }
    }, delay);

    return prevResult;
  };
};

export default createFiber;
