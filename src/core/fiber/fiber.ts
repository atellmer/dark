
export type FiberOptions = {
  scheduleNextFrame: (cb: (args: any) => void) => void;
  putToCache: (key: any, value: any) => void;
  takeFromCache: (key: any) => any;
};

type FiberScope = {
  executeTime: number;
  resolver: (...args: Array<any>) => void,
  cache: Map<any, any>;
}

const MAX_TIME = 16;

function createFiber() {
  let scope: FiberScope = null;

  function createScope(cache): FiberScope {
    return {
      executeTime: performance.now(),
      resolver: () => {},
      cache,
    };
  }

  function requestNextFrame(...args) {
    throw new Promise(resolve => {
      resolve([...args]);
    });
  }

  function detectLimit(startTime: number): boolean {
    const now = performance.now();

    return now - startTime >= MAX_TIME;
  }

  function make(fn: (...args: Array<unknown | FiberOptions>) => any): (...args: Array<any>) => void {
    return (...args) => {
      const startTime = performance.now();
      const result = fn(...args.slice(0, -1), {
        scheduleNextFrame: (cb: Function) => detectLimit(startTime) && requestNextFrame(cb()),
        putToCache: (key, value) => scope.cache.set(key, value),
        takeFromCache: key => scope.cache.get(key),
      });
      scope.resolver = args[args.length - 1];
      scope.resolver(result, true);
    };
  }

  function execute(fn: Function, fromRoot: boolean = true) {

    if (fromRoot) {
      scope = createScope(new Map());
    }

    try {
      fn();
    } catch (promise) {
      if (promise instanceof Promise) {
        const breakTime = performance.now();
        promise.then(args => {
          scope.resolver(args, false);
          if (scope.executeTime < breakTime) {
          requestAnimationFrame(() => {
            //console.log('!!!new frame!!!');
              execute(fn, false);
            });
          }
        });
      }
    }
  }

  return {
    make,
    execute,
  };
}

export default createFiber;
