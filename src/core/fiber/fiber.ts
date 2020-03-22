import { getTime } from '@helpers';


type Scope = {
  cache: Map<any, any>;
  startTime: number;
  createTime: number;
};

const FRAME_TIME = 16;
const LIVE_TIME = 10000;
let id = 0;

class Fiber {
  public static current: Fiber = null;
  public static execute(
    fn: (result: any) => any,
    raf: Function,
    fiber: Fiber = new Fiber(),
  ) {
    const scope = fiber.getScope();

    scope.startTime = getTime();
    Fiber.current = fiber;
    try {
      fn(null);
      Fiber.current = null;
    } catch (promise) {
      if (promise instanceof Promise) {
        promise.then((result) => {
          const fiber = Fiber.current;

          fn(result);

          if (performance.now() - fiber.scope.createTime > LIVE_TIME) {
            Fiber.current = null;
            return;
          }

          raf(() => {
            //console.log('!!!new frame!!!', fiber.id);
            Fiber.execute(fn, raf, fiber);
          });
        });
      }
    }
  };

  public id = ++id;

  private scope: Scope = {
    cache: new Map(),
    createTime: getTime(),
    startTime: getTime(),
  };

  public cache = (key: any, value?: any) => {
    return value ? this.scope.cache.set(key, value) : this.scope.cache.get(key);
  }

  public quant = (cb: Function)  => {
    if (getTime() - this.scope.startTime > FRAME_TIME) {
      throw new Promise(resolve => resolve(cb()));
    };
  }

  private getScope = () => this.scope;
}

export {
  Fiber,
};
