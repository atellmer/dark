import {
  type QWidget,
  type QShortcutSignals,
  type ShortcutContext,
  QShortcut,
  QKeySequence,
  WidgetEventTypes,
} from '@nodegui/nodegui';
import { useEffect, type MutableRef } from '@dark-engine/core';

// useShortcut({
//   ref: windowRef,
//   keySequence: 'Ctrl+Shift+Q',
//   callback: () => console.log('Ctrl+Shift+Q pressed!'),
// });

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
