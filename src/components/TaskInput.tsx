import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import shortid from "shortid";
import * as trello_slice from "../redux/trello-redux/trello-slice";
import { actionContext } from "../App";
import { IModalProps, IReduxState } from "../interfaces";

function TaskInput({ edit }: IModalProps) {
  const dispatch = useDispatch();
  const { onCloseModal } = useContext(actionContext);
  const selectedTask = useSelector(
    (state: IReduxState) => state.boards.selectedTask,
  );
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);
  const handleSubmit = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (text) {
      edit
        ? dispatch(trello_slice.editTask({ ...selectedTask, text: text }))
        : dispatch(
            trello_slice.addTask({ id: shortid.generate(), text: text }),
          );

      edit && dispatch(trello_slice.selectTask({}));
    }
    onCloseModal();
  };
  useEffect(
    useCallback(() => {
      if (edit) {
        const ref: { value?: string } = document.querySelector(
          "#main-input",
        ) as HTMLInputElement;
        ref.value = selectedTask.text;
      }
    }, [edit]),
    [edit],
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="main-input" type="text" onChange={handleChange} />
        <button onClick={handleSubmit}>OK</button>
      </form>
    </>
  );
}

export default TaskInput;
