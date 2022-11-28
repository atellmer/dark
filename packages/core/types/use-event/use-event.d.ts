declare function useEvent<T extends (...args: Array<any>) => any>(fn: T): T;
export { useEvent };
