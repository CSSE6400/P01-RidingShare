import React from 'react';
import RiderCard from './RiderCard';

const riders = [
  { id: 1, name: "Shristi Gupta", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 2, name: "Mohamad Dabboussy", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 2, name: "Bailey Stoodley", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 2, name: "Henry Batt", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 2, name: "Ferdi Sungkar", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 2, name: "Khanh Vy", startingPoint: "201 Main Street", destination: "250 Ann Street" }
];

const RiderList = () => {
  return (
    <div>
      <h1>Available Ride Requests</h1>
      <div>
        {riders.map(passenger => (
          <RiderCard
            key={passenger.id}
            riderName={passenger.name}
            startingPoint={passenger.startingPoint}
            destination={passenger.destination}
          />
        ))}
      </div>
    </div>
  );
};

export default RiderList;
