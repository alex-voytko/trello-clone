import { createPortal } from "react-dom";
import TaskInput from "./TaskInput";
import { actionContext } from "../App";
import { useContext } from "react";
import { IModalProps } from "../interfaces";

function Modal({ edit }: IModalProps) {
  const { onCloseModal } = useContext(actionContext);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) onCloseModal();
  };

  return createPortal(
    <div id="backdrop-modal" onClick={onBackdropClick}>
      <div className="modal-content">
        <TaskInput edit={edit} />
      </div>
    </div>,
    document.querySelector("#modal-root") as HTMLElement,
  );
}

export default Modal;
