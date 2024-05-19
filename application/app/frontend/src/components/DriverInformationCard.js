import React from 'react';
import '../styles/DriverInformationCard.css';

const DriverInformationCard = ({ driversName, carRepoNo, estimatedPickupTime }) => {
  return (
    <div className="card">
      <div className="rider-info">
        <p>Driver's Name</p>
        <h3>{driversName}</h3>
        <p>Driver's Car Registration No</p>
        <h3>{carRepoNo}</h3>
        <p>Estimated Time of Pick Up</p>
        <h3>{estimatedPickupTime}</h3>
      </div>
    </div>
  );
};

export default DriverInformationCard;