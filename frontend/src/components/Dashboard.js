// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// const Dashboard = (taskCounts) => {

//   const tasks = useSelector((state) => state.tasks.tasks);

//   // Calculate task counts for Dashboard
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter((task) => task.stage === 3).length;
//   const pendingTasks = totalTasks - completedTasks;
//   const navigate =useNavigate()
 

//   return (
//     <div className="container">
//     <div className="dashboard-count">
//       {/* Display total tasks */}
//       <div className="bg-primary text-white fw-semibold">
//         Total
//         <span>{totalTasks}</span>
//       </div>
//       {/* Display completed tasks */}
//       <div className="bg-success text-white fw-semibold">
//         Completed<span>{completedTasks}</span>
//       </div>
//       {/* Display pending tasks */}
//       <div className="bg-warning text-white fw-semibold">
//         Pending<span>{pendingTasks}</span>
//       </div>
     
//     </div>
//     <div className="text-center px-4">
//     <p className="text-muted text-center">You've successfully accessed your dashboard!. To manage your tasks more effectively, click the button below to go to your TaskBoard where you can organize and track your tasks in detail.</p>
//     <button className="btn btn-primary" onClick={() => navigate('/taskboard')}>Go to Taskboard</button>
//     </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../features/taskSlice"; // Import the action to fetch tasks

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks.tasks);

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  // Calculate task counts for Dashboard
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.stage === 3).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="container">
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
          You've successfully accessed your dashboard! To manage your tasks more effectively, click the button below to go to your TaskBoard where you can organize and track your tasks in detail.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/taskboard')}>
          Go to Taskboard
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

