import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import '../styles/LoginEmail.css';

function LoginEmail() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user_type, setUserType] = useState('driver'); 
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, user_type }) // Send the username, password, and userType
      });
      const data = await response.json();
      if (response.status === 200) {
        setUser({ username, user_type });
        if (user_type === 'driver') {
          navigate('/trip-request');
        } else if (user_type === 'passenger') {
          navigate('/ride-request');
        }
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
        <center><h1>Login</h1></center>
          <label>Username<br></br></label>
          <div className="form-input-box">
          <input 
            type="text" 
            value={username} 
            onChange={handleUsernameChange} 
            placeholder="Please input your username..."
            required
          />
         </div>
          <label>Password<br></br></label>
          <div className="form-input-box">
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            placeholder="Please input your password here..."
            required
          />
          </div>
          <label>User Type<br></br></label>
          <div className="form-input-box">
          <select value={user_type} onChange={handleUserTypeChange} required>
            <option value="driver">Driver</option>
            <option value="passenger">Passenger</option>
          </select>
          </div>
        <button type="submit">Log In</button>
      </form>
      <button onClick={() => navigate(`/sign-up`)} className={"blueButton"}>Sign Up</button>
    </div>
  );
}

export default LoginEmail;