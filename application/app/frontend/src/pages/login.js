import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate(); // Instantiate the navigate function

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
    // Redirect to the LoginEmail page upon login
    navigate('/loginPage');
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
