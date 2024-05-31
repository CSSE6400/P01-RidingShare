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
  const password = user.password;
  const { tripId } = useParams();
  const [tripRequests, setTripRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripRequests = async () => {
      try {
        const data = await getNearbyTripRequests(tripId, username, password);
        setTripRequests(data.Trips);
    } catch (error) {
        setErrorMessage('Failed to fetch trip requests.');
        console.error('Failed to fetch trip requests:', error);
      }
    };
    fetchTripRequests();
  }, [password, tripId, username]);

  const handleApprove = async (tripRequestId) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      const response = await approveRequest(username, password, tripRequestId, tripId);
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
            <Alert severity="info">No ride requests available.</Alert>
          )}
        </div>
        <button onClick={() => navigate(-1)} className={styles.blueButton}>Back</button>
        <button onClick={() => navigate(`/trips/${tripId}`)} className={styles.blueButton}>Go to your Trips Page</button>
      </center>
    </div>
  );
};

export default RideRequests;
