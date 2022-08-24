import { createSlice } from "@reduxjs/toolkit";
import { IReduxBoards, IBoard } from "../../interfaces";

const initialState: IReduxBoards = {
  items: [],
  selectedTask: {},
  history: [],
};

const trelloSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    fetchBoards(state, { payload }) {
      state.items = [...payload];
    },
    addTask(state, { payload }) {
      state.items[0].tasks = [...state.items[0].tasks, payload];
      state.history = [...state.history, state.items];
    },
    selectTask(state, { payload }) {
      state.selectedTask = { ...payload };
    },
    editTask(state, { payload }) {
      state.items.forEach((board: IBoard) => {
        board.tasks.find(el => {
          if (el.id === payload.id) {
            el.text = payload.text;
          }
        });
      });
      state.history = [...state.history, state.items];
    },
    removeTask(state, { payload }) {
      state.items.forEach((board: IBoard) => {
        board.tasks = board.tasks.filter(item => item.id !== payload);
        state.history = [...state.history, state.items];
      });
    },
    pushInHistory(state, { payload }) {
      if (!payload.length) return;
      if (
        JSON.stringify(state.history[state.history.length - 1]) ===
        JSON.stringify(payload)
      )
        return;
      state.history = [...state.history, payload];
    },
  },
});

export const {
  fetchBoards,
  addTask,
  selectTask,
  editTask,
  removeTask,
  pushInHistory,
} = trelloSlice.actions;

export default trelloSlice.reducer;
