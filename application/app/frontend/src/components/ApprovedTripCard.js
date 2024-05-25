import React from 'react';
import '../styles/TripCard.css';

const ApporvedTripCard = ({ riderName, startingPoint, destination, onClickCard }) => {
  return (
    <div className="trip-card" onClick={onClickCard}>
        <div className="trip-info">
            <p>{riderName}</p>
            <h3>{startingPoint}</h3>
            <h3>{destination}</h3>
        </div>
    </div>
    
  );
};

export default ApporvedTripCard;