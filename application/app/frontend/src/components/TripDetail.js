// TripDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const TripDetail = () => {
  const { tripId } = useParams();

  return (
    <div>
      <h2>Trip Detail</h2>
      <p>Trip ID: {tripId}</p>
    </div>
  );
};

export default TripDetail;
