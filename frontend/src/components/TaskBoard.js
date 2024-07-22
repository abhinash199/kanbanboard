import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector for Redux actions and state
import {
  addTask,
  deleteTask,
  updateTask,
  moveTask,
  reorderTask,
} from "../features/taskSlice"; // Import Redux actions for task management

import Dashboard from "./Dashboard";
import { FaArrowRight, FaTrashAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDelete, MdModeEdit, MdOutlineUpdate } from "react-icons/md";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { toast } from "react-toastify";

const TaskBoard = () => {
  const dispatch = useDispatch(); // Initialize dispatch function for Redux actions
  const tasks = useSelector((state) => state.tasks.tasks); // Get tasks from Redux store
  const [isDragging, setIsDragging] = useState(false); // State to track dragging status
  const [newTask, setNewTask] = useState({
    // State to manage new task form
    name: "",
    priority: "low",
    deadline: "",
  });

  const [editTask, setEditTask] = useState(null); // State to manage editing a task
  const [draggedTask, setDraggedTask] = useState(null); // State to track dragged task
  const [draggedOverIndex, setDraggedOverIndex] = useState(null); // State to track index of dragged over item
  const [showTrashConfirm, setShowTrashConfirm] = useState(false); // State to show confirmation modal for delete

  // Calculate task counts for Dashboard
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.stage === 3).length;
  const pendingTasks = totalTasks - completedTasks;

  // Handle input changes in the new task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Handle task creation or update form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.deadline.trim()) {
      toast.error("Field cannot be empty!", {
        autoClose: 2000,
      });
      return;
    } else {
      dispatch(addTask({ ...newTask, stage: 0, id: Date.now() }));
      setNewTask({ name: "", priority: "low", deadline: "" });
      toast.success("New Task Created Successfully!", {
        autoClose: 2000,
      });
    }
  };

  // Handle task deletion
  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId));
    setShowTrashConfirm(false); // Hide confirmation modal after delete
    toast.success("Deleted Successfully", {
      autoClose: 2000,
    });
  };

  // Handle moving a task between stages
  const handleMove = (taskId, direction) => {
    const currentTask = tasks.find((task) => task.id === taskId);
    const currentIndex = tasks.indexOf(currentTask);
    let newStage = currentTask.stage;

    if (direction === "forward" && newStage < 3) {
      newStage++;
    } else if (direction === "backward" && newStage > 0) {
      newStage--;
    }

    dispatch(moveTask({ taskId, stage: newStage }));
  };

  // Handle editing a task
  const handleEdit = (task) => {
    setEditTask(task);
    setNewTask({
      name: task.name,
      priority: task.priority,
      deadline: task.deadline,
    });
  };

  // Handle updating a task
  const handleUpdate = () => {
    if (!newTask.name.trim() || !newTask.deadline.trim()) {
      toast.error("Field cannot be empty", {
        autoClose: 2000,
      });
      return;
    } else {
      dispatch(updateTask({ id: editTask.id, ...newTask }));
      setEditTask(null);
      setNewTask({ name: "", priority: "low", deadline: "" });
      toast.success("Updated Successfully", {
        autoClose: 2000,
      });
    }
  };

  // Cancel editing a task
  const handleCancelEdit = () => {
    setEditTask(null);
    setNewTask({ name: "", priority: "low", deadline: "" });
  };

  // Handle drag start event
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    setDraggedOverIndex(null); // Reset dragged over index when dragging starts
    setIsDragging(true); // Set dragging state to true
    // Adding a little delay before setting opacity to make drag more visible
    setTimeout(() => {
      const draggedItem = document.getElementById(task.id.toString());
      if (draggedItem) {
        draggedItem.style.opacity = "0.3";
      }
    }, 0);
  };

  // Handle drag end event
  const handleDragEnd = (e, task) => {
    const draggedItem = document.getElementById(task.id.toString());
    if (draggedItem) {
      draggedItem.style.opacity = "1";
    }
    setDraggedTask(task);
    setIsDragging(false); // Set dragging state to false
    setDraggedOverIndex(null);
  };

  // Handle drag over event for reordering
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  // Handle drop event for reordering tasks
  const handleDrop = (e, stage) => {
    e.preventDefault();
    if (draggedTask && draggedTask.stage !== stage) {
      dispatch(moveTask({ taskId: draggedTask.id, stage }));
    }
    setIsDragging(false);
    setDraggedTask(null);
  };

  // Handle drop event for trash area
  const handleTrashDrop = (e) => {
    e.preventDefault();
    if (draggedTask) {
      setShowTrashConfirm(true);
    }
    setDraggedTask(null);
  };

  // Handle reordering tasks within the same stage
  const handleReorder = (e, stage) => {
    e.preventDefault();
    if (draggedTask && draggedOverIndex !== null) {
      const sourceIndex = tasks.findIndex(
        (task) => task.id === draggedTask.id && task.stage === stage
      );
      if (sourceIndex > -1 && draggedOverIndex !== sourceIndex) {
        dispatch(
          reorderTask({
            sourceIndex,
            destinationIndex: draggedOverIndex,
            stage,
          })
        );
      }
    }
    setDraggedTask(null);
    setDraggedOverIndex(null);
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setShowTrashConfirm(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Task Management Board</h2>

      <Dashboard taskCounts={{ totalTasks, completedTasks, pendingTasks }} />

      {/* Task creation form */}
      <div className="row task-creation">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Task Name"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-control mb-2"
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control mb-2"
            placeholder="Deadline"
            name="deadline"
            value={newTask.deadline}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 action-btn">
          <button
            type="button"
            className={`btn btn-${
              editTask ? "warning" : "success"
            } btn-block mb-2`}
            onClick={editTask ? handleUpdate : handleSubmit}
          >
            {editTask ? "Update Task" : 'Create Task'}
          </button>
        </div>
        {editTask && (
          <div className="col-md-2 action-btn">
            <button
              className="btn btn-secondary btn-block mb-2"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Task management board */}
      <div
        className="row mt-4 task-board d-flex flex-column flex-lg-row  "
        style={{
          display: "flex",
          flexWrap: "nowrap",
          marginBottom: "8rem",
          minHeight: "500px",
        }}
      >
        {[0, 1, 2, 3].map((stage) => (
          <div
            key={stage}
            className="col-lg-3 stage-container"
            onDragOver={(e) => handleDragOver(e, stage)}
            onDrop={(e) => handleDrop(e, stage)}
            style={{ backgroundColor: "#F5F5F5", marginRight: 8 }}
          >
            <h3 className="stage-heading">
              {stage === 0 && "Backlog"}
              {stage === 1 && "To Do"}
              {stage === 2 && "Ongoing"}
              {stage === 3 && "Done"}
            </h3>
            <ul className="list-group">
              {tasks
                .filter((task) => task.stage === stage)
                .map((task, index) => (
                  <li
                    key={task.id}
                    style={{ lineBreak: "anywhere" }}
                    id={task.id.toString()}
                    className={`list-group-item mb-2 d-flex justify-content-between flex-column`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={(e) => handleDragEnd(e, task)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleReorder(e, stage)}
                  >
                    <span
                      className="font-weight-bold"
                      style={{ fontWeight: "600", fontSize: 16 }}
                    >
                      {task.name}
                    </span>
                    <div className="d-flex justify-content-start align-items-center">
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "8px",
                          }}
                        >
                          {task.priority === "low" ? (
                            <FcLowPriority />
                          ) : task.priority === "medium" ? (
                            <FcMediumPriority />
                          ) : (
                            <FcHighPriority />
                          )}
                          <span className="priority-text">{task.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <MdOutlineUpdate color="red" size={16} />
                        <small className="deadline-date text-muted">
                          {task.deadline}
                        </small>
                      </div>
                      <div>
                        <button
                          title="backward"
                          className="p-0 m-1 border-0 bg-transparent"
                          onClick={() => handleMove(task.id, "backward")}
                          disabled={stage === 0}
                        >
                          <FaArrowLeft size={14} />
                        </button>
                        <button
                          title="forward"
                          role="button"
                          className="p-0 m-1 border-0 bg-transparent"
                          onClick={() => handleMove(task.id, "forward")}
                          disabled={stage === 3}
                        >
                          <FaArrowRight size={14} />
                        </button>
                        <button
                          title="delete"
                          className="p-0 m-1 border-0 bg-transparent"
                          onClick={() => handleDelete(task.id)}
                          draggable={false} // Disable drag for delete button
                        >
                          <MdDelete color="red" size={18} />
                        </button>
                        <button
                          title="edit"
                          className="p-0 m-1 border-0 bg-transparent"
                          onClick={() => handleEdit(task)}
                        >
                          <MdModeEdit size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Trash Drop Area */}
      {isDragging && (
        <div
          className="trash-drop-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleTrashDrop}
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            borderRadius: "50%",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 300,
            height: 100,
          }}
        >
          <FaTrashAlt size={32} color="red" />
        </div>
      )}

      {/* Trash Confirmation Modal */}
      {showTrashConfirm && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this task?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(draggedTask.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
