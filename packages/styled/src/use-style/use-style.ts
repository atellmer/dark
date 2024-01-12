import { useMemo, detectIsUndefined } from '@dark-engine/core';
import { type CSSProperties } from '@dark-engine/platform-browser';

import { type TextBased } from '../shared';
import { SEMICOLON_MARK } from '../constants';

function styled(source: TemplateStringsArray, ...args: Array<TextBased>): CSSProperties {
  const style = useMemo(() => {
    const style: CSSProperties = {};
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

type Config<T extends object> = (x: typeof styled) => Record<keyof T, CSSProperties>;

const useStyle = <T extends object>(config: Config<T>) => config(styled);

export { useStyle };
