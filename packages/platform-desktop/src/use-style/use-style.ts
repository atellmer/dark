import { useMemo, detectIsUndefined } from '@dark-engine/core';

function styled(strings: TemplateStringsArray, ...args: Array<string | number>): string {
  const style = useMemo(() => {
    return strings
      .map((x, idx) => x + (!detectIsUndefined(args[idx]) ? args[idx] : ''))
      .join('')
      .replace(/([:;])\s*/gm, '$1')
      .trim();
  }, [strings, ...args]);

  return style;
}

type Style = Record<string, string>;

type Config<T extends Style> = (x: typeof styled) => T;

function useStyle<T extends Style>(config: Config<T>) {
  return config(styled);
}

export { useStyle };
