import { useMemo, detectIsUndefined } from '@dark-engine/core';

import { type TextBased } from '../shared';
import { SEMICOLON_MARK } from '../constants';

function styled(source: TemplateStringsArray, ...args: Array<TextBased>): Record<string, string> {
  const style = useMemo(() => {
    const style: Record<string, string> = {};
    const items = source
      .map((x, idx) => x + (!detectIsUndefined(args[idx]) ? args[idx] : ''))
      .join('')
      .split(SEMICOLON_MARK);

    for (const item of items) {
      const [key, value] = item.split(/:(?!\/\/)/);
      if (!value) continue;

      style[key.trim()] = value.trim();
    }

    return style;
  }, [source, ...args]);

  return style;
}

type StyleRecord = Record<string, Record<string, string>>;

type Config<T extends StyleRecord> = (x: typeof styled) => T;

const useStyle = <T extends StyleRecord>(config: Config<T>) => config(styled);

export { useStyle };
