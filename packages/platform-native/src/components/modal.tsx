import { Button as NSButton, View as NSView, ShowModalOptions } from '@nativescript/core';

import { type DarkElement, h, createComponent, useRef, useEffect } from '@dark-engine/core';
import { View, ViewRef } from './view';
import { type TagNativeElement } from '../native-element';

export type ModalProps = {
  isOpen: boolean;
  fullscreen?: boolean;
  animated?: boolean;
  slot: DarkElement;
  onRequestClose: () => void;
};

const Modal = createComponent<ModalProps>(({ isOpen, fullscreen, animated, slot, onRequestClose }) => {
  const rootRef = useRef<TagNativeElement<NSButton>>(null);
  const childRef = useRef<ViewRef>(null);
  const modalRef = useRef<NSView>(null);

  useEffect(() => {
    const rootNativeView = rootRef.current.getNativeView();
    const childNativeView = childRef.current.getNativeView();

    if (isOpen) {
      const options: ShowModalOptions = {
        context: null,
        animated,
        fullscreen,
        closeCallback: onRequestClose,
      };

      modalRef.current = rootNativeView.showModal(childNativeView, options);
    } else if (modalRef.current) {
      modalRef.current.closeModal();
      modalRef.current = null;
    }
  }, [isOpen]);

  return (
    <button ref={rootRef} hidden>
      <View ref={childRef}>{slot}</View>
    </button>
  );
});

export { Modal };
