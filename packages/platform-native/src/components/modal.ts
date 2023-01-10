import { type View as NSView, type ShowModalOptions } from '@nativescript/core';

import { type DarkElement, createComponent, useRef, useEffect } from '@dark-engine/core';
import { View, ViewRef } from './view';
import { Button, type ButtonRef } from './button';

export type ModalProps = {
  isOpen: boolean;
  fullscreen?: boolean;
  animated?: boolean;
  slot: DarkElement;
  onRequestClose: () => void;
};

const Modal = createComponent<ModalProps>(({ isOpen, fullscreen, animated, slot, onRequestClose }) => {
  const rootRef = useRef<ButtonRef>(null);
  const childRef = useRef<ViewRef>(null);
  const modalRef = useRef<NSView>(null);

  useEffect(() => {
    if (isOpen) {
      const options: ShowModalOptions = {
        context: null,
        animated,
        fullscreen,
        closeCallback: onRequestClose,
      };

      modalRef.current = rootRef.current.showModal(childRef.current, options);
    } else if (modalRef.current) {
      modalRef.current.closeModal();
      modalRef.current = null;
    }
  }, [isOpen]);

  return Button({
    ref: rootRef,
    slot: View({ ref: childRef, slot }),
  });
});

export { Modal };
