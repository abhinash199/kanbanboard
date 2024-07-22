import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Col, Form, Container, Row, Button } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  // State to hold reCAPTCHA value
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  // State to manage form data
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  // State to manage form validation errors
  const [errors, setErrors] = useState({});
  // Get login function from AuthContext
  const { login } = useContext(AuthContext);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Base API url
  const API_URL = process.env.REACT_APP_API_URL;


  // Effect to reset reCAPTCHA value on component mount
  useEffect(() => {
    setRecaptchaValue(null);
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Validate individual form fields
  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value.trim()) {
      errorMsg = "Field cannot be empty";
    } else if (
      name === "usernameOrEmail" &&
      !/\S+@\S+\.\S+/.test(value) &&
      !/^\S+$/.test(value)
    ) {
      errorMsg = "Must be a valid email or username";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  // Validate the entire form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Field cannot be empty";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.usernameOrEmail) &&
      !/^\S+$/.test(formData.usernameOrEmail)
    ) {
      newErrors.usernameOrEmail = "Must be a valid email or username";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Field cannot be empty";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    // Proceed if no form errors and reCAPTCHA is completed
    if (Object.keys(formErrors).length === 0 && recaptchaValue) {
      try {
        // Send login request to the server
        const res = await axios.post(
          `${API_URL}/api/auth/login`,
          formData
        );
        if (res.data.token) {
          console.log(res, "response");
          const isLogin = true;
         
          // Show success toast and redirect to dashboard
          toast.success("Login successful!", {
            autoClose: 1000, // Close the toast after 1 second
            onClose: () =>{
                login(res.data.token, res.data.name, isLogin);
                navigate("/dashboard");
            } , // Redirect after the toast closes
          });
        }
      } catch (err) {
        console.error(err.response.data);
        // Show error toast on login failure
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } else {
      // Set form errors and show error toast if validation fails
      setErrors(formErrors);
      toast.error("Please fill in all fields and complete the reCAPTCHA ", {
        autoClose: 2000,
      });
    }
  };

  // Handle successful Google login
  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/google-login`,
        {
          tokenId: response.credential,
        }
      );
      if (res.data.token) {
        const isLogin = true;
        // Show success toast and redirect to dashboard
        toast.success("Google login successful!", {
          autoClose: 1000,
          onClose: () =>{
            login(res.data.token, res.data.username, isLogin);
            navigate("/dashboard");
          } 
        });
       
      }
    } catch (err) {
      console.error(err.response.data);
      // Show error toast on Google login failure
      toast.error("Google login failed. Please try again.");
    }
  };

  // Handle failed Google login
  const handleGoogleFailure = (response) => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <>
      <Container style={{ marginTop: "50px" }}>
        <Row
          className="justify-content-md-center align-item-center login-container"
          style={{ paddingBottom: 50 }}
        >
          <Col md="auto" className="form-container px-4">
            <h2 className="text-center p-3">Login</h2>
            <div className="social-login">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                className="mt-3"
              />
            </div>
            <div className="row or-divider">
              <div className="col">
                <hr />
              </div>
              <div className="col-auto">OR</div>
              <div className="col">
                <hr />
              </div>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmailOrUsername">
                <Form.Label className="fw-semibold mt-2">Username or Email address</Form.Label>
                <Form.Control
                  type="text"
                  name="usernameOrEmail"
                  onChange={handleChange}
                  value={formData.usernameOrEmail}
                  placeholder="Username or Email"
                  isInvalid={!!errors.usernameOrEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.usernameOrEmail}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label className="fw-semibold mt-2">Password</Form.Label>
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

              <ReCAPTCHA
                className="mt-3"
                sitekey="6LeTGRMqAAAAALlakjWFw2aPAvmshBIfFk4rwevO"
                onChange={(value) => setRecaptchaValue(value)}
              />
              <Button variant="primary" type="submit" className="mt-3 w-100">
                Login
              </Button>
            </Form>

            <p className="mt-3">
              Don't have an account? <Link to="/signup">Register</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
