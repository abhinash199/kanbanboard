import React, { useContext } from "react"; 
import Navbar from "react-bootstrap/Navbar"; 
import Container from "react-bootstrap/Container"; 
import { AuthContext } from "../context/AuthContext"; // Import AuthContext to access authentication state and actions
import {useNavigate } from "react-router-dom"; 
import {toast } from "react-toastify";
import { MdLogout } from "react-icons/md";

const Header = () => {
  // Initialize navigation hook
  const navigate = useNavigate();
  
  // Access authentication state and logout function from AuthContext
  const { auth, logout } = useContext(AuthContext);
 

  // Function to handle logout process
  function handleLogout() {
    toast.success("Logout successfull", {
      autoClose: 1000, // Toast will automatically close after 1 second
      onClose: () => {
        logout(); // Call the logout function to clear authentication state
        navigate("/"); // Redirect to home page after logout
      },
    });
  }

  return (
    <>
      {/* Navigation bar component */}
      <Navbar bg="dark" variant="dark">
        <Container className="px-2">
          {/* Brand link of the navbar */}
          <Navbar.Brand href="/">Kanban Board</Navbar.Brand>

          {/* Conditionally render user info and logout button if authenticated */}
          {auth.token && auth.isLogin && (
            <div>
              {/* Display user's greeting */}
              <span className="text-white user-info" onClick={handleLogout}>
                Hi, {auth.user}
              </span>

              {/* Logout button with icon */}
              <span
                style={{ cursor: "pointer", marginLeft: 12 }}
                className="btn btn-danger"
                onClick={handleLogout}
              >
                {" "}
                <MdLogout size={18} /> Logout
              </span>
            </div>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
