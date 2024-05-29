import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RiderCard from './RiderCard';
import { getNearbyTripRequests, approveRequest } from '../api/api';
import { UserContext } from './UserContext';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import styles from '../styles/TripRequest.module.css';

function RideRequests() {
  const { user } = useContext(UserContext);
  const username = user.username;
  const { tripId } = useParams();
  const [tripRequests, setTripRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripRequests = async () => {
      try {
        const response = await getNearbyTripRequests(tripId, username);

        if (response && Array.isArray(response)) {
          setTripRequests(response);
        } else {
          setErrorMessage('Data received is not valid');
          console.error('Data received is not an array:', response);
        }
      } catch (error) {
        setErrorMessage('Failed to fetch trip requests.');
        console.error('Failed to fetch trip requests:', error);
      }
    };
    fetchTripRequests();
  }, [tripId, username]);

  const handleApprove = async (tripRequestId) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      const response = await approveRequest(username, tripRequestId, tripId);
      setSuccessMessage(response.message);
      setTripRequests(tripRequests.filter(request => request.id !== tripRequestId));
    } catch (error) {
      console.error('Failed to approve ride request:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <center><h1>Available Ride Requests</h1></center>
      {errorMessage && <Alert severity="info">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <center>
        <div>
          {tripRequests.length > 0 ? (
            tripRequests.map(tripRequest => (
              <RiderCard
                key={tripRequest.id}
                riderName={tripRequest.passenger_name}
                startingPoint={tripRequest.start_address}
                destination={tripRequest.end_address}
                onApprove={() => handleApprove(tripRequest.id)}
              />
            ))
          ) : (
            <p>No ride requests available.</p>
          )}
        </div>
        <button onClick={() => navigate(`/trips/${tripId}`)} className={styles.blueButton}>Go to your Trips Page</button>
      </center>
    </div>
  );
};

export default RideRequests;
