import React, { useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await fetch("http://localhost:8080/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });
      if (!res.ok) {
        throw new Error("Google login failed");
      }
      const data = await res.json();
      onLogin(data.accessToken, data.role, data.email);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login error:", error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
      const data = await response.json();
      onLogin(data.accessToken, data.role, data.email);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="989943132222-qtoql2ris1q1eur7spiu7tkt5e25eh6i.apps.googleusercontent.com">
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Logowanie</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Nazwa użytkownika
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Hasło
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Zaloguj
                  </button>
                </form>
                <div className="mt-3">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
