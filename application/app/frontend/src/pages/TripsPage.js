import React from 'react';
import TripCard from '../components/TripCard';
import { useNavigate } from "react-router-dom";
import '../styles/TripCard.css';

const riders = [
  { id: 1, name: "Shristi Gupta", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 2, name: "Mohamad Dabboussy", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 3, name: "Bailey Stoodley", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 4, name: "Henry Batt", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 5, name: "Ferdi Sungkar", startingPoint: "201 Main Street", destination: "250 Ann Street" },
  { id: 6, name: "Khanh Vy", startingPoint: "201 Main Street", destination: "250 Ann Street" }
];

const TripList = () => {
  const navigate = useNavigate()

  const tripInfo = (passengerId) => {
    navigate(`/trip/${passengerId}`);
  }

  return (
    <div>
      <div className="container">
        <h1> Trips </h1>
      </div>
      <div className="container">
        {riders.map(passenger => (
          <TripCard
            key={passenger.id}
            riderName={passenger.name}
            startingPoint={passenger.startingPoint}
            destination={passenger.destination}
            onClickCard={() => tripInfo(passenger.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TripList;