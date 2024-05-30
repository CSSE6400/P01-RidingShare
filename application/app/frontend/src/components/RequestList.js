import React, { useState, useEffect, useContext } from 'react';
import RequestCard from './RequestCard';
import { UserContext } from './UserContext';
import '../styles/TripList.css';
import styles from '../styles/TripRequest.module.css';
import { useNavigate } from 'react-router-dom';

const RequestList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/trip_requests/get/all', { // Use your actual base URL here
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ username: user.username }), // Use the username from context
        });

        if (response.ok) {
          const data = await response.json();
          setTrips(data.trip_requests);
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
    return (
      <div>
        <div>No trips available.</div>
        <center><button onClick={() => navigate(-1)} className={styles.blueButton}>Back</button></center>
      </div>
    );
  }

  return (
    <div>
      <div className="trip-list">
        {trips.map((trip) => (
          <RequestCard key={trip.id} trip={trip} />
        ))}
      </div>
      <center>
        <button onClick={() => navigate(-1)} className={styles.blueButton}>Back</button>
      </center>
    </div>
  );
};

export default RequestList;
