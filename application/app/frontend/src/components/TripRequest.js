import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCoordinates } from '../api/api';
import styles from '../styles/TripRequest.module.css';
import { UserContext } from './UserContext';
import Alert from '@mui/material/Alert';

function TripRequest() {
    const { user, setUser } = useContext(UserContext);
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [tripDetails, setTripDetails] = useState({
        start_time: "",
        end_time: "",
        distance_addition: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTripDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleTimeChange = (event) => {
        const { name, value } = event.target;
        setTripDetails(prevState => ({
            ...prevState,
            [name]: value + ":00Z"
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    }

    const handleAddressChange = (event, type) => {
        if (type === "start") {
            setStartAddress(event.target.value);
        } else {
            setEndAddress(event.target.value);
        }
        if (errors[type]) {
            setErrors(prev => ({ ...prev, [type]: false }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!startAddress) newErrors.start = true;
        if (!endAddress) newErrors.end = true;
        Object.keys(tripDetails).forEach(key => {
            if (!tripDetails[key]) newErrors[key] = true;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            console.log('Validation failed');
            return; 
        }

        try {
            const startCoords = await fetchCoordinates(startAddress);
            const endCoords = await fetchCoordinates(endAddress);

            const tripData = {
                ...tripDetails,
                username: user.username,
                password: user.password,
                start_location: {...startCoords, "address": startAddress},
                end_location: {...endCoords, "address": endAddress}
            };

            const url = "/trip/create";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(tripData)
            });
            
            if (response.ok) {
                setErrorMessage('');
                const data = await response.json();
                console.log('Trip created successfully:', data);
                setSuccessMessage(data.message || 'Trip created successfully');
            } else {
                const data = await response.json();
                setSuccessMessage('');
                setErrorMessage(data.message || 'Failed to create trip');
                throw new Error('Failed to create trip');
            }
        } catch (error) {
            console.error('Error creating trip:', error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="tripRequest">
            <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h1>Create Trip </h1>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <div className={styles.gridContainer}>
                    <label className={styles.fullWidth}>
                        <div className={styles.formText}>Start Time:</div>
                        <input type="datetime-local" name="start_time" value={tripDetails.start_time.replace(':00Z', '')} onChange={handleTimeChange} className={errors.start_time ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                    <div className={styles.formText}>End Time:</div>
                        <input type="datetime-local" name="end_time" value={tripDetails.end_time.replace(':00Z', '')} onChange={handleTimeChange} className={errors.end_time ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                    <div className={styles.formText}>Start Address:</div>
                        <input type="text" value={startAddress} onChange={(e) => handleAddressChange(e, "start")} className={errors.start ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                    <div className={styles.formText}>End Address:</div>
                        <input type="text" value={endAddress} onChange={(e) => handleAddressChange(e, "end")} className={errors.end ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                    <div className={styles.formText}>Max Distance (km):</div>
                        <input type="number" name="distance_addition" value={tripDetails.distance_addition} onChange={handleChange} className={errors.distance_addition ? styles.errorInput : styles.inputField} />
                    </label>
                </div>
                <center><button type="submit" className={styles.button}>Create Trip</button></center>
            </form>
            <center>
            <button onClick={() => navigate('/trip-list')} className={styles.blueButton}>Go to Trip List</button>
            <button onClick={handleLogout} className={styles.blueButton}>Logout</button>
            </center>
        </div>
    );
}

export default TripRequest;
