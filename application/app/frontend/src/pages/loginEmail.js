import React, { useState } from 'react';
import '../styles/LoginEmail.css'; // Ensure the path is correct

function LoginEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email, 'Password:', password);
    // Add your logic for backend connection or validation here
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
