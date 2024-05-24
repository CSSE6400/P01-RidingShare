// TripCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TripCard.css';

const TripCard = ({ trip }) => {
    const navigate = useNavigate();
  
    if (!trip) {
      console.error('Trip is undefined');
      return null;
    }
  
    const handleCardClick = () => {
      navigate(`/trip/${trip.id}`);
    };
  
    return (
      <div className="trip-card" onClick={handleCardClick}>
        <h3>Trip ID: {trip.id}</h3>
        <p>Driver ID: {trip.driver_id}</p>
        <p>Status: {trip.status}</p>
        <p>Seats Remaining: {trip.seats_remaining}</p>
        <p>Start Location: {trip.start_address}</p>
        <p>End Location: {trip.end_address}</p>
        <p>Start Time: {new Date(trip.start_time).toLocaleString()}</p>
        <p>End Time: {new Date(trip.end_time).toLocaleString()}</p>
      </div>
    );
  };
  
  export default TripCard;