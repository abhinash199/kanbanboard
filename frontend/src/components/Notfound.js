import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const NotFound = () => {
    // Access authentication state from AuthContext
  const { auth } = useContext(AuthContext);
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      {auth.token && auth.isLogin ? (
        <Link to="/dashboard">Go to your dashboard</Link>
      ) : (
        <Link to="/">Sign in to access your dashboard</Link>
      )}
    </div>
  );
};

export default NotFound;
