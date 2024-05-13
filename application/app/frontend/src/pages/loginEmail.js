import React, { useState } from 'react';
import '../styles/LoginEmail.css';
import { useNavigate } from 'react-router-dom';  

function LoginEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from submitting traditionally
    try {
      const response = await fetch('http://localhost:8080/check_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email})  // Send the email to check
      });
      const data = await response.json();
      if (data.exists) {
        // Email exists, proceed with login verification
        navigate('/login');  // Redirect to dashboard if login is successful
      } else {
        // Email does not exist
        alert('Email does not exist');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>LOG IN</h2>
        <div>
          <label>Email<br></br></label>
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            placeholder="Please input your email..."
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
