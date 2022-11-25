import { type ScheduleCallbackOptions } from '@dark-engine/core';
declare const shouldYeildToHost: () => boolean;
declare function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions): void;
export { shouldYeildToHost, scheduleCallback };
