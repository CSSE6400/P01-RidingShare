import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../components/UserContext';
import "leaflet/dist/leaflet.css";
import 'leaflet/dist/images/marker-shadow.png';
import '../styles/ApprovedTrips.css';
import ApprovedTripCard from '../components/ApprovedTripCard';
import Alert from '@mui/material/Alert';


const TripsPage = () => {
  const { tripId } = useParams();
  const [trips, setTrips] = useState([]);
  const [tripDetails, setTripDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const tripInfo = (tripRequestId) => {
    navigate(`/trip-info/${tripRequestId}`);
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
            trip_id: tripId,
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
      }
    };

    fetchTrips();
  }, [user.username, tripId]);

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

  if (loading) {
    return <div>Loading trips...</div>;
  }

  if (!trips.length) {
    return (
      <div className="container">
        <Alert severity="info">No approved trips available.</Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Trips</h1>
      </div>
      <div className="trip-list">
        {tripDetails.map((trip, index) => (
          <ApprovedTripCard
            key={index}
            riderName={trip.passenger_name}
            startingPoint={trip.start_address}
            destination={trip.end_address}
            onClickCard={() => tripInfo(trip.id)}
          />
        ))}
      </div>
      <button onClick={() => navigate(`/map/${tripId}`)} className={"blueButton"}>Go to Map</button>
    </div>
  );
};

export default TripsPage;
