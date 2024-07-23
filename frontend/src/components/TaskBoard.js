import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// Import Redux actions for task management
import {
  addTask,
  deleteTask,
  updateTask,
  moveTask,
  reorderTask,
  setTasks,
} from "../features/taskSlice";
import { FaArrowRight, FaTrashAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDelete, MdModeEdit, MdOutlineUpdate } from "react-icons/md";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const TaskBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Select tasks from Redux state
  const [isDragging, setIsDragging] = useState(false); // State to manage drag status
  const navigate = useNavigate();

  // State to manage new task form
  const [newTask, setNewTask] = useState({
    name: "",
    priority: "low",
    deadline: "",
  });

  const [editTask, setEditTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null); // State to manage index of dragged over item
  const [showTrashConfirm, setShowTrashConfirm] = useState(false); // State to manage trash confirmation modal
  const JSON_API_URL = process.env.REACT_APP_JSON_API_URL;
  const { auth } = React.useContext(AuthContext);
  // Fetch tasks for the authenticated user
  useEffect(() => {
    if (auth.userID) {
      axios
        .get(`${JSON_API_URL}/tasks?userID=${auth.userID}`)
        .then((response) => {
          dispatch(setTasks(response.data));
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [auth.userID, dispatch]);

  // Handle input changes in the new task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Handle form submission for creating or updating tasks
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.deadline.trim()) {
      toast.error("Field cannot be empty!", {
        autoClose: 2000,
      });
      return;
    } else {
      axios
        .post(`${JSON_API_URL}/tasks`, {
          ...newTask,
          userID: auth.userID,
          stage: 0,
        })
        .then((response) => {
          dispatch(addTask(response.data));
          setNewTask({ name: "", priority: "low", deadline: "" }); // Reset form
          toast.success("New Task Created Successfully!", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          console.error("Error creating task:", error);
        });
    }
  };

  // Handle task deletion
  const handleDelete = (taskId) => {
    axios
      .delete(`${JSON_API_URL}/tasks/${taskId}`)
      .then(() => {
        dispatch(deleteTask(taskId)); // Dispatch task deletion to Redux store
        setShowTrashConfirm(false); // Hide confirmation modal
        toast.success("Deleted Successfully", {
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Error deleting task:", error); // Log errors
      });
  };

  // Handle moving tasks between stages
  const handleMove = (taskId, direction) => {
    const currentTask = tasks.find((task) => task.id === taskId);
    let newStage = currentTask.stage;

    if (direction === "forward" && newStage < 3) {
      newStage++;
    } else if (direction === "backward" && newStage > 0) {
      newStage--;
    }

    axios
      .patch(`${JSON_API_URL}/tasks/${taskId}`, { stage: newStage })
      .then(() => {
        dispatch(moveTask({ taskId, stage: newStage })); // Dispatch task movement to Redux store
      })
      .catch((error) => {
        console.error("Error moving task:", error);
      });
  };

  // Handle editing a task
  const handleEdit = (task) => {
    setEditTask(task); // Set task to be edited
    setNewTask({
      name: task.name,
      priority: task.priority,
      deadline: task.deadline,
    });
  };

  // Handle updating an edited task
  const handleUpdate = () => {
    if (!newTask.name.trim() || !newTask.deadline.trim()) {
      toast.error("Field cannot be empty", {
        autoClose: 2000,
      });
      return;
    } else {
      axios
        .put(`${JSON_API_URL}/tasks/${editTask.id}`, {
          ...editTask,
          ...newTask,
        })
        .then((response) => {
          dispatch(updateTask(response.data)); // Dispatch task update to Redux store
          setEditTask(null); // Clear edit state
          setNewTask({ name: "", priority: "low", deadline: "" });
          toast.success("Updated Successfully", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    }
  };

  // Cancel task editing
  const handleCancelEdit = () => {
    setEditTask(null);
    setNewTask({ name: "", priority: "low", deadline: "" });
  };

  // Handle drag start
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    setDraggedOverIndex(null);
    setIsDragging(true);
    setTimeout(() => {
      const draggedItem = document.getElementById(task.id.toString());
      if (draggedItem) {
        draggedItem.style.opacity = "0.3";
      }
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = (e, task) => {
    const draggedItem = document.getElementById(task.id.toString());
    if (draggedItem) {
      draggedItem.style.opacity = "1";
    }
    setDraggedTask(task);
    setIsDragging(false);
    setDraggedOverIndex(null);
  };

  // Handle drag over to allow dropping
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  // Handle drop event for moving tasks between stages
  const handleDrop = (e, stage) => {
    e.preventDefault();
    if (draggedTask && draggedTask.stage !== stage) {
      axios
        .patch(`${JSON_API_URL}/tasks/${draggedTask.id}`, { stage })
        .then(() => {
          dispatch(moveTask({ taskId: draggedTask.id, stage })); // Dispatch task movement to Redux store
        })
        .catch((error) => {
          console.error("Error dropping task:", error);
        });
    }
    setIsDragging(false);
    setDraggedTask(null);
  };

  // Handle drop event in the trash area to show confirmation
  const handleTrashDrop = (e) => {
    e.preventDefault();
    if (draggedTask) {
      setShowTrashConfirm(true);
    }
    setDraggedTask(null);
  };

  // Handle reordering tasks within a stage
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

  // Cancel deletion confirmation
  const cancelDelete = () => {
    setShowTrashConfirm(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center align-items-center md-px-4" style={{marginBottom:"30px"}}>
      <div
        style={{ cursor: "pointer", width: "100px" }}
        className="p-2 mb-2"
        onClick={() => navigate("/dashboard")}
      >
        <FaArrowLeft size={20} /> Back
      </div>

      <h2 className="text-center mx-auto">Task Management Board</h2>
      </div>
      
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
            {editTask ? "Update Task" : "Create Task"}
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

      <div
        className="row mt-4 task-board d-flex flex-column flex-lg-row"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          marginBottom: "8rem",
          minHeight: "500px",
        }}
      >
        {["Backlog", "To Do", "Ongoing", "Done"].map((stage, index) => (
          <div
            key={stage}
            className="col-lg-3 stage-container"
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            style={{ backgroundColor: "#F5F5F5", marginRight: 8 }}
          >
            <h3 className="stage-heading">{stage}</h3>
            <ul className="list-group">
              {tasks
                .filter((task) => task.stage === index)
                .map((task) => (
                  <li
                    key={task.id}
                    id={task.id.toString()}
                    className={`list-group-item text-break mb-2 d-flex justify-content-between flex-column`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={(e) => handleDragEnd(e, task)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleReorder(e, index)}
                  >
                    <span className="font-weight-bold">{task.name}</span>
                    <div className="d-flex justify-content-start align-items-center">
                      <div className="priority-container">
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
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <MdOutlineUpdate color="red" size={16} />
                        <small className="deadline-date text-muted">
                          {task.deadline}
                        </small>
                      </div>
                      <div>
                        <button
                          className="btn btn-link p-0 m-1"
                          onClick={() => handleMove(task.id, "backward")}
                          disabled={index === 0}
                        >
                          <FaArrowLeft color="black" size={14} />
                        </button>
                        <button
                          className="btn btn-link p-0 m-1"
                          onClick={() => handleMove(task.id, "forward")}
                          disabled={index === 3}
                        >
                          <FaArrowRight size={14} color="black" />
                        </button>
                        <button
                          className="btn btn-link p-0 m-1"
                          onClick={() => handleDelete(task.id)}
                        >
                          <MdDelete color="red" size={18} />
                        </button>
                        <button
                          className="btn btn-link p-0 m-1"
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

      {/* Trash drop area for confirming task deletion */}
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
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: 100,
            backgroundColor: "white",
            border: "1px dashed red",
          }}
        >
          <FaTrashAlt size={32} color="red" />
        </div>
      )}

      {/* Confirmation modal for task deletion */}
      {showTrashConfirm && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this task?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button
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
