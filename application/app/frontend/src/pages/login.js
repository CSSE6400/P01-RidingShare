import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = userType => {
    navigate('/loginPage', { state: { userType } });
  };

  return (
    <div className="login-container">
      <h2>LOG IN</h2>
      <button onClick={() => handleLogin('driver')} className="login-button driver" id="driverButton">Driver</button>
      <button onClick={() => handleLogin('rider')} className="login-button rider" id="riderButton">Rider</button>
    </div>
  );
}

export default Login;
