import { useUpdate } from '../use-update';
import { useEffect } from '../use-effect';

type ShoudlUpdate<T> = (p: T, n: T) => boolean;

type AtomSub<T> = [callback: () => void, shoudlUpdate: ShoudlUpdate<T>];

class Atom<T = unknown> {
  private value: T;
  private subs: Set<AtomSub<T>> = new Set();

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
    this.subs.forEach(([callabck, shouldUpdate = shouldUpdate$]) => shouldUpdate(value$, value) && callabck());
  }

  public on(sub: AtomSub<T>) {
    this.subs.add(sub);

    return () => this.subs.delete(sub);
  }
}

const atom = <T>(value: T = undefined) => new Atom(value);

const shouldUpdate$ = () => true;

type Value<T = unknown> = [Atom<T>, ShoudlUpdate<T>?];

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
    const off: Array<() => void> = [];

    for (const [atom, shouldUpdate] of values) {
      off.push(atom.on([update, shouldUpdate as ShoudlUpdate<any>]));
    }

    return () => off.forEach(x => x());
  }, []);

  return values.map((x: Value) => x[0].get()) as [T1, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?, T10?];
}

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

export { Atom, atom, useAtom, detectIsAtom };
