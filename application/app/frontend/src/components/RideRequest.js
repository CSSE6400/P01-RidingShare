import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCoordinates } from '../api/api';
import styles from '../styles/TripRequest.module.css';
import { UserContext } from './UserContext';

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
    const navigate = useNavigate();

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
                setTripRequestId(data.id);
                navigate(`/trip-info/${data.id}`);
            } else {
                throw new Error('Failed to create trip request');
            }
        } catch (error) {
            console.error('Error creating trip request:', error);
        }
    };

    useEffect(() => {
        console.log('API response updated:', tripRequestId);
        if (tripRequestId !== '') {
            navigate(`/trip-info/${tripRequestId}`);
        }
    }, [tripRequestId, navigate]);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h1>Create Ride Request</h1>
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
                <center><button type="submit" className={styles.button}>Create Trip Request</button></center>
            </form>
            <center>
                <button onClick={handleLogout} className={styles.blueButton}>Logout</button></center>
        </div>
    );
}

export default RideRequest;