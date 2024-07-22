import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Spinner from "react-bootstrap/Spinner";

// Lazy load components to optimize performance by splitting code into chunks
const TaskBoard = lazy(() => import("./components/TaskBoard"));
const Signup = lazy(() => import("./components/auth/SignUp"));
const Login = lazy(() => import("./components/auth/Login"));

const App = () => {
  return (
    <>
      {/* Provide authentication context to the application */}
      <AuthProvider>
        <Suspense
          // Fallback UI while lazy-loaded components are being fetched
          fallback={
            <div className="loader">
              <Spinner animation="border" variant="primary" />
            </div>
          }
        >
          <Header />

          {/* Define routes for different pages */}
          <Routes>
            {/* Route for signup page */}
            <Route path="/signup" element={<Signup />} />
            {/* Route for login page */}
            <Route path="/" element={<Login />} />
            {/* Route for dashboard page protected by PrivateRoute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TaskBoard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        {/* ToastContainer to display toast notifications */}
        <ToastContainer />
      </AuthProvider>
    </>
  );
};

// PrivateRoute component to restrict access to authenticated users only
const PrivateRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);

  // Redirect to login page if not authenticated
  if (!auth.token) {
    return <Navigate to="/" />;
  }

  // Render child components if authenticated
  return children;
};

export default App;
