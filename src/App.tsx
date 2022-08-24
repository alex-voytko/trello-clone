import { useCallback, useEffect, useState, createContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as trello_slice from "./redux/trello-redux/trello-slice";
import AppBar from "./components/AppBar";
import ToolBar from "./components/ToolBar";
import Container from "./components/Container";
import BoardList from "./components/BoardList";
import Modal from "./components/Modal";
import initialState from "./data/initialState.json";
import { IReduxState } from "./interfaces";

interface IActionContext {
  handleClick: (a: string) => void;
  onCloseModal: () => void;
}
export const actionContext = createContext({} as IActionContext);

function App() {
  const dispatch = useDispatch();
  const boards = useSelector((state: IReduxState) => state.boards.items);
  const selectedTask = useSelector(
    (state: IReduxState) => state.boards.selectedTask,
  );
  const history = useSelector((state: IReduxState) => state.boards.history);

  const [modalToggle, setModalToggle] = useState(false);
  const [clickType, setClickType] = useState("");
  const [i, setI] = useState(0);
  const actionContextFuncs: IActionContext = {
    handleClick: (val: string) => setClickType(val),
    onCloseModal: () => {
      setModalToggle(false);
      setClickType("");
    },
  };
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === "KeyZ") {
        if (!i) return;
        dispatch(trello_slice.fetchBoards(history[i - 1]));
        setI(i - 1);
      }
      if (e.ctrlKey && e.code === "KeyY") {
        if (i === history.length - 1) return;
        dispatch(trello_slice.fetchBoards(history[i + 1]));
        setI(i + 1);
      }
    },
    [i],
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [handleKeyPress]);
  useEffect(
    useCallback(() => {
      setI(history.length - 1);
    }, [history]),
    [history],
  );
  useEffect(
    useCallback(() => {
      dispatch(trello_slice.fetchBoards(initialState));
      dispatch(trello_slice.pushInHistory(initialState));
    }, []),
    [],
  );
  useEffect(
    useCallback(() => {
      switch (clickType) {
        case "add-btn":
          setModalToggle(true);
          break;
        case "edit-btn":
          setModalToggle(true);
          break;
        case "remove-btn":
          dispatch(trello_slice.removeTask(selectedTask.id));
          dispatch(trello_slice.selectTask({}));
          setClickType("");
          break;
        default:
          break;
      }
    }, [clickType]),
    [clickType],
  );

  return (
    <Container className="App">
      <actionContext.Provider value={actionContextFuncs}>
        <AppBar />
        <Container>
          <ToolBar />
          <BoardList boards={boards} />
        </Container>
        {modalToggle && <Modal edit={clickType === "edit-btn"} />}
      </actionContext.Provider>
    </Container>
  );
}

export default App;
