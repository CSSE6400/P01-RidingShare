import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../components/UserContext';
import '../styles/TripCard.css';
import ApprovedTripCard from '../components/ApprovedTripCard';

const TripsPage = () => {
  const [trips, setTrips] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const navigate = useNavigate()
  const tripInfo = (passengerId) => {
    navigate(`/trips/${passengerId}`);
  }

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/trip/get/approved', { // Use your actual base URL here
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            trip_id: "d0c0db22-b4ce-4578-8be5-14f5cc2b30fb",
            username: user.username
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTrips(data.accepted_trips);
        } else {
          console.error('Failed to fetch trips');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
        console.log(trips);
      }
    };

    fetchTrips();
  }, [trips, user.username]);

  if (loading) {
    return <div>Loading approved trips...</div>;
  }

  if (!trips.length) {
    return <div>Driver hasn't approve any trips</div>;
  }

  return (
    <div class="container">
      <h1>Trips</h1>
      <div className="trip-list">
        {trips.map((trip) => (
          <ApprovedTripCard 
            riderName={trip}
            startingPoint={"starting"}
            destination={"destination"}
            onClickCard={() => tripInfo(trip)}
          />
        ))}
      </div>
    </div>
  );
};
export default TripsPage;