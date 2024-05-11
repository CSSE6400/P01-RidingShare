import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchCoordinates } from '../api/api';
import styles from './TripRequest.module.css';

function TripRequest() {
    const location = useLocation();
    const { username } = location.state;
    const [startAddress, setStartAddress] = useState('');
    const [endAddress, setEndAddress] = useState('');
    const [tripDetails, setTripDetails] = useState({
        start_time: "",
        end_time: "",
        seats_remaining: "",
        distance_addition: ""
    });
    const [errors, setErrors] = useState({});

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
        const localTime = new Date(value);
        const isoUtcTime = localTime.toISOString().replace(/\.\d{3}/, ''); 
        setTripDetails(prevState => ({
            ...prevState,
            [name]: isoUtcTime
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
        // Check for empty fields and add error message
        if (!startAddress) newErrors.start = true;
        if (!endAddress) newErrors.end = true;
        Object.keys(tripDetails).forEach(key => {
            if (!tripDetails[key]) newErrors[key] = true;
        });

        setErrors(newErrors);
        // Return true if there are no errors
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
                username,
                start_location: startCoords,
                end_location: endCoords
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
                const data = await response.json();
                console.log('Trip created successfully:', data);
            } else {
                throw new Error('Failed to create trip');
            }
        } catch (error) {
            console.error('Error creating trip:', error);
        }
    };

    return (
        <div>
            <h1>Create Trip Request</h1>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <div className={styles.flexRow}>
                    <label className={styles.fullWidth}>
                        Start Time:
                        <input type="datetime-local" name="start_time" value={tripDetails.start_time.slice(0, -1)} onChange={handleTimeChange} className={errors.start_time ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        End Time:
                        <input type="datetime-local" name="end_time" value={tripDetails.end_time.slice(0, -1)} onChange={handleTimeChange} className={errors.end_time ? styles.errorInput : styles.inputField} />
                    </label>
                </div>
                <div className={styles.flexRow}>
                    <label className={styles.fullWidth}>
                        Start Address:
                        <input type="text" value={startAddress} onChange={(e) => handleAddressChange(e, "start")} className={errors.start ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        End Address:
                        <input type="text" value={endAddress} onChange={(e) => handleAddressChange(e, "end")} className={errors.end ? styles.errorInput : styles.inputField} />
                    </label>
                </div>
                <div className={styles.flexRow}>
                    <label className={styles.fullWidth}>
                        Seats Remaining:
                        <input type="number" name="seats_remaining" value={tripDetails.seats_remaining} onChange={handleChange} className={errors.seats_remaining ? styles.errorInput : styles.inputField} />
                    </label>
                    <label className={styles.fullWidth}>
                        Distance Addition (km):
                        <input type="number" name="distance_addition" value={tripDetails.distance_addition} onChange={handleChange} className={errors.distance_addition ? styles.errorInput : styles.inputField} />
                    </label>
                </div>
                <button type="submit" className={styles.button}>Create Trip</button>
            </form>
        </div>
    );
}

export default TripRequest;
