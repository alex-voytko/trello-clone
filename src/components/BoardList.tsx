import { useState } from "react";
import { useDispatch } from "react-redux";
import * as trello_slice from "../redux/trello-redux/trello-slice";
import Board from "./Board";
import * as interfaces from "../interfaces";

interface IBoardsProps {
  boards: interfaces.IBoard[];
}

function BoardList({ boards }: IBoardsProps) {
  const dispatch = useDispatch();
  const [currentBoard, setCurrentBoard] = useState<interfaces.IBoard | null>(
    null,
  );
  const [currentTask, setCurrentTask] = useState<interfaces.ITask | null>(null);

  const handleDragStart: interfaces.IHandleDragStartAndDrop = (
    e,
    task,
    board,
  ) => {
    setCurrentBoard(board);
    setCurrentTask(task);
    dispatch(trello_slice.selectTask({}));
  };
  const handleDragEnd: interfaces.IHandleDragEnd = e => {
    const target = e.target as HTMLElement;
    target.style.boxShadow = "none";
  };
  const handleDragOver: interfaces.IHandleDragOver = e => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.className.includes("item")) {
      target.style.boxShadow = "0 7px 5px gray";
    }
  };
  const handleDrop: interfaces.IHandleDragStartAndDrop = (e, task, board) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    target.style.boxShadow = "none";
    const boardToString = JSON.stringify(board);
    const editBoard = JSON.parse(boardToString);
    const currentBoardToString = JSON.stringify(currentBoard);
    const editCurrentBoard = JSON.parse(currentBoardToString);
    const currentIndex = currentTask
      ? currentBoard?.tasks.indexOf(currentTask)
      : null
    const dropIndex = board.tasks.indexOf(task);
    editCurrentBoard.tasks.splice(currentIndex, 1);
    let updatedBoards: interfaces.IBoard[] = [];
    if (currentBoard?.id === board.id) {
      editCurrentBoard.tasks.splice(dropIndex + 1, 0, currentTask);
      updatedBoards = [
        ...boards.map((b: interfaces.IBoard): interfaces.IBoard => {
          if (b.id === currentBoard.id) {
            return editCurrentBoard;
          }
          return b;
        }),
      ];
    } else {
      editBoard.tasks.splice(dropIndex + 1, 0, currentTask);
      boards.forEach((b: interfaces.IBoard) => {
        if (b.id === currentBoard?.id)
          return updatedBoards.push(editCurrentBoard);
        if (b.id === board.id) return updatedBoards.push(editBoard);
        return updatedBoards.push(b);
      });
    }
    dispatch(trello_slice.fetchBoards(updatedBoards));
    dispatch(trello_slice.pushInHistory(updatedBoards));
  };
  const handleDropOnEmpty: interfaces.IHandleDropOnEmpty = (e, board) => {
    e.preventDefault();
    if (!board.tasks.length) {
      const boardToString = JSON.stringify(board);
      const editBoard = JSON.parse(boardToString);
      const currentBoardToString = JSON.stringify(currentBoard);
      const editCurrentBoard = JSON.parse(currentBoardToString);
      const currentIndex = currentTask
        ? currentBoard?.tasks.indexOf(currentTask)
        : null;
      editCurrentBoard.tasks.splice(currentIndex, 1);
      editBoard.tasks.push(currentTask);
      const updatedBoards: interfaces.IBoard[] = [];
      boards.forEach((b: interfaces.IBoard) => {
        if (b.id === currentBoard?.id)
          return updatedBoards.push(editCurrentBoard);
        if (b.id === board.id) return updatedBoards.push(editBoard);
        return updatedBoards.push(b);
      });
      dispatch(trello_slice.fetchBoards(updatedBoards));
      dispatch(trello_slice.pushInHistory(updatedBoards));
    }
  };
  return (
    <div className="boards-container">
      {boards.map((board: interfaces.IBoard) => (
        <Board
          board={board}
          key={board.id}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleDropOnEmpty={handleDropOnEmpty}
        />
      ))}
    </div>
  );
}

export default BoardList;
