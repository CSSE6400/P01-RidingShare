import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LoginEmail.css';

function LoginEmail() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType;

  useEffect(() => {
    if (!userType) {
      alert('User type is not specified!');
      navigate('/login');
    }
  }, [userType, navigate]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })  // Send the username and password
      });
      const data = await response.json();
      if (response.status === 200) {
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login as {userType}</h2>
        <div>
          <label>Username<br></br></label>
          <input 
            type="text" 
            value={username} 
            onChange={handleUsernameChange} 
            placeholder="Please input your username..."
            required
          />
        </div>
        <div>
          <label>Password<br></br></label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="Please input your password here..."
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginEmail;
