import { type ScheduleCallbackOptions } from '../platform';
declare function useUpdate(options?: ScheduleCallbackOptions): (onStart?: () => void) => void;
export { useUpdate };
