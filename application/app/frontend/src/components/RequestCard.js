import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TripCard.css';

const RequestCard = ({ trip }) => {
    const navigate = useNavigate();
  
    if (!trip) {
      console.error('Trip is undefined');
      return null;
    }
  
    const handleCardClick = () => {
      navigate(`/trip-info/${trip.id}`);
    };

  
    return (
      <div>
        <div className="trip-card" onClick={handleCardClick}>
          <h3>Request ID: {trip.id}</h3>
          <p>Status: {trip.status}</p>
          <p>Start Location: {trip.start_address}</p>
          <p>End Location: {trip.end_address}</p>
          <p>Start Time: {new Date(trip.window_start_time).toLocaleString()}</p>
          <p>End Time: {new Date(trip.window_end_time).toLocaleString()}</p>
        </div>
      </div>
    );
  };
  
  export default RequestCard;
