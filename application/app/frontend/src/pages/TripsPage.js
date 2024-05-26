import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../components/UserContext';
import '../styles/TripInformationPage.css';
import ApprovedTripCard from '../components/ApprovedTripCard';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [tripDetails, setTripDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [tripsLoaded, setTripsLoaded] = useState(false);

  const navigate = useNavigate();
  const tripInfo = (passengerId) => {
    navigate(`/trips/${passengerId}`);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/trip/get/approved', {
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
        setTripsLoaded(true);
      }
    };

    fetchTrips();
  }, [user.username]);

  const fetchTripDetails = async (trip_id) => {
    try {
      const response = await fetch('/trip_requests/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          trip_request_id: trip_id
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAllTripDetails = async () => {
      setLoading(true);
      const allDetails = await Promise.all(trips.map(trip => fetchTripDetails(trip)));
      setTripDetails(allDetails.filter(detail => detail !== null));
      setLoading(false);
    };

    if (trips.length > 0) {
      fetchAllTripDetails();
    }
  }, [trips]);

  return (
    <div>
      <div>
        <h1>Trips</h1>
      </div>
      <div class="container">
        {tripDetails.map((trip, index) => (
          <ApprovedTripCard
            key={index}
            riderName={trip.passenger_name}
            startingPoint={trip.start_address}
            destination={"test"}
            onClickCard={() => tripInfo(trip.passenger_name)}
          />
        ))}
      </div>
    </div>
  );
};

export default TripsPage;
