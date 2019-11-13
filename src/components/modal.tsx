import Class from "../styles/modal.module.css";
import { useRef, useEffect } from "react";

interface ModalProps {
  trigger: React.ReactElement;
  children: JSX.Element | JSX.Element[] | null;
}

export default ({ trigger, children }: ModalProps) => {
  const modal = useRef<HTMLDivElement>(null);
  const toggle = () => {
    if (!modal.current) return;
    modal.current.classList.toggle(Class['show-modal']);
  };

  const closeWindow = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return
    if (!modal.current) return
    modal.current.classList.remove(Class['show-modal'])
  }

  useEffect(() => {
      document.addEventListener('keyup', closeWindow)
      return () => {
          document.removeEventListener('keyup', closeWindow)
      }
  }, [])

  return (
    <>
      <div onClick={toggle}>{trigger}</div>
      <div ref={modal} className={Class.modal}>
        <div className={Class['modal-content']}>
          {/* <span onClick={toggle} className={Class['close-button']}>
            &times;
          </span> */}
          {children}
        </div>
      </div>
    </>
  );
};
