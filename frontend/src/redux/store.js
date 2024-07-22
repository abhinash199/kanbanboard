import { configureStore } from '@reduxjs/toolkit'; // Import the configureStore function from Redux Toolkit
import taskReducer from '../features/taskSlice'; // Import the taskReducer from the taskSlice

// Configure and export the Redux store
export default configureStore({
  reducer: {
    // Define the slice of state for tasks
    tasks: taskReducer, // Assign the taskReducer to the 'tasks' key in the state
  },
});
