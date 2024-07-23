import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../features/taskSlice"; // Import the action to fetch tasks
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks.tasks);

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  const res = tasks.filter((item) => item.userID == auth.userID);
  const totalTasks = res.length;
  const completedTasks = res.filter((task) => task.stage === 3).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-0">Dashboard</h2>
      <div className="dashboard-count">
        {/* Display total tasks */}
        <div className="bg-primary text-white fw-semibold">
          Total
          <span>{totalTasks}</span>
        </div>
        {/* Display completed tasks */}
        <div className="bg-success text-white fw-semibold">
          Completed<span>{completedTasks}</span>
        </div>
        {/* Display pending tasks */}
        <div className="bg-warning text-white fw-semibold">
          Pending<span>{pendingTasks}</span>
        </div>
      </div>
      <div className="text-center px-4">
        <p className="text-muted text-center">
          You've successfully accessed your dashboard! To manage your tasks more
          effectively, click the button below to go to your TaskBoard where you
          can organize and track your tasks in detail.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/taskboard")}
        >
          Go to Taskboard
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
