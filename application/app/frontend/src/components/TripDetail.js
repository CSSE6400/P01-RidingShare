// TripDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/TripRequest.module.css';
import { useNavigate } from 'react-router-dom';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Trip Detail</h2>
      <p>Trip ID: {tripId}</p>
      <center>
        <button onClick={() => navigate(-1)} className={styles.blueButton}>Back</button>
      </center>
    </div>
  );
};

export default TripDetail;
