import React from "react"; 
import ReactDOM from "react-dom/client"; 
import "./index.css"; 
import App from "./App"; 
import reportWebVitals from "./reportWebVitals"; // Import the reportWebVitals function for performance metrics

import { Provider } from "react-redux"; // Import Provider to connect Redux store
import store from "./redux/store"; // Import the Redux store

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling
import { BrowserRouter } from "react-router-dom"; 
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider for Google authentication

// Create the root element for the React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Get client ID from environment variable
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Render the application
root.render(
  <React.StrictMode>
    {/* Wrap the app with GoogleOAuthProvider for Google login */}
    <GoogleOAuthProvider clientId={googleClientId}>
      {/* Wrap the app with BrowserRouter for routing */}
      <BrowserRouter>
        {/* Wrap the app with Provider to connect Redux store */}
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); // Measure performance and send metrics to an analytics endpoint if needed
