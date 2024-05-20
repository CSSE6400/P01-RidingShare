import React, { useState, useEffect, useContext } from 'react';
import RiderCard from './RiderCard';
import { getPendingTripRequests } from '../api/api';
import { UserContext } from './UserContext';

function RideRequests() {
  const { user } = useContext(UserContext);
  const [tripRequests, setTripRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripRequests = async () => {
      try {
        const username = 'jDoe12';
        const response = await getPendingTripRequests(username);

        if (response && Array.isArray(response.trip_requests)) {
          setTripRequests(response.trip_requests);
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
  }
);

  return (
    <div>
      <h1>Available Ride Requests</h1>
      <div>
        {tripRequests.map(tripRequest => (
          <RiderCard
            key={tripRequest.id}
            riderName={tripRequest.passenger_id}
            startingPoint={tripRequest.pickup_location}
            destination={tripRequest.dropoff_location}
          />
        ))}
      </div>
    </div>
  );
};

export default RideRequests;
