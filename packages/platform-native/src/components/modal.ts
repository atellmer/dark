import { type View as NSView, type ShowModalOptions } from '@nativescript/core';
import { type DarkElement, type Component, createComponent, useRef, useEffect } from '@dark-engine/core';

import { type ViewRef, View } from './view';
import { type ButtonRef, Button } from './button';

export type ModalProps = {
  isOpen: boolean;
  slot: DarkElement;
  closeOnTapOverlay?: boolean;
  onRequestClose?: () => void;
} & Omit<ShowModalOptions, 'context' | 'closeCallback' | 'cancelable'>;

const Modal = createComponent<ModalProps>(({ isOpen, slot, closeOnTapOverlay = false, onRequestClose, ...rest }) => {
  const rootRef = useRef<ButtonRef>(null);
  const childRef = useRef<ViewRef>(null);
  const modalRef = useRef<NSView>(null);

  useEffect(() => {
    if (isOpen) {
      const options: ShowModalOptions = {
        ...rest,
        context: null,
        cancelable: closeOnTapOverlay,
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
    hidden: true,
    slot: View({ ref: childRef, slot }),
  });
}) as Component<ModalProps>;

export { Modal };
