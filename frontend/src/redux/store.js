import { configureStore } from '@reduxjs/toolkit'; 
import taskReducer from '../features/taskSlice'; 
// Configure and export the Redux store
export default configureStore({
  reducer: {
  
    tasks: taskReducer, // Assign the taskReducer to the 'tasks' key in the state
  },
});
