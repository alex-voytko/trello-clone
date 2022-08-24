export interface IBoard {
  id: string;
  name: string;
  tasks: ITask[];
}
export interface ITask {
  id?: string;
  text?: string;
}
export interface IReduxState {
  boards: IReduxBoards;
}
export interface IReduxBoards {
  items: IBoard[];
  selectedTask: ITask;
  history: TReduxBoardsHistory;
}
export type TReduxBoardsHistory = IBoard[][];
export interface IHandleDragStartAndDrop {
  (e: React.DragEvent<HTMLLIElement>, task: ITask, board: IBoard): void;
}
export interface IHandleDropOnEmpty {
  (e: React.DragEvent<HTMLDivElement>, board: IBoard): void;
}
export interface IHandleDragOver {
  (e: React.DragEvent<HTMLLIElement> | React.DragEvent<HTMLDivElement>): void;
}
export interface IHandleDragEnd {
  (e: React.DragEvent<HTMLLIElement>): void;
}
export interface IModalProps {
  edit?: boolean;
}
