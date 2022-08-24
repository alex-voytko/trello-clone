import { useContext } from "react";
import { useSelector } from "react-redux";
import toolbarData from "../data/toolbarData.json";
import { actionContext } from "../App";
import { IReduxState } from "../interfaces";

function ToolBar() {
  const { handleClick } = useContext(actionContext);
  const selectedTask = useSelector(
    (state: IReduxState) => state.boards.selectedTask,
  );

  const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    handleClick(target.className);
  }

  return (
    <div className="toolbar">
      {toolbarData.map(({ name, className }) => (
        <button
          key={className}
          className={className}
          onClick={onBtnClick}
          disabled={!selectedTask.id && className !== "add-btn" ? true : false}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
export default ToolBar;
