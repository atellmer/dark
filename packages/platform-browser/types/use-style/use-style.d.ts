declare function styled(strings: TemplateStringsArray, ...args: Array<string | number>): string;
declare type Style = Record<string, string>;
declare type Config<T extends Style> = (x: typeof styled) => T;
declare function useStyle<T extends Style>(config: Config<T>): T;
export { useStyle };
