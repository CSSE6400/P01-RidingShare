import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { useNavigate } from "react-router-dom"; 

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await loginUser({
                username: username,
                password: password
            });
            console.log('Login successful:', data);
            navigate('/trip-request', { state: { username } });
        } catch (error) {
            setErrorMessage('Login failed: ' + error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <button type="submit">Log In</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default Login;
