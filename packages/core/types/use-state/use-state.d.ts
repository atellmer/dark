import { type ScheduleCallbackOptions } from '../platform';
type Value<T> = T | ((prevValue: T) => T);
declare function useState<T = unknown>(
  initialValue: T | (() => T),
  options?: ScheduleCallbackOptions,
): [T, (value: Value<T>) => void];
export { useState };
