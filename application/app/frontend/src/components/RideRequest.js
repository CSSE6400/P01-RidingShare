import React, { useContext, useState } from 'react';
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
                pickup_location: {...pickupCoords, "address": pickupAddress},
                dropoff_location: {...dropoffCoords, "address": dropoffAddress},
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
            } else {
                throw new Error('Failed to create trip request');
            }
        } catch (error) {
            console.error('Error creating trip request:', error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div>
            <h1>Create Ride Request</h1>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.gridContainer}>
                    <label className={styles.fullWidth}>
                        Pickup Window Start:
                        <input type="datetime-local" name="pickup_window_start" value={tripWindows.pickup_window_start.replace(':00', '')} onChange={handleTimeChange} className={errors.pickup_window_start ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        Pickup Window End:
                        <input type="datetime-local" name="pickup_window_end" value={tripWindows.pickup_window_end.replace(':00', '')} onChange={handleTimeChange} className={errors.pickup_window_end ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        Pickup Address:
                        <input type="text" value={pickupAddress} onChange={(e) => handleAddressChange(e, "pickup")} className={errors.pickup ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        Dropoff Address:
                        <input type="text" value={dropoffAddress} onChange={(e) => handleAddressChange(e, "dropoff")} className={errors.dropoff ? styles.errorInput : styles.inputField} />
                    </label>
                </div>
                <button type="submit" className={styles.button}>Create Trip Request</button>
            </form>
            <button onClick={handleLogout} className={styles.blueButton}>Logout</button>
        </div>
    );
}

export default RideRequest;
