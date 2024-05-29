import React, { useState, useEffect, useContext } from 'react';
import TripCard from './TripCard';
import { UserContext } from './UserContext';
import '../styles/TripList.css';
import Alert from '@mui/material/Alert';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/trips/get/all', { // Use your actual base URL here
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ username: user.username }), // Use the username from context
        });

        if (response.ok) {
          const data = await response.json();
          setTrips(data.trips);
        } else {
          console.error('Failed to fetch trips');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user.username]);

  if (loading) {
    return <div>Loading trips...</div>;
  }

  if (!trips.length) {
    return <Alert severity="info">No trips available.</Alert>
  }

  return (
    <div className="trip-list">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default TripList;
