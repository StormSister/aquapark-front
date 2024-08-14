import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const FACEBOOK_AUTH_URL = "https://www.facebook.com/v9.0/dialog/oauth";
const CLIENT_ID_GITHUB = "Ov23cttR7FRTprWVpX9f";
const CLIENT_ID_GOOGLE = "455221087498-44o0554b9vgaolge26qubasis17a1e8r.apps.googleusercontent.com";
const CLIENT_ID_FACEBOOK = "467033489628413";

const loginWithGitHub = () => {
  const redirectUri = "http://localhost:8080/login/oauth2/code/github";
  const authUrl = `${GITHUB_AUTH_URL}?client_id=${CLIENT_ID_GITHUB}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  window.location.href = authUrl;
};

const loginWithGoogle = () => {
  const redirectUri = "http://localhost:8080/login/oauth2/code/google";
  const authUrl = `${GOOGLE_AUTH_URL}?client_id=${CLIENT_ID_GOOGLE}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;
  window.location.href = authUrl;
};

const loginWithFacebook = () => {
  const redirectUri = "http://localhost:8080/login/oauth2/code/facebook";
  const authUrl = `${FACEBOOK_AUTH_URL}?client_id=${CLIENT_ID_FACEBOOK}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email%20public_profile`;
  window.location.href = authUrl;
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = { username: email, password };
    try {
      const response = await fetch('http://localhost:8080/apiLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      if (data.jwtToken) {
        onLogin(data.jwtToken);
        localStorage.setItem('accessToken', data.jwtToken);
        console.log("JWT TOKEN: " + data.jwtToken)
        navigate('/');
      } else {
        throw new Error('Token not received');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Logowanie</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Hasło</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                <button type="submit" className="btn btn-primary">Zaloguj</button>
              </form>
              <div className="mt-3">
                <button onClick={loginWithGitHub} className="btn btn-secondary">Zaloguj przez GitHub</button>
                <button onClick={loginWithGoogle} className="btn btn-danger">Zaloguj przez Google</button>
                <button onClick={loginWithFacebook} className="btn btn-primary">Zaloguj przez Facebook</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;