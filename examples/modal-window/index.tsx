import {
  h,
  createComponent,
  useEffect,
  useState,
  useMemo,
  Fragment,
  useSpring,
  type DarkElement,
} from '@dark-engine/core';
import { render, createPortal, useStyle } from '@dark-engine/platform-browser';

type OverlayProps = {
  x: number;
  onRequestClose: () => void;
};

const Overlay = createComponent<OverlayProps>(({ x, onRequestClose }) => {
  const style = useStyle(styled => ({
    container: styled`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(1, 1, 1, 0.8);
      z-index: 10000;
      opacity: ${x};
    `,
  }));

  return <div style={style.container} onClick={onRequestClose} />;
});

type ModalProps = {
  isOpen: boolean;
  slot: DarkElement;
  onRequestClose: () => void;
};

const Modal = createComponent<ModalProps>(({ isOpen: isOpenX, slot, onRequestClose }) => {
  const host = useMemo<HTMLDivElement>(() => document.createElement('div'), []);
  const [isOpen, setIsOpen] = useState(isOpenX);
  const scope = useMemo(() => ({ isClosing: false }), []);
  const {
    values: [x],
  } = useSpring({
    state: isOpen,
    getAnimations: () => [
      {
        name: 'appearance',
        mass: 0.01,
        stiffness: 0.01,
        damping: 0.1,
        duration: 800,
      },
    ],
  });

  useEffect(() => {
    if (scope.isClosing) return;
    setIsOpen(isOpenX);
  }, [isOpenX]);

  useEffect(() => {
    if (!scope.isClosing || x > 0) return;

    scope.isClosing = false;
    onRequestClose();
  }, [x]);

  const style = useStyle(styled => ({
    container: styled`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 16px;
    `,
    modal: styled`
      position: relative;
      width: 600px;
      min-height: 300px;
      max-width: 100%;
      background-color: #fff;
      color: #000;
      margin: auto;
      z-index: 10000;
      border-radius: 4px;
      opacity: ${x};
      transform: scale(${1 * x}) translateY(${-100 * (1 - x)}%);
    `,
    modalHeader: styled`
      padding: 32px 32px 0 32px;
    `,
    closeButton: styled`
      position: absolute;
      top: 4px;
      right: 4px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #666;
      border: 0;
      color: #fff;
      cursor: pointer;
    `,
    modalBody: styled`
      position: relative;
      padding: 32px;
    `,
  }));

  const handleClose = () => {
    scope.isClosing = true;
    setIsOpen(false);
  };

  const renderModal = () => {
    return (
      <div style={style.container}>
        <Overlay x={x} onRequestClose={handleClose} />
        <div style={style.modal}>
          <div style={style.modalHeader}>
            <button style={style.closeButton} onClick={handleClose}>
              X
            </button>
          </div>
          <div style={style.modalBody}>{slot}</div>
        </div>
      </div>
    );
  };

  if (isOpenX && document.body !== host.parentElement) {
    document.body.appendChild(host);
  } else if (!isOpenX && document.body === host.parentElement) {
    document.body.removeChild(host);
  }

  return isOpenX ? createPortal(renderModal(), host) : null;
});

const App = createComponent(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer(x => x + 1);
    }, 10);

    return () => clearInterval(timerId);
  }, []);

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={handleCloseModal}>
        Hello from modal window! {timer}
      </Modal>
      timer: {timer}
      <br />
      <button onClick={handleOpenModal}>Open modal</button>
    </>
  );
});

render(<App />, document.getElementById('root'));
