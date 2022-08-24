import { useDispatch, useSelector } from "react-redux";
import { selectTask } from "../redux/trello-redux/trello-slice";
import * as interfaces from "../interfaces/index";

interface IBoardProps {
  board: interfaces.IBoard;
  handleDragStart: interfaces.IHandleDragStartAndDrop;
  handleDrop: interfaces.IHandleDragStartAndDrop;
  handleDropOnEmpty: interfaces.IHandleDropOnEmpty;
  handleDragOver: interfaces.IHandleDragOver;
  handleDragEnd: interfaces.IHandleDragEnd;
}

function Board({
  board,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleDropOnEmpty,
}: IBoardProps) {
  const dispatch = useDispatch();
  const selectedItem = useSelector(
    (state: interfaces.IReduxState) => state.boards.selectedTask,
  );

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (e.currentTarget.dataset.id === selectedItem.id) {
      dispatch(selectTask({}));
      return;
    }
    dispatch(
      selectTask({
        id: e.currentTarget.dataset.id,
        text: e.currentTarget.textContent,
      }),
    );
  };

  return (
    <div
      className="board"
      onDragOver={e => handleDragOver(e)}
      onDrop={e => handleDropOnEmpty(e, board)}
    >
      <h2>{board.name}</h2>
      <ul className="board-list">
        {board.tasks.map((task: interfaces.ITask) => (
          <li
            className={selectedItem.id === task.id ? `item selected` : `item`}
            data-id={task.id}
            key={task.id}
            onClick={handleClick}
            draggable={true}
            onDragStart={e => handleDragStart(e, task, board)}
            onDragLeave={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, task, board)}
          >
            <p>{task.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Board;
