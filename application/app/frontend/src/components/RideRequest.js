import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCoordinates } from '../api/api';
import styles from '../styles/RideRequest.module.css';
import { UserContext } from './UserContext';
import Alert from '@mui/material/Alert';

function RideRequest() {
    const { user, setUser } = useContext(UserContext);
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropoffAddress, setDropoffAddress] = useState('');
    const [tripWindows, setTripWindows] = useState({
        pickup_window_start: "",
        pickup_window_end: ""
    });
    const [errors, setErrors] = useState({});
    const [tripRequestId, setTripRequestId] = useState('');
    const [alertMessage, setAlertMessage] = useState('');  // New state for alert message
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleTimeChange = (event) => {
        const { name, value } = event.target;
        setTripWindows(prevState => ({
            ...prevState,
            [name]: value + ":00"
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleAddressChange = (event, type) => {
        if (type === "pickup") {
            setPickupAddress(event.target.value);
        } else {
            setDropoffAddress(event.target.value);
        }
        if (errors[type]) {
            setErrors(prev => ({ ...prev, [type]: false }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!pickupAddress) newErrors.pickup = true;
        if (!dropoffAddress) newErrors.dropoff = true;
        Object.keys(tripWindows).forEach(key => {
            if (!tripWindows[key]) newErrors[key] = true;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const requestCost = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            console.log('Validation failed');
            return;
        }

        try {
            const pickupCoords = await fetchCoordinates(pickupAddress);
            const dropoffCoords = await fetchCoordinates(dropoffAddress);

            const tripData = {
                start_location: { ...pickupCoords},
                end_location: { ...dropoffCoords},
            };
            console.log(tripData);

            const url = "/trip_request/cost";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(tripData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Cost requested created successfully:', data);
                setErrorMessage(data.Message);
            } else {
                throw new Error('Failed to send cost request');
            }
        } catch (error) {
            console.error('Error sending cost request:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            console.log('Validation failed');
            return;
        }

        try {
            const pickupCoords = await fetchCoordinates(pickupAddress);
            const dropoffCoords = await fetchCoordinates(dropoffAddress);

            const tripData = {
                username: user.username,
                pickup_location: { ...pickupCoords, "address": pickupAddress },
                dropoff_location: { ...dropoffCoords, "address": dropoffAddress },
                ...tripWindows
            };
            console.log(tripData);

            const url = "/trip_request/create";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(tripData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Ride request created successfully:', data);
                setSuccessMessage('Your ride request has been created successfully.');
                setTripRequestId(data.id);
                setAlertMessage('Ride request created successfully!');  // Set alert message
            } else {
                throw new Error('Failed to create trip request');
            }
        } catch (error) {
            console.error('Error creating trip request:', error);
            setAlertMessage('Failed to create ride request.');  // Set alert message
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className={styles.tripRequest}>
            {alertMessage && (
                <div className={styles.alert}>
                    {alertMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h1>Create Ride Request</h1>
                {errorMessage && <Alert severity="info">Your trip will cost ${errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <div className={styles.gridContainer}>
                    <label className={styles.fullWidth}>
                        <div className={styles.formText}>Pickup Window Start:</div>
                        <input type="datetime-local" name="pickup_window_start" value={tripWindows.pickup_window_start.replace(':00', '')} onChange={handleTimeChange} className={errors.pickup_window_start ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        <div className={styles.formText}>Pickup Window End:</div>
                        <input type="datetime-local" name="pickup_window_end" value={tripWindows.pickup_window_end.replace(':00', '')} onChange={handleTimeChange} className={errors.pickup_window_end ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        <div className={styles.formText}>Pickup Address:</div>
                        <input type="text" value={pickupAddress} onChange={(e) => handleAddressChange(e, "pickup")} className={errors.pickup ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        <div className={styles.formText}>Dropoff Address:</div>
                        <input type="text" value={dropoffAddress} onChange={(e) => handleAddressChange(e, "dropoff")} className={errors.dropoff ? styles.errorInput : styles.inputField} />
                    </label>
                </div>
                <center><button onClick={requestCost} className={styles.button}>Request Cost</button></center>
                <center><button type="submit" className={styles.button}>Create Trip Request</button></center>
            </form>
            <center>
                <button onClick={() => navigate('/request-list')} className={styles.blueButton}>Your Requests List</button>
                <button onClick={handleLogout} className={styles.blueButton}>Logout</button></center>
        </div>
    );
}

export default RideRequest;
