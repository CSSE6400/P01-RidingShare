import React from 'react';
import './RiderCard.css';

const RiderCard = ({ riderName, startingPoint, destination }) => {
  return (
    <div className="rider-card">
      <div className="rider-info">
        <h3>{riderName}</h3>
        <p>{startingPoint}</p>
        <p>{destination}</p>
      </div>
    </div>
  );
};

export default RiderCard;