import React from "react";

const Dashboard = (taskCounts) => {
  // Destructuring taskCounts from props
  const { totalTasks, completedTasks, pendingTasks } = taskCounts.taskCounts;
  
  

  return (
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
  );
};

export default Dashboard;
