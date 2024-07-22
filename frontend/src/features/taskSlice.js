import { createSlice } from '@reduxjs/toolkit';

// Initial state with an empty array of tasks
const initialTasks = [];

// Create a slice for task management
const taskSlice = createSlice({
  name: 'tasks', // Name of the slice
  initialState: {
    tasks: initialTasks, // Initial state with tasks array
  },
  reducers: {
    // Action to add a new task
    addTask: (state, action) => {
      state.tasks.push(action.payload); // Add the new task to the tasks array
    },
    
    // Action to delete a task by ID
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload); // Remove the task with the given ID
    },
    
    // Action to update an existing task
    updateTask: (state, action) => {
      const { id, name, priority, deadline } = action.payload;
      const existingTask = state.tasks.find(task => task.id === id); // Find the task to update
      if (existingTask) {
        existingTask.name = name; // Update task name
        existingTask.priority = priority; // Update task priority
        existingTask.deadline = deadline; // Update task deadline
      }
    },
    
    // Action to move a task to a different stage
    moveTask: (state, action) => {
      const { taskId, stage } = action.payload;
      const taskToMove = state.tasks.find(task => task.id === taskId); // Find the task to move
      if (taskToMove) {
        taskToMove.stage = stage; // Update the stage of the task
      }
    },
    
    // New action to reorder tasks within the same stage
    reorderTask: (state, action) => {
      const { sourceIndex, destinationIndex, stage } = action.payload;
      const tasksInStage = state.tasks.filter(task => task.stage === stage); // Get tasks in the same stage
      const [removedTask] = tasksInStage.splice(sourceIndex, 1); // Remove the task from the source index
      tasksInStage.splice(destinationIndex, 0, removedTask); // Insert the removed task at the destination index
    },
  },
});

// Export the actions to be used in components
export const { addTask, deleteTask, updateTask, moveTask, reorderTask } = taskSlice.actions;

// Export the reducer to be used in the Redux store
export default taskSlice.reducer;
