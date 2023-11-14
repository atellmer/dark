import { useMemo, detectIsUndefined } from '@dark-engine/core';

function styled(strings: TemplateStringsArray, ...args: Array<string | number>): Record<string, string> {
  const style = useMemo(() => {
    const style: Record<string, string> = {};
    const items = strings
      .map((x, idx) => x + (!detectIsUndefined(args[idx]) ? args[idx] : ''))
      .join('')
      .split(';');

    for (const item of items) {
      const [key, value] = item.split(/:(?!\/\/)/);
      if (!value) continue;

      style[key.trim()] = value.trim();
    }

    return style;
  }, [strings, ...args]);

  return style;
}

type StyleRecord = Record<string, Record<string, string>>;

type Config<T extends StyleRecord> = (x: typeof styled) => T;

function useStyle<T extends StyleRecord>(config: Config<T>) {
  return config(styled);
}

export { useStyle };
