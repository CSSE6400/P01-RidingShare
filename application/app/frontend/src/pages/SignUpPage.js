import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css'

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [maxAvailableSeat, setMaxAvailableSeat] = useState(3);
    const [licencePlate, SetLicencePlate] = useState('');
    const [user_type, setUserType] = useState('driver');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handlePhoneNoChange = (event) => {
        setPhoneNo(parseInt(event.target.value));
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleMaxAvailableSeatChange = (event) => {
        setMaxAvailableSeat(parseInt(event.target.value));
    }

    const handleLicencePlateChange = (event) => {
        SetLicencePlate(event.target.value);
    }
    
    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (user_type === 'driver') {
                const response = await fetch('/driver/create', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { 
                            username: username, 
                            password: password, 
                            name: name,
                            phone_number: phoneNo,
                            email: email,
                            max_available_seats: maxAvailableSeat,
                            licence_plate: licencePlate 
                        }
                    )
                });
                const data = await response.json();
                if (response.status === 201) {
                    navigate('/');
                }
                else {
                    alert(data.error);
                }
            } else {
                const response = await fetch('/passenger/create', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { 
                            username: username, 
                            password: password, 
                            name: name,
                            phone_number: phoneNo,
                            email: email
                        }
                    )
                });
                const data = await response.json();
                if (response.status === 201) {
                    navigate('/');
                } else {
                    alert(data.error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            // eslint-disable-next-line eqeqeq
            if (error == "SyntaxError: Unexpected token 'U', \"User accou\"... is not valid JSON") {
                alert("User account is already registered")
            }
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1><center>Sign Up</center></h1>
                <label>User Type</label>
                <div className="form-input-box">
                    <select value={user_type} onChange={handleUserTypeChange} required>
                        <option value="driver">Driver</option>
                        <option value="passenger">Passenger</option>
                    </select>
                </div>
                <label>Username</label>
                <div className="form-input-box">
                    <input 
                        type="text" 
                        value={username} 
                        onChange={handleUsernameChange} 
                        placeholder="Please input your username..."
                        required
                    />
                </div>
                <label>Password</label>
                <div className="form-input-box">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={handlePasswordChange} 
                        placeholder="Please input your password here..."
                        required
                    />
                </div>
                <label>Name</label>
                <div className="form-input-box">
                    <input 
                        type="text" 
                        value={name} 
                        onChange={handleNameChange} 
                        placeholder="Please input your name here..."
                        required
                    />
                </div>
                <label>Phone Number</label>
                <div className="form-input-box">
                    <input 
                        type="text"
                        pattern="[0-9]*"
                        value={phoneNo} 
                        onChange={handlePhoneNoChange} 
                        maxLength="11"
                        placeholder="Please input your phone number here..."
                        required
                    />
                </div>
                <label>Email</label>
                <div className="form-input-box">
                    <input 
                        type="text" 
                        value={email} 
                        onChange={handleEmailChange} 
                        placeholder="Please input your email here..."
                        required
                    />
                </div>
                {user_type === 'driver' && (
                    <>
                        <label>Available Seats</label>
                        <div className="form-input-box">
                            <select value={maxAvailableSeat} onChange={handleMaxAvailableSeatChange} required>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <label>Licence Plate</label>
                        <div className="form-input-box">
                            <input 
                                type="text" 
                                value={licencePlate} 
                                onChange={handleLicencePlateChange} 
                                placeholder="Please input your licence plate here..."
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">SignUp</button>
            </form>
            <button onClick={() => navigate(`/`)} className={"blueButton"}>Login</button>
        </div>
    );
}

export default SignUpPage;