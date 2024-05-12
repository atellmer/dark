import {
  type QPlainTextEditSignals,
  type QTextOptionWrapMode,
  type LineWrapMode,
  QPlainTextEdit,
} from '@nodegui/nodegui';
import {
  type ComponentFactory,
  type Ref,
  component,
  detectIsFunction,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
} from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qPlainTextEdit } from '../factory';

// <LineEdit onTextChanged={(value: string) => console.log(value)} />

export type PlainTextEditProps = WithStandardProps<
  {
    ref?: Ref<PlainTextEditRef>;
    text?: string;
    placeholder?: string;
    readOnly?: boolean;
    wordWrapMode?: QTextOptionWrapMode;
    lineWrapMode?: LineWrapMode;
    onTextChanged?: (value: string) => void;
  } & WidgetProps
>;
export type PlainTextEditRef = {
  node: QDarkPlainTextEdit;
};
export type PlainTextEditSignals = QPlainTextEditSignals;

const PlainTextEdit = component<PlainTextEditProps>(
  props => {
    const { ref, onTextChanged } = props;
    const rootRef = useRef<QDarkPlainTextEdit>(null);

    useImperativeHandle(ref, () => ({ node: rootRef.current }));

    useLayoutEffect(() => {
      const { current } = rootRef;
      const handler = () => {
        detectIsFunction(onTextChanged) && onTextChanged(current.toPlainText());
      };

      current.addEventListener('textChanged', handler);

      return () => current.removeEventListener('textChanged', handler);
    }, []);

    return qPlainTextEdit({ ref: rootRef, ...props });
  },
  { displayName: 'PlainTextEdit' },
) as ComponentFactory<PlainTextEditProps>;

class QDarkPlainTextEdit extends QPlainTextEdit {
  setText(value: string) {
    this.setPlainText(value);
  }

  setPlaceholder(value: string) {
    this.setPlaceholderText(value);
  }
}

export { PlainTextEdit, QDarkPlainTextEdit };
