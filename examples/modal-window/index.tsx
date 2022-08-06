import { h, createComponent, useEffect, useState, useMemo, Fragment } from '@dark-engine/core';
import { render, createPortal, useStyle } from '@dark-engine/platform-browser';

const Overlay = createComponent(() => {
  const style = useStyle(styled => ({
    container: styled`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(1, 1, 1, 0.5);
      z-index: 10000;
    `,
  }));

  return <div style={style.container} />;
});

type ModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const Modal = createComponent<ModalProps>(({ isOpen, slot, onRequestClose }) => {
  const host = useMemo<HTMLDivElement>(() => document.createElement('div'), []);
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

  const renderModal = () => {
    return (
      <div style={style.container}>
        <Overlay />
        <div style={style.modal}>
          <div style={style.modalHeader}>
            <button style={style.closeButton} onClick={onRequestClose}>
              X
            </button>
          </div>
          <div style={style.modalBody}>{slot}</div>
        </div>
      </div>
    );
  };

  if (isOpen && document.body !== host.parentElement) {
    document.body.appendChild(host);
  } else if (!isOpen && document.body === host.parentElement) {
    document.body.removeChild(host);
  }

  return isOpen ? createPortal(renderModal(), host) : null;
});

const App = createComponent(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer(x => x + 1);
    }, 1000);

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
