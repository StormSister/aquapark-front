import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginSuccess = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jwtToken = queryParams.get('jwtToken');

    if (jwtToken) {
      onLogin(jwtToken);
      navigate('/'); 
    }
  }, [location, onLogin, navigate]);

  return (
    <div>
      <p>Logging in...</p>
    </div>
  );
};

export default LoginSuccess;