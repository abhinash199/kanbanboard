



import React, { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold authentication details
  const [auth, setAuth] = useState({ token: null, user: null, userID: null, isLogin: false });
  const navigate = useNavigate();
  const location = useLocation();
  // Effect to initialize authentication state from localStorage
  useEffect(() => {
    // Retrieve authentication details from localStorage
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const isLogin = JSON.parse(localStorage.getItem("isLogin"));
    const userID = localStorage.getItem("userID");
    // If valid authentication details are found, set them in the state
    if (token && user && isLogin && userID) {
      setAuth({ token, user, isLogin,userID });
      // Redirect to the dashboard or taskboard if a valid token is present
      const currentPath = location.pathname;
      if (currentPath == "/dashboard" || currentPath == "/taskboard") {
        navigate(`${currentPath}`);
      }else if(currentPath == "/"){
        navigate('/dashboard')
      }else{
        navigate('/not-found')
      }
    }
  }, []);

  // Function to handle user login
  const login = (token, user, isLogin,userID) => {
    setAuth({ token, user, isLogin, userID });
    // Store authentication details in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", user);
    localStorage.setItem("userID", userID);
    localStorage.setItem("isLogin", JSON.stringify(isLogin));
  };

  // Function to handle user logout
  const logout = () => {
    setAuth({ token: null, user: null,userID: null, isLogin: false });
    // Remove authentication details from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userID");
    localStorage.removeItem("isLogin");
    // Redirect to the login page after logout
    navigate("/");
  };

  return (
    // Provide authentication context to child components
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
