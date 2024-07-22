import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Create a slice of the Redux store for tasks
export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [], // Initial state containing an empty array of tasks
  },
  reducers: {
    // Reducer to set the tasks state with a payload
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    // Reducer to add a new task to the tasks state
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    // Reducer to delete a task from the tasks state by its id
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    // Reducer to update an existing task in the tasks state
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    // Reducer to move a task to a different stage
    moveTask: (state, action) => {
      const { taskId, stage } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        task.stage = stage;
      }
    },
    // Reducer to reorder tasks within the same stage
    reorderTask: (state, action) => {
      const { sourceIndex, destinationIndex, stage } = action.payload;
      const tasksInStage = state.tasks.filter((task) => task.stage === stage);
      const [reorderedTask] = tasksInStage.splice(sourceIndex, 1);
      tasksInStage.splice(destinationIndex, 0, reorderedTask);

      state.tasks = state.tasks
        .filter((task) => task.stage !== stage)
        .concat(tasksInStage);
    },
  },
});

export const {
  setTasks,
  addTask,
  deleteTask,
  updateTask,
  moveTask,
  reorderTask,
} = taskSlice.actions;

//fetch tasks from the API
export const fetchTasks = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_JSON_API_URL}/tasks`
    );
    dispatch(setTasks(response.data));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export default taskSlice.reducer;
