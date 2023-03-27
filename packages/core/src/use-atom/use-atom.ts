import { useUpdate } from '../use-update';
import { useEffect } from '../use-effect';

type AtomSubscriber<T> = (p: T, n: T) => void;

class Atom<T> {
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

  public subscribe(subscriber: AtomSubscriber<T>) {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  }
}

const atom = <T>(value: T = undefined) => new Atom(value);

const defaultShouldUpdate = () => true;

function useAtom<T>(atom: Atom<T>, shouldUpdate: (p: T, n: T) => boolean = defaultShouldUpdate): T {
  const update = useUpdate({ forceSync: true });

  useEffect(() => {
    const unsubscribe = atom.subscribe((p, n) => {
      shouldUpdate(p, n) && update();
    });

    return unsubscribe;
  }, []);

  return atom.get();
}

export { atom, Atom, useAtom };
