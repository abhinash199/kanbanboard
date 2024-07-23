import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonComponent from "../common/ButtonComponent";

const Signup = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    contactNumber: "",
    password: "",
    profileImage: null,
  });

  const navigate = useNavigate();

  // Base API url
  const API_URL = process.env.REACT_APP_API_URL;

  // State to manage form validation errors
  const [errors, setErrors] = useState({});

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      // Handle file input for profile image
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      // Handle text input fields
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  // Validate individual form fields
  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "name":
        if (!value) errorMsg = "Name is required";
        break;
      case "username":
        if (!value) errorMsg = "Username is required";
        break;
      case "email":
        if (!value) {
          errorMsg = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email address is invalid";
        }
        break;
      case "password":
        if (!value) {
          errorMsg = "Password is required";
        } else if (value.length < 8 || value.length > 15) {
          errorMsg = "Password must be between 8 and 15 characters";
        }
        break;
      case "contactNumber":
        if (value && !/^\d{10}$/.test(value)) {
          errorMsg = "Contact Number must be exactly 10 digits";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  // Validate the entire form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || formData.password.length > 15) {
      newErrors.password = "Password must be between 8 and 15 characters";
    }
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact Number must be exactly 10 digits";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      // Create a FormData object for the file upload
      const signupData = new FormData();
      Object.keys(formData).forEach((key) => {
        signupData.append(key, formData[key]);
      });

      try {
        // Send registration request to the server
        const res = await axios.post(
          `${API_URL}/api/auth/register`,
          signupData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.data.token) {
          // Show success toast and redirect to login page
          toast.success("SignUp successful", {
            autoClose: 1000,
            onClose: () => navigate("/"),
          });
        } else {
          // Show error toast with server message
          toast.error(`${res.data.message}`, {
            autoClose: 2000,
          });
        }
      } catch (err) {
        // Show generic error toast
        toast.error("An error occurred during signup", {
          autoClose: 2000,
        });
      }
    } else {
      // Set form errors if validation fails
      setErrors(formErrors);
    }
  };

  return (
    <>
      <Container style={{ margin: "0 auto" }}>
        <Row
          className="justify-content-md-center signup-container"
          style={{ marginTop: "50px", paddingBottom: 50 }}
        >
          <Col md="6" className="form-container px-4">
            <h2 className="text-center p-3">Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              {/* Name field */}
              <Form.Group controlId="formName">
                <Form.Label className="fw-semibold mt-2">
                  Name <span className="asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Name"
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Username field */}
              <Form.Group controlId="formUsername">
                <Form.Label className="fw-semibold mt-2">
                  Username <span className="asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                  placeholder="Username"
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email field */}
              <Form.Group controlId="formEmail">
                <Form.Label className="fw-semibold mt-2">
                  Email address <span className="asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Email"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Contact Number field */}
              <Form.Group controlId="formContactNumber">
                <Form.Label className="fw-semibold mt-2">
                  Contact Number
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  onChange={handleChange}
                  value={formData.contactNumber}
                  placeholder="Contact Number"
                  isInvalid={!!errors.contactNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contactNumber}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password field */}
              <Form.Group controlId="formPassword">
                <Form.Label className="fw-semibold mt-2">
                  Password <span className="asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Password"
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Profile Image field */}
              <Form.Group controlId="formProfileImage">
                <Form.Label className="fw-semibold mt-2">
                  Profile Image
                </Form.Label>
                <Form.Control
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  placeholder="Profile Image"
                  isInvalid={!!errors.profileImage}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.profileImage}
                </Form.Control.Feedback>
              </Form.Group>
              {/* Submit button */}
              <ButtonComponent name="Register"/>
            </Form>
            <p className="mt-3">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
