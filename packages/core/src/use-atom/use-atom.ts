import { useUpdate } from '../use-update';
import { useEffect } from '../use-effect';

type AtomSubscriber<T> = (p: T, n: T) => void;

class Atom<T = unknown> {
  private value: T;
  private subscribers: Set<AtomSubscriber<T>> = new Set();

  constructor(value: T = undefined) {
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T) {
    if (Object.is(this.value, value)) return;
    const value$ = this.value;

    this.value = value;
    this.subscribers.forEach(x => x(value$, value));
  }

  public on(subscriber: AtomSubscriber<T>) {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  }
}

const atom = <T>(value: T = undefined) => new Atom(value);

const defaultShouldUpdate = () => true;

type Value<T = unknown> = [Atom<T>, ((p: T, n: T) => boolean)?];

function useAtom<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  values: [
    Value<T1>,
    Value<T2>?,
    Value<T3>?,
    Value<T4>?,
    Value<T5>?,
    Value<T6>?,
    Value<T7>?,
    Value<T8>?,
    Value<T9>?,
    Value<T10>?,
  ],
) {
  const update = useUpdate({ forceSync: true });

  useEffect(() => {
    const unsubscribes: Array<() => void> = [];

    for (const [atom, shouldUpdate = defaultShouldUpdate] of values) {
      const off = atom.on((p: any, n: any) => {
        shouldUpdate(p, n) && update();
      });

      unsubscribes.push(off);
    }

    return () => unsubscribes.forEach(x => x());
  }, []);

  return values.map((x: Value) => x[0].get()) as [T1, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?, T10?];
}

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

export { Atom, atom, useAtom, detectIsAtom };
