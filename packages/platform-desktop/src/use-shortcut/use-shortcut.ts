import {
  QShortcut,
  QKeySequence,
  WidgetEventTypes,
  type QWidget,
  type QShortcutSignals,
  type ShortcutContext,
} from '@nodegui/nodegui';
import { useEffect, type MutableRef } from '@dark-engine/core';

type UseShortcutOptions = {
  ref: MutableRef<QWidget>;
  keySequence: string;
  disabled?: boolean;
  signal?: QShortcutSignals;
  context?: ShortcutContext;
  callback: () => void;
};

function useShortcut(options: UseShortcutOptions, deps: Array<any> = []) {
  const { ref, keySequence, disabled, signal = 'activated', callback } = options;

  useEffect(() => {
    if (!ref.current) return;
    const shortcut = new QShortcut(ref.current);
    const signal$ = signal as WidgetEventTypes;

    shortcut.setKey(new QKeySequence(keySequence));
    shortcut.setEnabled(!disabled);
    shortcut.addEventListener(signal$, callback);

    return () => shortcut.removeEventListener(signal$, callback);
  }, [disabled, ...deps]);
}

export { useShortcut };
