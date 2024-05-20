import React, { useState, useEffect, useContext } from 'react';
import RiderCard from './RiderCard';
import { getNearbyTripRequests } from '../api/api';
import { UserContext } from './UserContext';
import { useParams } from 'react-router-dom';

function RideRequests() {
  const { user } = useContext(UserContext);
  const username = user.username;
  const { tripId } = useParams();
  const [tripRequests, setTripRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripRequests = async () => {
      try {
        const response = await getNearbyTripRequests(tripId, username);

        if (response && Array.isArray(response)) {
          setTripRequests(response);
        } else {
          setError('Data received is not valid');
          console.error('Data received is not an array:', response);
        }
      } catch (error) {
        setError('Failed to fetch trip requests.');
        console.error('Failed to fetch trip requests:', error);
      }
    };
    fetchTripRequests();
  }, [tripId, username]);

  return (
    <div>
      <h1>Available Ride Requests</h1>
      <div>
        {tripRequests.length > 0 ? (
          tripRequests.map(tripRequest => (
          <RiderCard
            key={tripRequest.id}
            riderName={tripRequest.passenger_name}
            startingPoint={tripRequest.start_address}
            destination={tripRequest.end_address}
          />
        ))
      ) : (
          <p>No ride requests available.</p>
        )}
      </div>
    </div>
  );
};

export default RideRequests;
