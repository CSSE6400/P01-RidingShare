import React, { useEffect } from 'react';
import '../styles/Login.css'; // Assuming your styles are in this file

function Login() {
  useEffect(() => {
    // Simplify the addition and removal of event listeners
    const handleDriverLogin = () => loginUser('driver');
    const handleRiderLogin = () => loginUser('rider');

    const driverBtn = document.getElementById('driverButton');
    const riderBtn = document.getElementById('riderButton');

    driverBtn.addEventListener('click', handleDriverLogin);
    riderBtn.addEventListener('click', handleRiderLogin);

    return () => {
      driverBtn.removeEventListener('click', handleDriverLogin);
      riderBtn.removeEventListener('click', handleRiderLogin);
    };
  }, []);

  function loginUser(userType) {
    console.log(`Login attempted for ${userType}`);
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userType })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Login successful:', data);
      window.location.href = '/dashboard'; // Redirect to a dashboard or appropriate page
    })
    .catch((error) => {
      console.error('Error during login:', error);
      alert('Login failed, please try again.');
    });
  }

  return (
    <div className="login-container">
      <h2>LOG IN</h2>
      <button className="login-button driver" id="driverButton">Driver</button>
      <button className="login-button rider" id="riderButton">Rider</button>
    </div>
  );
}

export default Login;
