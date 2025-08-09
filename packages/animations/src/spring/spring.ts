import { type SubscriberWithValue, EventEmitter } from '@dark-engine/core';

import { type SpringValue } from '../shared';

class Spring<T extends string = string> {
  private props: Record<T, number> = {} as Record<T, number>;
  private emitter = new EventEmitter<'change', SpringValue<T>>();

  prop(key: T) {
    return this.props[key] ?? null;
  }

  setProp(key: T, value: number) {
    this.props[key] = value;
  }

  value(): SpringValue<T> {
    const value = Object.keys(this.props).reduce((acc, x) => ((acc[x] = this.props[x]), acc), {});

    return value as SpringValue<T>;
  }

  on(fn: SubscriberWithValue<SpringValue<T>>) {
    return this.emitter.on('change', fn);
  }

  notify() {
    this.emitter.emit('change', this.value());
  }
}

export { Spring };
