import {
  QPlainTextEdit,
  type QPlainTextEditSignals,
  type QTextOptionWrapMode,
  type LineWrapMode,
} from '@nodegui/nodegui';
import {
  type ComponentFactory,
  component,
  forwardRef,
  detectIsFunction,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
} from '@dark-engine/core';

import { qPlainTextEdit } from '../factory';
import { type WidgetProps, type WithStandardProps } from '../shared';

export type PlainTextEditProps = WithStandardProps<
  {
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

const PlainTextEdit = forwardRef<PlainTextEditProps, PlainTextEditRef>(
  component(
    (props, ref) => {
      const { onTextChanged } = props;
      const rootRef = useRef<QDarkPlainTextEdit>(null);

      useImperativeHandle(ref, () => ({ node: rootRef.current }), []);

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
  ),
) as ComponentFactory<PlainTextEditProps, PlainTextEditRef>;

class QDarkPlainTextEdit extends QPlainTextEdit {
  setText(value: string) {
    this.setPlainText(value);
  }

  setPlaceholder(value: string) {
    this.setPlaceholderText(value);
  }
}

export { PlainTextEdit, QDarkPlainTextEdit };
